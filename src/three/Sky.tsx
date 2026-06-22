import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKY_VERT, SKY_FRAG } from './shaders/sky';
import { scrollState } from '../lib/scroll';

type Season = {
  horizon: THREE.Color; mid: THREE.Color; zenith: THREE.Color;
  light: THREE.Color; cloud: THREE.Color; lightDir: THREE.Vector3;
  strength: number; cover: number;
};
const C = (hex: number) => new THREE.Color(hex);
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize();

// spring -> summer -> autumn -> winter -> spring (loops). Each keeps ONE signature light.
const SEASONS: Season[] = [
  { // spring — soft dawn
    horizon: C(0xffd9c2), mid: C(0xcfe3ff), zenith: C(0x8fb4e8),
    light: C(0xffdcb4), cloud: C(0xffe6ef), lightDir: V(0.25, 0.16, 0.92), strength: 0.42, cover: 0.42,
  },
  { // summer — luminous midday
    horizon: C(0xb6dcf3), mid: C(0x2f93cf), zenith: C(0x114f9e),
    light: C(0xffedbe), cloud: C(0xeef6ff), lightDir: V(0.2, 0.62, 0.78), strength: 0.5, cover: 0.52,
  },
  { // autumn — golden hour
    horizon: C(0xffc89a), mid: C(0xe07b3c), zenith: C(0x5e356a),
    light: C(0xffb060), cloud: C(0xffd6a8), lightDir: V(0.36, 0.12, 0.92), strength: 0.55, cover: 0.42,
  },
  { // winter — cool twilight
    horizon: C(0xcdd7ee), mid: C(0x556699), zenith: C(0x20264c),
    light: C(0xcdd8ff), cloud: C(0xcdd6ee), lightDir: V(0.2, 0.2, 0.95), strength: 0.3, cover: 0.46,
  },
];
const LOOP = [...SEASONS, SEASONS[0]]; // 5 stops so winter blends back into spring

const ease = (x: number) => x * x * (3 - 2 * x);

export function Sky() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const s0 = SEASONS[0];
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      uHorizon: { value: s0.horizon.clone() },
      uMid: { value: s0.mid.clone() },
      uZenith: { value: s0.zenith.clone() },
      uLightColor: { value: s0.light.clone() },
      uCloudTint: { value: s0.cloud.clone() },
      uLightDir: { value: s0.lightDir.clone() },
      uLightStrength: { value: s0.strength },
      uCloudCover: { value: s0.cover },
      uRenewal: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    uniforms.u_time.value = state.clock.elapsedTime;
    const p = Math.min(1, Math.max(0, scrollState.progress));
    const s = p * 4;
    let i = Math.floor(s);
    if (i > 3) i = 3;
    const f = ease(s - i);
    const a = LOOP[i];
    const b = LOOP[i + 1];
    uniforms.uHorizon.value.copy(a.horizon).lerp(b.horizon, f);
    uniforms.uMid.value.copy(a.mid).lerp(b.mid, f);
    uniforms.uZenith.value.copy(a.zenith).lerp(b.zenith, f);
    uniforms.uLightColor.value.copy(a.light).lerp(b.light, f);
    uniforms.uCloudTint.value.copy(a.cloud).lerp(b.cloud, f);
    uniforms.uLightDir.value.copy(a.lightDir).lerp(b.lightDir, f).normalize();
    uniforms.uLightStrength.value = a.strength + (b.strength - a.strength) * f;
    uniforms.uCloudCover.value = a.cover + (b.cover - a.cover) * f;
    // dawn bloom as winter turns back to spring (last quarter of the scroll)
    uniforms.uRenewal.value = THREE.MathUtils.smoothstep(s, 3.45, 4.0);
  });

  return (
    <mesh frustumCulled={false}>
      <sphereGeometry args={[1200, 48, 24]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
