import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "../data/projects";

type ProjectOrbProps = {
  project: Project;
  onSelect: (project: Project) => void;
};

export function ProjectOrb({ project, onSelect }: ProjectOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += 0.01;

    const t = state.clock.getElapsedTime();
    meshRef.current.position.y =
      project.position[1] + Math.sin(t + project.position[0]) * 0.15;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <group position={project.position}>
        <mesh
          ref={meshRef}
          onClick={() => onSelect(project)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.25 : 1}
        >
          <sphereGeometry args={[0.45, 48, 48]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={hovered ? 1.2 : 0.45}
            roughness={0.25}
            metalness={0.4}
          />
        </mesh>

        <Text
          position={[0, -0.8, 0]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {project.name}
        </Text>
      </group>
    </Float>
  );
}