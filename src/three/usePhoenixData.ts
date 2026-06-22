import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const MODEL_URL = '/models/phoenix.glb';
const TARGET_SPAN = 13; // world units for the model's largest dimension (wingspan)

export type PhoenixData = {
  geometry: THREE.BufferGeometry;
  map: THREE.Texture | null;
  scale: number;
};

let cache: PhoenixData | null = null;

export function usePhoenixData(): PhoenixData {
  const { scene } = useGLTF(MODEL_URL);
  return useMemo(() => {
    if (cache) return cache;
    let mesh: THREE.Mesh | null = null;
    scene.updateMatrixWorld(true);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && !mesh) mesh = m;
    });
    if (!mesh) {
      cache = { geometry: new THREE.BufferGeometry(), map: null, scale: 1 };
      return cache;
    }
    const src = mesh as THREE.Mesh;
    const geo = (src.geometry as THREE.BufferGeometry).clone();
    geo.applyMatrix4(src.matrixWorld);
    geo.computeBoundingBox();
    const box = geo.boundingBox as THREE.Box3;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    // center geometry at the origin so rotation/scale stay simple
    geo.translate(-center.x, -center.y, -center.z);
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const scale = TARGET_SPAN / maxDim;
    let map: THREE.Texture | null = null;
    const mat = src.material as THREE.MeshStandardMaterial;
    if (mat && mat.map) {
      map = mat.map;
      map.colorSpace = THREE.SRGBColorSpace;
      map.flipY = false;
    }
    cache = { geometry: geo, map, scale };
    return cache;
  }, [scene]);
}

useGLTF.preload(MODEL_URL);
