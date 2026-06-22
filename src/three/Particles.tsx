import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PT_VERT, PT_FRAG } from './shaders/particles';
import { spiralColors } from './spiralColors';
import { emerge } from '../lib/scroll';

const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// Rainbow-cosmic particles that gather from a diffuse cloud into the phoenix's
// own shape, then dissolve as the bird reveals. Colours come from the cosmic
// spiral GLB's texture (sampled at build time into spiralColors). Uses the
// phoenix geometry directly, so there is NO second model to load at runtime.
export function Particles({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ptsRef = useRef<THREE.Points>(null);

  const { geo, uniforms } = useMemo(() => {
    const gp = geometry.getAttribute('position') as THREE.BufferAttribute;
    const tot = gp ? gp.count : 0;
    const N = Math.min(2400, tot);
    const step = Math.max(1, Math.floor(tot / Math.max(N, 1)));
    geometry.computeBoundingSphere();
    const R = geometry.boundingSphere ? geometry.boundingSphere.radius : 1;
    const palLen = Math.floor(spiralColors.length / 3);

    const start = new Float32Array(N * 3);
    const target = new Float32Array(N * 3);
    const aColor = new Float32Array(N * 3);
    const aRnd = new Float32Array(N);
    const aSize = new Float32Array(N);
    const aSpk = new Float32Array(N);
    let idx = 0;
    for (let i = 0; i < tot && idx < N; i += step) {
      const j = idx * 3;
      target[j] = gp.getX(i); target[j + 1] = gp.getY(i); target[j + 2] = gp.getZ(i);
      const rr = R * (0.5 + Math.random() * 0.9);
      const a = Math.random() * 6.283;
      const b = Math.acos(2 * Math.random() - 1);
      start[j] = Math.sin(b) * Math.cos(a) * rr;
      start[j + 1] = Math.cos(b) * rr;
      start[j + 2] = Math.sin(b) * Math.sin(a) * rr;
      // pick a colour straight from the GLB's texture palette
      const ci = (Math.random() * palLen) | 0;
      aColor[j] = spiralColors[ci * 3];
      aColor[j + 1] = spiralColors[ci * 3 + 1];
      aColor[j + 2] = spiralColors[ci * 3 + 2];
      aRnd[idx] = Math.random();
      aSize[idx] = (5 + Math.random() * 13) * 0.42; // 30% smaller
      aSpk[idx] = Math.random() < 0.16 ? 1 : 0;
      idx++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(start, 3));
    g.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3));
    g.setAttribute('aRnd', new THREE.BufferAttribute(aRnd, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
    g.setAttribute('aSpk', new THREE.BufferAttribute(aSpk, 1));

    const uniforms = {
      uTime: { value: 0 },
      uEE: { value: 0 },
      uOpacity: { value: 1 },
      uPix: { value: Math.min((typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1, 2) },
    };
    return { geo: g, uniforms };
  }, [geometry]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const morph = emerge.progress;
    uniforms.uTime.value = t;
    uniforms.uEE.value = smoother(clamp01(morph / 0.6));
    uniforms.uOpacity.value = morph < 0.6 ? 1 : Math.max(0, 1 - (morph - 0.6) / 0.4);
    if (ptsRef.current) ptsRef.current.visible = morph < 1;
  });

  return (
    <points ref={ptsRef} geometry={geo} frustumCulled={false} renderOrder={2}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={PT_VERT}
        fragmentShader={PT_FRAG}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
        toneMapped={false}
      />
    </points>
  );
}
