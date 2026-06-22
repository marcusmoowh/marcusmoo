export const PHX_VERT = /* glsl */ `
uniform float uTime, uFlapAmp, uFlapSpeed;
varying vec2 vUv;
varying vec3 vV;
varying float vSpan;
varying vec3 vPos;
void main(){
  vUv = uv;
  vec3 pos = position;                       // centered; wings span X, thin in Z
  float maxX = 0.96;
  float span = clamp(abs(pos.x)/maxX, 0.0, 1.0); vSpan = span;
  float sgn = sign(pos.x);
  float wf = smoothstep(0.05, 0.5, abs(pos.x));        // body still, wings move
  float ph = uTime*uFlapSpeed - span*1.7;              // tip lags shoulder (travelling wave)
  float s0 = sin(ph);
  float stroke = s0 >= 0.0 ? pow(s0, 0.65) : -pow(-s0, 1.7); // quick downstroke, soft upstroke
  float amp = uFlapAmp * (0.30 + 0.85*span);           // tips sweep far more than the base
  float a = sgn * amp * stroke * wf;
  float ca = cos(a), sa = sin(a);
  float nx = pos.x*ca + pos.z*sa;                      // beat about body axis -> dihedral
  float nz = -pos.x*sa + pos.z*ca;
  pos.x = nx; pos.z = nz;
  pos.y += cos(ph) * wf * span * 0.10;                 // fore/aft figure-eight at the tips
  pos.z += -pos.y * a * 0.18;                          // feather wash (twist with the stroke)
  pos.z += cos(uTime*uFlapSpeed) * (1.0 - wf) * 0.012; // gentle body bob
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vPos = mv.xyz; vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const PHX_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform float uGlow, uMorph, uTime;
varying vec2 vUv;
varying vec3 vV;
varying float vSpan;
varying vec3 vPos;
vec3 pal(float t){ return 0.5 + 0.5*cos(6.28318*(t + vec3(0.0,0.33,0.67))); }
void main(){
  vec3 V = normalize(vV);
  vec3 N = normalize(cross(dFdx(vPos), dFdy(vPos)));   // faceted normals -> crystal facets
  if(dot(N,V) < 0.0) N = -N;
  float ndv = clamp(dot(N,V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 3.0);

  vec3 tex = pow(texture2D(uMap, vUv).rgb, vec3(2.2)); // the model's own colours (sRGB -> linear)
  float luma = dot(tex, vec3(0.299, 0.587, 0.114));
  // refined prism: a soft rainbow (pulled toward white) that only blooms at grazing angles
  vec3 prism = mix(vec3(1.0), pal(fres*0.7 + vSpan*0.12 + uTime*0.015), 0.65);
  float band = 0.5 + 0.5*sin(fres*18.0 + vSpan*5.0 + uTime*0.35);

  vec3 col = tex * (0.60 + 0.30*ndv);                 // glassy-lit body in its own colours
  col += prism * fres * 0.16;                         // subtle prismatic rim
  col += prism * band * 0.04;                         // faint, refined interference
  col += vec3(1.0) * pow(fres, 5.0) * 0.6;            // crisp glass edge highlight
  col *= (0.95 + uGlow);

  // semi-solid glass: interior reads the colour/texture; rim stays near-opaque & glassy
  float alpha = clamp(0.55 + 0.45*fres + 0.08*luma + band*0.02, 0.0, 1.0);
  alpha *= smoothstep(0.6, 1.0, uMorph);
  gl_FragColor = vec4(col, alpha);
}
`;
