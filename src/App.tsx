import { useState } from "react";
import { Loader } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { ProjectPanel } from "./components/ProjectPanel";
import type { Project } from "./data/projects";
import "./index.css";

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="app">
      <Experience onSelectProject={setSelectedProject} />
      <Loader
        containerStyles={{ background: "#020617" }}
        innerStyles={{ background: "rgba(148, 163, 184, 0.25)" }}
        barStyles={{ background: "linear-gradient(135deg, #67e8f9, #8b5cf6)" }}
        dataStyles={{ color: "#cbd5e1", fontSize: "13px" }}
      />
      <ProjectPanel
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}
