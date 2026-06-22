import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SP_VERT, SP_FRAG } from './shaders/season';
import { scrollState } from '../lib/scroll';

type SP = { color: THREE.Color; size: number; fall: number; sway: number; aspect: number; glow: number; opacity: number };
const C = (hex: number) => new THREE.Color(hex);

// spring petals -> summer motes -> autumn leaves -> winter snow -> spring
const SEASONS: SP[] = [
  { color: C(0xffc7d9), size: 20, fall: 0.7, sway: 0.7, aspect: 0.55, glow: 0.05, opacity: 0.58 }, // sakura
  { color: C(0xffe6a0), size: 13, fall: 0.45, sway: 0.45, aspect: 1.0, glow: 0.40, opacity: 0.5 }, // motes
  { color: C(0xe8954a), size: 19, fall: 0.85, sway: 0.7, aspect: 0.55, glow: 0.05, opacity: 0.68 }, // leaves
  { color: C(0xeef4ff), size: 14, fall: 0.65, sway: 0.4, aspect: 1.0, glow: 0.10, opacity: 0.68 }, // snow
];
const LOOP = [...SEASONS, SEASONS[0]];
const ease = (x: number) => x * x * (3 - 2 * x);

const COUNT = 130; // subtle & elegant

export function SeasonParticles() {
  const ptsRef = useRef<THREE.Points>(null);

  const { geo, uniforms } = useMemo(() => {
    const aPos = new Float32Array(COUNT * 3);
    const aRnd = new Float32Array(COUNT);
    const aSpin = new Float32Array(COUNT);
    const aSpinSpeed = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      aPos[i * 3] = (Math.random() - 0.5) * 92;       // x  [-46,46]
      aPos[i * 3 + 1] = -14 + Math.random() * 62;     // y  [-14,48]
      aPos[i * 3 + 2] = -12 + Math.random() * 46;     // z  [-12,34]
      aRnd[i] = Math.random();
      aSpin[i] = Math.random() * 6.283;
      aSpinSpeed[i] = (Math.random() - 0.5) * 0.9;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('aPos', new THREE.BufferAttribute(aPos, 3));
    g.setAttribute('position', new THREE.BufferAttribute(aPos.slice(), 3)); // placeholder
    g.setAttribute('aRnd', new THREE.BufferAttribute(aRnd, 1));
    g.setAttribute('aSpin', new THREE.BufferAttribute(aSpin, 1));
    g.setAttribute('aSpinSpeed', new THREE.BufferAttribute(aSpinSpeed, 1));
    const u = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color() },
      uSize: { value: 20 }, uFall: { value: 1 }, uSway: { value: 1 },
      uAspect: { value: 0.6 }, uGlow: { value: 0.1 }, uOpacity: { value: 0.8 },
    };
    return { geo: g, uniforms: u };
  }, []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const p = Math.min(1, Math.max(0, scrollState.progress));
    const s = p * 4;
    let i = Math.floor(s); if (i > 3) i = 3;
    const f = ease(s - i);
    const a = LOOP[i], b = LOOP[i + 1];
    uniforms.uColor.value.copy(a.color).lerp(b.color, f);
    uniforms.uSize.value = a.size + (b.size - a.size) * f;
    uniforms.uFall.value = a.fall + (b.fall - a.fall) * f;
    uniforms.uSway.value = a.sway + (b.sway - a.sway) * f;
    uniforms.uAspect.value = a.aspect + (b.aspect - a.aspect) * f;
    uniforms.uGlow.value = a.glow + (b.glow - a.glow) * f;
    uniforms.uOpacity.value = a.opacity + (b.opacity - a.opacity) * f;
  });

  return (
    <points ref={ptsRef} geometry={geo} frustumCulled={false} renderOrder={6}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={SP_VERT}
        fragmentShader={SP_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
