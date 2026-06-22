export const SP_VERT = /* glsl */ `
attribute vec3 aPos;
attribute float aRnd;
attribute float aSpin;
attribute float aSpinSpeed;
uniform float uTime, uFall, uSway, uSize, uAspect, uGlow, uOpacity;
uniform vec3 uColor;
varying float vSpin, vAspect, vOpacity, vGlow;
varying vec3 vColor;
void main(){
  float H = 62.0; float yMin = -14.0;
  float speed = mix(0.5, 1.3, aRnd);
  vec3 p = aPos;
  p.y = yMin + mod(aPos.y - yMin - uTime*uFall*speed, H);        // fall + wrap
  p.x = aPos.x + sin(uTime*(0.35+aRnd*0.5) + aRnd*30.0) * uSway * (0.6+aRnd*0.8);
  p.z = aPos.z + cos(uTime*(0.28+aRnd*0.4) + aRnd*17.0) * uSway * 0.4;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float sz = mix(0.7, 1.7, aRnd);
  gl_PointSize = uSize * sz * (30.0 / max(-mv.z, 1.0));           // depth-of-field sizing
  vSpin = aSpin + uTime * aSpinSpeed;
  vAspect = uAspect;
  vOpacity = uOpacity * mix(0.55, 1.0, aRnd);
  vGlow = uGlow;
  vColor = uColor;
}
`;

export const SP_FRAG = /* glsl */ `
precision highp float;
varying float vSpin, vAspect, vOpacity, vGlow;
varying vec3 vColor;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float c = cos(vSpin), s = sin(vSpin);
  uv = mat2(c, -s, s, c) * uv;          // rotate (petals/leaves twirl)
  uv.x /= max(vAspect, 0.2);            // elongate for petals/leaves, round for snow/motes
  float d = length(uv);
  float a = smoothstep(0.5, 0.16, d);   // soft edge
  vec3 col = vColor + vGlow * 0.6;
  gl_FragColor = vec4(col, a * vOpacity);
}
`;
