import { Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Sky } from './Sky';
import { Phoenix } from './Phoenix';
import { SeasonParticles } from './SeasonParticles';
import { journey } from './journey';
import { scrollState } from '../lib/scroll';

// If the GPU drops the WebGL context (memory pressure on high-DPI displays),
// tell the browser we'll recover so it fires `restored` instead of leaving a
// dark canvas. The emergence is wall-clock based, so a restore won't replay it.
function ContextGuard() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (e: Event) => e.preventDefault();
    canvas.addEventListener('webglcontextlost', onLost as EventListener, false);
    return () => canvas.removeEventListener('webglcontextlost', onLost as EventListener);
  }, [gl]);
  return null;
}

function CameraRig() {
  const P = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(0, 16, -40), []);
  const fwd = useMemo(() => new THREE.Vector3(0, 16, -80), []);
  const camPos = useMemo(() => new THREE.Vector3(0, 18, 40), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    journey(scrollState.progress, P);
    camPos.set(state.pointer.x * 3, 18 + state.pointer.y * 2, 40);
    state.camera.position.lerp(camPos, 0.08);
    tmp.copy(fwd).lerp(P, 0.7);
    look.lerp(tmp, 0.12);
    state.camera.lookAt(look);
  });
  return null;
}

export function Scene() {
  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ fov: 58, near: 0.1, far: 3000, position: [0, 18, 40] }}
    >
      <color attach="background" args={['#0a0a1e']} />
      <ContextGuard />
      <Sky />
      <Suspense fallback={null}><Phoenix /></Suspense>
      <SeasonParticles />
      <CameraRig />
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.8} luminanceSmoothing={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}
