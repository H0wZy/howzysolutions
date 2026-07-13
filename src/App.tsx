import { useState } from "react";
import { Loader } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { ProjectPanel } from "./components/ProjectPanel";
import { Navbar } from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import type { Project } from "./data/projects";
import "./index.css";

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <main className="app">
          <Navbar />
          <Experience onSelectProject={setSelectedProject} />
          <Loader
            containerStyles={{ background: "var(--bg)" }}
            innerStyles={{ background: "rgba(148, 163, 184, 0.25)" }}
            barStyles={{
              background: "linear-gradient(135deg, #22d3ee, #7c3aed)",
            }}
            dataStyles={{ color: "#cbd5e1", fontSize: "13px" }}
          />
          <ProjectPanel
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </main>
      </LanguageProvider>
    </ThemeProvider>
  );
}
