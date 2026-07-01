import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "../data/projects";

type ProjectOrbProps = {
  project: Project;
  onSelect: (project: Project) => void;
};

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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
          <MeshTransmissionMaterial
            color={project.color}
            thickness={isMobile ? 0.3 : 0.7}
            roughness={0.1}
            transmission={isMobile ? 0.75 : 0.95}
            ior={1.3}
            chromaticAberration={hovered ? 0.06 : 0.02}
            distortion={0.1}
            samples={isMobile ? 3 : 5}
            resolution={isMobile ? 128 : 200}
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
