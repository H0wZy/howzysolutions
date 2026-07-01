import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type DotWaveFieldProps = {
  cols?: number;
  rows?: number;
};

// Grade de pontos com onda senoidal, mesma ideia do template DottedSurface
// (21st.dev), portada pra dentro do mesmo Canvas R3F em vez de um 2º
// WebGL context separado (2 canvases simultâneos custa caro em mobile).
export function DotWaveField({ cols = 28, rows = 20 }: DotWaveFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const clock = useRef(0);
  const gap = 0.55;

  const { positions, count } = useMemo(() => {
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    let i = 0;
    for (let ix = 0; ix < cols; ix++) {
      for (let iy = 0; iy < rows; iy++) {
        positions[i * 3] = ix * gap - (cols * gap) / 2;
        positions[i * 3 + 1] = -3.2;
        positions[i * 3 + 2] = iy * gap - (rows * gap) / 2 - 6;
        i++;
      }
    }
    return { positions, count };
  }, [cols, rows]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    clock.current += delta;

    const position = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const array = position.array as Float32Array;

    let i = 0;
    for (let ix = 0; ix < cols; ix++) {
      for (let iy = 0; iy < rows; iy++) {
        array[i * 3 + 1] =
          -3.2 +
          Math.sin(ix * 0.3 + clock.current) * 0.25 +
          Math.sin(iy * 0.4 + clock.current * 0.8) * 0.25;
        i++;
      }
    }
    position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#818cf8"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
