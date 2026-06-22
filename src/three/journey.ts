import * as THREE from 'three';

// Scroll s (0..1) -> world position. Kept in FRONT of the camera (z stays
// positive, ~6..20) so the phoenix reads closer and never flies past the lens.
export function journey(s: number, v: THREE.Vector3) {
  const x = 16 * Math.sin(s * Math.PI * 3.0 + 0.4);
  const y = 17 + 7 * Math.sin(s * Math.PI * 2.0 + 0.4);
  const z = 21.2 + 5.48 * Math.sin(s * Math.PI * 2.4 + 1.2);
  return v.set(x, y, z);
}
