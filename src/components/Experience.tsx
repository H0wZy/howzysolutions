import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Stars,
  Environment,
  Float,
  Text,
  Sparkles,
  ScrollControls,
  Scroll,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { projects, type Project } from "../data/projects";
import { ProjectOrb } from "./ProjectOrb";
import { ScrollCamera } from "./ScrollCamera";
import { ScrollNav } from "./ScrollNav";
import { HeroOverlay } from "./HeroOverlay";
import { PageSections } from "./PageSections";
import { DotWaveField } from "./DotWaveField";

type ExperienceProps = {
  onSelectProject: (project: Project) => void;
};

function Core() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group>
        <mesh>
          <icosahedronGeometry args={[1.1, 4]} />
          <meshStandardMaterial
            color="#111827"
            emissive="#7c3aed"
            emissiveIntensity={0.45}
            roughness={0.18}
            metalness={0.8}
            wireframe
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.45, 64, 64]} />
          <MeshTransmissionMaterial
            color="#a5b4fc"
            thickness={isMobile ? 0.4 : 0.9}
            roughness={0.08}
            transmission={isMobile ? 0.85 : 1}
            ior={1.35}
            chromaticAberration={0.04}
            distortion={0.15}
            temporalDistortion={0.1}
            samples={isMobile ? 3 : 6}
            resolution={isMobile ? 128 : 256}
          />
        </mesh>

        <Text
          position={[0, -1.6, 0]}
          fontSize={0.22}
          color="#e5e7eb"
          anchorX="center"
          anchorY="middle"
        >
          HOWZY SOLUTIONS
        </Text>
      </group>
    </Float>
  );
}

function SceneContent({ onSelectProject }: ExperienceProps) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <Stars
        radius={80}
        depth={40}
        count={isMobile ? 1600 : 3500}
        factor={4}
        fade
        speed={1}
      />
      <Sparkles
        count={isMobile ? 50 : 120}
        scale={8}
        size={2}
        speed={0.4}
        color="#818cf8"
      />
      <DotWaveField cols={isMobile ? 16 : 28} rows={isMobile ? 12 : 20} />
      <Environment preset="city" />

      <ScrollControls pages={5} damping={0.25}>
        <ScrollCamera />
        <ScrollNav />

        <Core />

        {projects.map((project) => (
          <ProjectOrb
            key={project.id}
            project={project}
            onSelect={onSelectProject}
          />
        ))}

        <Scroll html style={{ width: "100%" }}>
          <HeroOverlay />
          <PageSections />
        </Scroll>
      </ScrollControls>
    </>
  );
}

export function Experience({ onSelectProject }: ExperienceProps) {
  return (
    <Canvas camera={{ position: [0, 1.4, 7], fov: 50 }} dpr={[1, 1.8]}>
      <color attach="background" args={["#0b1120"]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#22d3ee" />
      <pointLight position={[-4, -2, -3]} intensity={25} color="#7c3aed" />

      <Suspense fallback={null}>
        <SceneContent onSelectProject={onSelectProject} />
      </Suspense>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.15}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.15} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}
