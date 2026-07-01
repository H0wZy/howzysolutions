import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "../data/projects";

type ProjectOrbProps = {
  project: Project;
  onSelect: (project: Project) => void;
};

export function ProjectOrb({ project, onSelect }: ProjectOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += 0.01;

    const t = state.clock.getElapsedTime();
    meshRef.current.position.y =
      project.position[1] + Math.sin(t + project.position[0]) * 0.15;

    // escala suave (lerp) em vez de salto instantâneo no hover
    const targetScale = hovered ? 1.25 : 1;
    const smoothing = 1 - Math.pow(0.001, delta);
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      smoothing
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <group position={project.position}>
        <mesh
          ref={meshRef}
          onClick={() => onSelect(project)}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[0.45, 64, 64]} />
          <MeshDistortMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.7 : 0.35}
            roughness={0.25}
            metalness={0.4}
            distort={0.3}
            speed={1.6}
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
