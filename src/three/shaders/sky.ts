export const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Painterly, Ghibli-like sky — dimmed for readability and layered for depth.
export const SKY_FRAG = /* glsl */ `
precision highp float;
varying vec3 vDir;
uniform float u_time, uLightStrength, uCloudCover, uRenewal;
uniform vec3 uHorizon, uMid, uZenith, uLightColor, uLightDir, uCloudTint;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<6;i++){ v+=a*noise(p); p=p*2.04+vec2(3.1,1.7); a*=0.5; } return v; }

void main(){
  vec3 d = normalize(vDir);
  float up = clamp(d.y*0.5 + 0.5, 0.0, 1.0);
  float t = u_time;

  // base gradient
  vec3 sky = mix(uHorizon, uMid, smoothstep(0.0, 0.5, up));
  sky = mix(sky, uZenith, smoothstep(0.5, 1.0, up));

  // atmospheric horizon haze for depth
  vec3 haze = mix(uHorizon, uCloudTint, 0.4) * 0.92;
  sky = mix(sky, haze, smoothstep(0.42, 0.0, up) * 0.35);

  // signature light: soft directional glow (no hard sun, gentler now)
  vec3 L = normalize(uLightDir);
  float ld = clamp(dot(d, L), 0.0, 1.0);
  float glow = pow(ld, 7.0) * 0.48 + pow(ld, 2.4) * 0.15;
  sky += uLightColor * glow * uLightStrength;

  // THREE cloud layers (far → near) for parallax depth
  vec2 cuv = d.xz / (abs(d.y) + 0.26);
  float far  = fbm(cuv*0.8 + vec2(t*0.004,  t*0.002));
  float mid  = fbm(cuv*1.9 + vec2(-t*0.009, t*0.005) + far*0.6);
  float near = fbm(cuv*4.6 + vec2(t*0.018, -t*0.011) + mid*0.5);
  float band = smoothstep(0.24, 0.62, up);

  float cFar = smoothstep(1.0 - uCloudCover*0.9, 1.0, far);
  sky = mix(sky, mix(uCloudTint*0.85, uCloudTint, glow), cFar * 0.32 * band);

  float cMid = smoothstep(1.0 - uCloudCover, 1.0, mid*0.7 + far*0.3);
  vec3 cMidCol = mix(uCloudTint, uCloudTint + uLightColor*0.45, glow);
  sky = mix(sky, cMidCol, cMid * 0.5 * band);
  sky -= vec3(0.06,0.07,0.11) * smoothstep(0.5, 0.95, mid) * cMid * band; // shadowed undersides

  float cNear = smoothstep(1.0 - uCloudCover*0.7, 1.0, near);
  sky = mix(sky, cMidCol, cNear * 0.2 * band);

  // winter -> spring dawn bloom near the loop's end
  float horizonGlow = pow(1.0 - up, 2.5);
  sky += uLightColor * horizonGlow * uRenewal * 0.4;

  // cinematic vignette (depth + readability)
  float r = d.x*d.x + d.y*d.y;
  sky *= 1.0 - smoothstep(0.32, 1.05, r) * 0.42;

  // exposure down + gentle painterly contrast
  sky *= 0.78;
  sky = mix(sky, sky*sky*(3.0 - 2.0*sky), 0.18);
  gl_FragColor = vec4(sky, 1.0);
}
`;
