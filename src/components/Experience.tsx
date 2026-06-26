import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Environment,
  Float,
  Text,
  Sparkles,
} from "@react-three/drei";
import { projects, type Project } from "../data/projects";
import { ProjectOrb } from "./ProjectOrb";

type ExperienceProps = {
  onSelectProject: (project: Project) => void;
};

function Core() {
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
      <group>
        <mesh>
          <icosahedronGeometry args={[1.1, 4]} />
          <meshStandardMaterial
            color="#111827"
            emissive="#2563eb"
            emissiveIntensity={0.8}
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
            emissiveIntensity={1.8}
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

export function Experience({ onSelectProject }: ExperienceProps) {
  return (
    <Canvas camera={{ position: [0, 1.4, 7], fov: 50 }}>
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#38bdf8" />
      <pointLight position={[-4, -2, -3]} intensity={25} color="#a855f7" />

      <Stars radius={80} depth={40} count={3500} factor={4} fade speed={1} />
      <Sparkles count={120} scale={8} size={2} speed={0.4} color="#38bdf8" />

      <Core />

      {projects.map((project) => (
        <ProjectOrb
          key={project.id}
          project={project}
          onSelect={onSelectProject}
        />
      ))}

      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
}