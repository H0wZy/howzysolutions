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
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { projects, type Project } from "../data/projects";
import { ProjectOrb } from "./ProjectOrb";
import { ScrollCamera } from "./ScrollCamera";
import { ScrollNav } from "./ScrollNav";
import { HeroOverlay } from "./HeroOverlay";
import { PageSections } from "./PageSections";

type ExperienceProps = {
  onSelectProject: (project: Project) => void;
};

function Core() {
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group>
        <mesh>
          <icosahedronGeometry args={[1.1, 4]} />
          <meshStandardMaterial
            color="#111827"
            emissive="#2563eb"
            emissiveIntensity={0.5}
            roughness={0.18}
            metalness={0.8}
            wireframe
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.45, 48, 48]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.5}
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
  return (
    <>
      <Stars radius={80} depth={40} count={3500} factor={4} fade speed={1} />
      <Sparkles count={120} scale={8} size={2} speed={0.4} color="#38bdf8" />
      <Environment preset="city" />

      <ScrollControls pages={4} damping={0.25}>
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
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#38bdf8" />
      <pointLight position={[-4, -2, -3]} intensity={25} color="#a855f7" />

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
