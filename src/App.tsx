import { useState } from "react";
import { Experience } from "./components/Experience";
import { HeroOverlay } from "./components/HeroOverlay";
import { ProjectPanel } from "./components/ProjectPanel";
import type { Project } from "./data/projects";
import "./index.css";

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="app">
      <Experience onSelectProject={setSelectedProject} />
      <HeroOverlay />
      <ProjectPanel
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <div className="bottom-hint" id="projects">
        Clique nos orbes para explorar os projetos
      </div>
    </main>
  );
}