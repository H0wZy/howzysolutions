import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

// Cada ponto representa uma "parada" da câmera, uma por página de scroll.
// page 0 Hero | 1 About | 2 Toolkit | 3 Projects | 4 Contact
const CAMERA_PATH: [number, number, number][] = [
  [0, 1.4, 7],
  [2.2, 1.0, 3.4],
  [-2.0, 0.6, 0.4],
  [-1.6, 0.3, -3.0],
  [0.4, 1.1, -7.4],
];

const LOOK_PATH: [number, number, number][] = [
  [0, 0, 0],
  [0.3, 0.1, 0.4],
  [0, 0, -1.2],
  [0, -0.1, -3.4],
  [0, 0, -7.8],
];

export function ScrollCamera() {
  const scroll = useScroll();
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(...LOOK_PATH[0]));
  const nextPos = useRef(new THREE.Vector3());
  const nextTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const segments = CAMERA_PATH.length - 1;
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1) * segments;
    const index = Math.min(Math.floor(t), segments - 1);
    const localT = THREE.MathUtils.smoothstep(t - index, 0, 1);

    const from = CAMERA_PATH[index];
    const to = CAMERA_PATH[index + 1];
    const lookFrom = LOOK_PATH[index];
    const lookTo = LOOK_PATH[index + 1];

    nextPos.current.set(
      THREE.MathUtils.lerp(from[0], to[0], localT),
      THREE.MathUtils.lerp(from[1], to[1], localT),
      THREE.MathUtils.lerp(from[2], to[2], localT)
    );

    nextTarget.current.set(
      THREE.MathUtils.lerp(lookFrom[0], lookTo[0], localT),
      THREE.MathUtils.lerp(lookFrom[1], lookTo[1], localT),
      THREE.MathUtils.lerp(lookFrom[2], lookTo[2], localT)
    );

    // damping suave e independente de frame-rate
    const smoothing = 1 - Math.pow(0.0025, delta);
    camera.position.lerp(nextPos.current, smoothing);
    currentTarget.current.lerp(nextTarget.current, smoothing);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
