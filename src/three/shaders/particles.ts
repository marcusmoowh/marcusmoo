export const PT_VERT = /* glsl */ `
attribute vec3 aTarget;
attribute vec3 aColor;
attribute float aRnd;
attribute float aSize;
attribute float aSpk;
uniform float uTime, uEE, uPix, uOpacity;
varying vec3 vC;
varying float vA;
varying float vSpk;
varying float vDepth;
varying float vTw;
void main(){
  vec3 pos = mix(position, aTarget, uEE);
  float sw = 1.0 - uEE;                          // 1 scattered -> 0 formed
  // drifting life while gathering
  pos.x += (sin(uTime*1.3+aRnd*40.0)*0.9 + sin(uTime*2.7+aRnd*12.0)*0.3)*sw;
  pos.y += (cos(uTime*1.1+aRnd*53.0)*0.9 + cos(uTime*2.3+aRnd*22.0)*0.3)*sw;
  pos.z += (sin(uTime*0.9+aRnd*61.0)*0.9 + sin(uTime*3.1+aRnd*7.0)*0.3)*sw;

  // colour straight from the cosmic-spiral GLB texture (sRGB -> linear, like the phoenix)
  vec3 c = pow(max(aColor, 0.0), vec3(2.2));
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(l), c, 1.28);                      // +saturation so the cosmic pinks pop
  c = clamp(c, 0.0, 4.0);
  c *= 0.95 + 0.1*sin(uTime*1.6 + aRnd*30.0);     // subtle, slow shimmer
  vC = c;

  vTw = 0.5 + 0.5*sin(uTime*1.1 + aRnd*22.0);     // slow twinkle (no flicker)
  vSpk = aSpk;
  vA = uOpacity * (0.84 + 0.16*vTw);

  vec4 mv = modelViewMatrix * vec4(pos,1.0); vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
  // clamp size: max stops a near-lens flash, min stops sub-pixel scintillation
  float ps = aSize*uPix*(0.85+0.15*vTw)*(1.0+aSpk*1.1)*(22.0/max(-mv.z, 8.0));
  gl_PointSize = clamp(ps, 1.0, 30.0);
}
`;

export const PT_FRAG = /* glsl */ `
precision highp float;
varying vec3 vC;
varying float vA;
varying float vSpk;
varying float vDepth;
varying float vTw;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d);
  if(r > 0.5) discard;
  float core  = smoothstep(0.5, 0.0, r);
  float glow  = pow(core, 1.4);
  float crisp = pow(core, 3.0);
  float ang = atan(d.y, d.x);
  float spikes = pow(abs(cos(ang*2.0)), 22.0) + pow(abs(sin(ang*2.0)), 22.0);
  float star = spikes * smoothstep(0.5, 0.0, r) * vSpk * (0.6 + 0.4*vTw);
  float depth = clamp(1.2-(vDepth-25.0)/180.0, 0.55, 1.2);
  vec3 col = vC*(1.0 + 0.6*glow)*depth;          // the colour, brighter core (normal-blended)
  col += vec3(1.0)*crisp*vSpk*0.3;               // small white hot only on sparkles
  col += vC*star*0.9;                            // coloured star rays
  float a = clamp(glow*0.95 + crisp*0.25 + star*0.45, 0.0, 1.0) * vA;
  gl_FragColor = vec4(col, a);
}
`;
