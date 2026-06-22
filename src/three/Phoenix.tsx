import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PHX_VERT, PHX_FRAG } from './shaders/phoenix';
import { journey } from './journey';
import { scrollState, emerge } from '../lib/scroll';
import { usePhoenixData } from './usePhoenixData';
import { Particles } from './Particles';

// Base orientation that turns the upright, forward-facing emblem into a
// horizontal flier whose head leads along the flight path (so it looks away).
// Flip x to -Math.PI/2 to invert pitch, or add y: Math.PI if head/tail read reversed.
const BASE_ROT: [number, number, number] = [Math.PI / 2, 0, 0];

export function Phoenix() {
  const { geometry, map, scale } = usePhoenixData();
  const rig = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlapAmp: { value: 0.35 },
      uFlapSpeed: { value: 1.7 },
      uGlow: { value: 0 },
      uMorph: { value: 0 },
      uMap: { value: map },
    }),
    [map]
  );

  const P = useMemo(() => new THREE.Vector3(), []);
  const Pa = useMemo(() => new THREE.Vector3(), []);
  const Pb = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const sdir = useMemo(() => new THREE.Vector3(1, 0, 0), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Drive the one-time emergence off the wall clock (performance.now), NOT the
    // R3F clock. If the WebGL context is lost and restored, the R3F clock restarts
    // at 0 — the old logic then replayed the whole particle intro (the flash +
    // re-forming seen in the screen recording). performance.now keeps climbing, so
    // once the intro has finished it STAYS finished across any restore/remount.
    const wall = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (emerge.t0 < 0) emerge.t0 = wall;
    emerge.progress = Math.min(1, (wall - emerge.t0) / 4000);

    const s = scrollState.progress;
    journey(s, P);
    journey(Math.min(1, s + 0.012), Pa);
    journey(Math.max(0, s - 0.012), Pb);
    dir.copy(Pa).sub(Pb);
    if (dir.lengthSq() > 1e-6) dir.normalize();
    sdir.lerp(dir, 0.1).normalize();

    if (rig.current) {
      const yb = P.y + Math.sin(t * 1.1) * 0.4;
      // Rise out of the spiral: start a little low and lift into place as the
      // phoenix reveals (uMorph reveal kicks in at 0.6).
      const reveal = THREE.MathUtils.clamp((emerge.progress - 0.6) / 0.4, 0, 1);
      const er = reveal * reveal * (3 - 2 * reveal);
      const rise = (1 - er) * 6;
      rig.current.position.set(P.x, yb - rise, P.z);
      // Face NORTH (-Z, away from camera) continuously. BASE_ROT aligns the head
      // to the rig's +Z, and yaw = PI turns that to -Z. Gentle pitch/bank add life.
      const pitch = THREE.MathUtils.clamp(sdir.y * 0.45, -0.4, 0.4);
      const roll = THREE.MathUtils.clamp(-sdir.x * 0.5, -0.5, 0.5);
      rig.current.rotation.set(pitch, Math.PI, roll);
    }

    const climb = Math.min(1, Math.max(0, 0.5 + (Pa.y - Pb.y) * 0.5));
    uniforms.uTime.value = t;
    uniforms.uFlapAmp.value = 0.34 + 0.3 * climb;
    uniforms.uFlapSpeed.value = 1.3 + 0.6 * climb;
    uniforms.uMorph.value = emerge.progress;
    uniforms.uGlow.value = 0.1 + 0.08 * Math.abs(Math.sin(t * 1.3));
  });

  if (!geometry || !geometry.getAttribute('position')) return null;

  return (
    <group ref={rig}>
      <group rotation={BASE_ROT} scale={scale}>
        <mesh geometry={geometry} frustumCulled={false} renderOrder={1}>
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={PHX_VERT}
            fragmentShader={PHX_FRAG}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Particles geometry={geometry} />
      </group>
    </group>
  );
}
