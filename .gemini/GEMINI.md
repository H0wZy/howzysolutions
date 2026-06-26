# GEMINI.md

## Projeto: howzysolutions

Este arquivo documenta o contexto, a visão, a arquitetura inicial e o plano de implementação do projeto **howzysolutions**, um portfólio 3D profissional criado com React, TypeScript, Vite, React Three Fiber e Three.js.

---

## 1. Objetivo do projeto

Criar um portfólio profissional e extremamente atrativo visualmente para expor projetos, capacidades técnicas e visão estratégica, com foco em gerar percepção de valor e ajudar na conquista de novos clientes.

O portfólio deve ser diferente de um site tradicional. A proposta é criar uma experiência web 3D interativa, com uma estética premium, futurista e executiva.

---

## 2. Informações principais

```text
Nome do projeto: howzysolutions
Ano: 2026
Problema: preciso de um portfolio profissional e extremamente atrativo aos olhos pra expor meus projetos
Solução: criar do zero e subir no Vercel
Meu papel: você irá me guiar e ensinar
Tecnologias: React, TypeScript, Vite, R3F, Three.js
Resultado/impacto: me ajudar a conseguir mais clientes
```

---

## 3. Conceito do portfólio

O conceito visual sugerido é um **Technology Portfolio Experience**, ou seja, uma experiência 3D interativa para apresentar projetos como elementos orbitais, hubs digitais ou objetos clicáveis dentro de um ambiente tecnológico.

Possíveis nomes conceituais:

- **Marcos Selzler — Technology Portfolio Experience**
- **Executive Tech Universe**
- **Digital Transformation Command Center**
- **Impact-Driven Technology Portfolio**
- **Howzy Solutions — 3D Portfolio Experience**

A recomendação visual principal é:

```text
Executivo premium + futurista
```

Esse estilo combina elementos de tecnologia avançada com uma presença profissional, sofisticada e confiável.

---

## 4. Experiência visual desejada

A primeira versão do portfólio deve conter:

- fundo escuro premium;
- ambiente 3D com sensação espacial/digital;
- esfera ou núcleo central animado;
- projetos orbitando em volta do núcleo;
- objetos 3D clicáveis;
- painel lateral com detalhes do projeto selecionado;
- headline profissional com nome e posicionamento;
- botão para explorar projetos;
- botão para contato;
- estrutura pronta para deploy na Vercel.

---

## 5. Stack técnica

A stack inicial definida para o projeto é:

```text
React
TypeScript
Vite
React Three Fiber (@react-three/fiber)
Three.js
Drei (@react-three/drei)
Framer Motion
CSS puro inicialmente
Vercel para deploy
```

### Bibliotecas principais

```bash
npm install three @react-three/fiber @react-three/drei framer-motion
```

---

## 6. Criação do projeto dentro do diretório atual

O projeto será criado dentro do diretório já existente:

```bash
C:\Users\2983539\projects\howzysolutions
```

Como o terminal já está nesse diretório, o comando correto para criar o Vite no diretório atual é:

```bash
npm create vite@latest . -- --template react-ts
```

O ponto `.` indica que o projeto será criado na pasta atual, em vez de criar uma nova subpasta.

Depois executar:

```bash
npm install
npm install three @react-three/fiber @react-three/drei framer-motion
npm run dev
```

Se tudo estiver correto, o Vite exibirá um endereço parecido com:

```bash
http://localhost:5173/
```

---

## 7. Estrutura inicial recomendada

A estrutura inicial do projeto deve ser:

```text
src/
├─ components/
│  ├─ Experience.tsx
│  ├─ ProjectOrb.tsx
│  ├─ HeroOverlay.tsx
│  └─ ProjectPanel.tsx
├─ data/
│  └─ projects.ts
├─ App.tsx
├─ main.tsx
└─ index.css
```

Comandos para criar as pastas no Windows:

```bash
mkdir src\components
mkdir src\data
```

---

## 8. Dados iniciais dos projetos

Arquivo:

```text
src/data/projects.ts
```

Conteúdo sugerido:

```ts
export type Project = {
  id: string;
  name: string;
  year: string;
  problem: string;
  solution: string;
  role: string;
  technologies: string[];
  impact: string;
  color: string;
  position: [number, number, number];
};

export const projects: Project[] = [
  {
    id: "howzysolutions",
    name: "howzysolutions",
    year: "2026",
    problem:
      "Criar um portfólio profissional e extremamente atrativo para expor projetos, capacidades técnicas e visão estratégica.",
    solution:
      "Desenvolver uma experiência web 3D do zero usando React, TypeScript, Vite, React Three Fiber e Three.js, com publicação na Vercel.",
    role:
      "Construção guiada do projeto, aprendizado prático da stack, tomada de decisões visuais e evolução contínua do portfólio.",
    technologies: ["React", "TypeScript", "Vite", "R3F", "Three.js", "Vercel"],
    impact:
      "Aumentar percepção de valor, destacar diferenciação técnica e ajudar na conquista de novos clientes.",
    color: "#7c3aed",
    position: [3, 0.8, 0],
  },
  {
    id: "future-ai",
    name: "AI Business Platform",
    year: "2026",
    problem:
      "Empresas precisam transformar processos manuais em fluxos inteligentes com IA.",
    solution:
      "Criar soluções com IA generativa, automação e integrações para acelerar produtividade.",
    role:
      "Estratégia, desenho da solução, priorização de casos de uso e direcionamento tecnológico.",
    technologies: ["Azure OpenAI", "Microsoft 365", "Power Platform", "APIs"],
    impact:
      "Redução de esforço operacional, aumento de produtividade e criação de novas oportunidades digitais.",
    color: "#06b6d4",
    position: [-3, 0.4, 1],
  },
  {
    id: "digital-transformation",
    name: "Digital Transformation Hub",
    year: "2026",
    problem:
      "Organizações precisam modernizar sua presença digital e seus processos internos.",
    solution:
      "Construção de experiências digitais, automação, dashboards e plataformas orientadas a valor.",
    role:
      "Condução da visão tecnológica, arquitetura inicial e conexão entre negócio e execução técnica.",
    technologies: ["Cloud", "Data", "Automation", "UX", "Analytics"],
    impact:
      "Maior maturidade digital, melhor tomada de decisão e posicionamento mais competitivo.",
    color: "#22c55e",
    position: [0, -1.4, -3],
  },
];
```

---

## 9. Componente ProjectOrb

Arquivo:

```text
src/components/ProjectOrb.tsx
```

Responsabilidade:

- Renderizar cada projeto como uma esfera 3D clicável.
- Criar efeito de hover.
- Executar animação sutil no eixo vertical.
- Exibir o nome do projeto abaixo da esfera.
- Disparar seleção do projeto ao clicar.

Conteúdo sugerido:

```tsx
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
```

---

## 10. Componente Experience

Arquivo:

```text
src/components/Experience.tsx
```

Responsabilidade:

- Criar o Canvas 3D.
- Definir câmera, iluminação e ambiente.
- Renderizar o núcleo central.
- Renderizar os projetos orbitais.
- Adicionar estrelas, partículas e controles de câmera.

Conteúdo sugerido:

```tsx
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
```

---

## 11. Componente HeroOverlay

Arquivo:

```text
src/components/HeroOverlay.tsx
```

Responsabilidade:

- Exibir a camada visual HTML sobre o Canvas 3D.
- Mostrar nome, headline, descrição e botões principais.
- Criar animação de entrada com Framer Motion.

Observação importante:

O e-mail `marcos@howzysolutions.com` deve ser substituído pelo e-mail real do proprietário do portfólio.

Conteúdo sugerido corrigido:

```tsx
import { motion } from "framer-motion";

export function HeroOverlay() {
  return (
    <div className="hero-overlay">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="eyebrow">Portfolio 3D Experience</div>

        <h1>
          Marcos Selzler
          <span>Technology Executive</span>
        </h1>

        <p>
          Criando soluções digitais, experiências interativas e produtos
          tecnológicos para transformar ideias em valor real para negócios.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="#projects">
            Explorar projetos
          </a>

          <a className="secondary-button" href="mailto:marcos@howzysolution.com">
            Fale comigo
          </a>
        </div>
      </motion.div>
    </div>
  );
}
```

---

## 12. Componente ProjectPanel

Arquivo:

```text
src/components/ProjectPanel.tsx
```

Responsabilidade:

- Exibir os detalhes do projeto selecionado.
- Mostrar informações de problema, solução, papel, tecnologias e impacto.
- Permitir fechar o painel.
- Animar entrada e saída com Framer Motion.

Conteúdo sugerido:

```tsx
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../data/projects";

type ProjectPanelProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectPanel({ project, onClose }: ProjectPanelProps) {
  return (
    <AnimatePresence>
      {project && (
        <motion.aside
          className="project-panel"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.35 }}
        >
          <button className="close-button" onClick={onClose}>
            ×
          </button>

          <div className="panel-year">{project.year}</div>

          <h2>{project.name}</h2>

          <section>
            <h3>Problema</h3>
            <p>{project.problem}</p>
          </section>

          <section>
            <h3>Solução</h3>
            <p>{project.solution}</p>
          </section>

          <section>
            <h3>Meu papel</h3>
            <p>{project.role}</p>
          </section>

          <section>
            <h3>Tecnologias</h3>
            <div className="tech-list">
              {project.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </section>

          <section>
            <h3>Impacto</h3>
            <p>{project.impact}</p>
          </section>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
```

---

## 13. App.tsx

Arquivo:

```text
src/App.tsx
```

Responsabilidade:

- Controlar o projeto selecionado.
- Renderizar a experiência 3D.
- Renderizar o overlay principal.
- Renderizar o painel lateral.
- Exibir dica inferior para interação.

Conteúdo sugerido:

```tsx
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
```

---

## 14. main.tsx

Arquivo:

```text
src/main.tsx
```

Conteúdo sugerido:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## 15. CSS inicial

Arquivo:

```text
src/index.css
```

Responsabilidade:

- Definir o visual premium escuro.
- Estilizar overlay, botões, painel lateral e dica inferior.
- Criar responsividade básica.

Conteúdo sugerido:

```css
* {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
}

body {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background: #020617;
  color: #ffffff;
  overflow: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

.app {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  padding-left: clamp(24px, 6vw, 96px);
  background: radial-gradient(
      circle at 70% 50%,
      rgba(59, 130, 246, 0.08),
      transparent 35%
    ),
    linear-gradient(
      90deg,
      rgba(2, 6, 23, 0.95) 0%,
      rgba(2, 6, 23, 0.75) 34%,
      rgba(2, 6, 23, 0.08) 72%,
      transparent 100%
    );
}

.hero-content {
  pointer-events: auto;
  max-width: 620px;
}

.eyebrow {
  display: inline-flex;
  padding: 8px 14px;
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 999px;
  color: #67e8f9;
  background: rgba(8, 47, 73, 0.35);
  backdrop-filter: blur(12px);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

h1 {
  font-size: clamp(48px, 7vw, 92px);
  line-height: 0.92;
  margin: 0;
  letter-spacing: -0.07em;
}

h1 span {
  display: block;
  margin-top: 16px;
  font-size: clamp(24px, 3vw, 42px);
  color: #93c5fd;
  letter-spacing: -0.04em;
}

.hero-content p {
  max-width: 520px;
  color: #cbd5e1;
  font-size: 18px;
  line-height: 1.7;
  margin: 28px 0;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  padding: 14px 20px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  transition: 0.2s ease;
}

.primary-button {
  color: #020617;
  background: linear-gradient(135deg, #67e8f9, #8b5cf6);
  box-shadow: 0 20px 50px rgba(59, 130, 246, 0.35);
}

.secondary-button {
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(14px);
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-2px);
}

.project-panel {
  position: absolute;
  right: 24px;
  top: 24px;
  bottom: 24px;
  width: min(430px, calc(100vw - 48px));
  padding: 28px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 28px;
  background: rgba(2, 6, 23, 0.76);
  backdrop-filter: blur(24px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  overflow-y: auto;
  z-index: 10;
}

.close-button {
  position: absolute;
  right: 22px;
  top: 18px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  color: #e5e7eb;
  background: rgba(15, 23, 42, 0.9);
  font-size: 26px;
  line-height: 1;
}

.panel-year {
  color: #67e8f9;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.project-panel h2 {
  margin: 0 0 24px;
  font-size: 34px;
  line-height: 1;
  letter-spacing: -0.04em;
}

.project-panel section {
  margin-bottom: 22px;
}

.project-panel h3 {
  margin: 0 0 8px;
  color: #93c5fd;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.project-panel p {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.65;
  font-size: 15px;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-list span {
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(30, 64, 175, 0.35);
  border: 1px solid rgba(96, 165, 250, 0.28);
  color: #dbeafe;
  font-size: 13px;
}

.bottom-hint {
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.62);
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(16px);
  color: #cbd5e1;
  font-size: 13px;
  z-index: 4;
}

@media (max-width: 900px) {
  body {
    overflow: auto;
  }

  .hero-overlay {
    align-items: flex-start;
    padding: 48px 22px;
    background: linear-gradient(
      180deg,
      rgba(2, 6, 23, 0.95),
      rgba(2, 6, 23, 0.25)
    );
  }

  .hero-content p {
    font-size: 16px;
  }

  .project-panel {
    left: 16px;
    right: 16px;
    top: auto;
    bottom: 16px;
    width: auto;
    max-height: 72vh;
  }

  .bottom-hint {
    display: none;
  }
}
```

---

## 16. Como rodar localmente

```bash
npm run dev
```

Abrir no navegador:

```bash
http://localhost:5173/
```

---

## 17. Build de produção

```bash
npm run build
```

Para testar o build local:

```bash
npm run preview
```

---

## 18. Deploy na Vercel

Fluxo recomendado:

1. Criar repositório no GitHub.
2. Subir o projeto para o GitHub.
3. Entrar na Vercel.
4. Importar o repositório.
5. Usar as configurações padrão do Vite:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

## 19. Próximas evoluções planejadas

Após o MVP inicial, evoluir o projeto com:

- animação de entrada cinematográfica;
- seção de serviços;
- seção de projetos reais;
- botão de WhatsApp;
- formulário de contato;
- currículo para download;
- páginas individuais por projeto;
- modelos 3D `.glb`;
- shaders customizados;
- scroll 3D narrativo;
- responsividade refinada;
- otimização de performance;
- SEO;
- analytics;
- domínio personalizado.

---

## 20. Direção visual recomendada

O estilo visual escolhido deve seguir a combinação:

```text
Executivo premium + futurista
```

Características desse estilo:

- dark mode sofisticado;
- tons de azul, ciano, roxo e prata;
- glassmorphism;
- partículas digitais;
- movimento suave de câmera;
- tipografia grande e elegante;
- foco em valor de negócio;
- sensação de produto premium;
- visual tecnológico sem parecer excesso de game.

---

## 21. Mensagem central do projeto

A mensagem central do portfólio é:

> Transformar ideias, tecnologia e estratégia em experiências digitais que geram valor real para negócios.

Ou em uma versão mais comercial:

> Soluções digitais modernas, experiências interativas e tecnologia aplicada para ajudar empresas a evoluir, vender mais e se destacar.

---

## 22. Persona do portfólio

O portfólio deve comunicar que Marcos Selzler é:

- executivo de tecnologia;
- orientado a valor de negócio;
- capaz de conectar estratégia e execução;
- moderno na adoção de tecnologias;
- confiável para clientes;
- capaz de liderar soluções digitais diferenciadas;
- interessado em criar experiências que chamem atenção e gerem oportunidades.

---

## 23. Checklist imediato

- [ ] Criar projeto Vite no diretório atual.
- [ ] Instalar dependências.
- [ ] Criar pastas `components` e `data`.
- [ ] Criar `projects.ts`.
- [ ] Criar `ProjectOrb.tsx`.
- [ ] Criar `Experience.tsx`.
- [ ] Criar `HeroOverlay.tsx`.
- [ ] Criar `ProjectPanel.tsx`.
- [ ] Substituir `App.tsx`.
- [ ] Substituir `index.css`.
- [ ] Validar `main.tsx`.
- [ ] Rodar `npm run dev`.
- [ ] Ajustar e-mail real no botão de contato.
- [ ] Fazer primeiro commit no Git.
- [ ] Publicar na Vercel.

---

## 24. Observações para continuidade

Este projeto deve evoluir incrementalmente. A primeira versão não precisa ser perfeita; ela precisa funcionar, transmitir impacto visual e criar uma base sólida.

Após o MVP estar rodando, as prioridades são:

1. melhorar layout mobile;
2. ajustar narrativa comercial;
3. adicionar projetos reais;
4. adicionar contato direto;
5. publicar na Vercel;
6. refinar performance e identidade visual.

---

## 25. Comandos rápidos

```bash
cd C:\Users\2983539\projects\howzysolutions
npm create vite@latest . -- --template react-ts
npm install
npm install three @react-three/fiber @react-three/drei framer-motion
mkdir src\components
mkdir src\data
npm run dev
```

---

## 26. Resumo executivo

O **howzysolutions** é um portfólio 3D interativo criado para diferenciar a apresentação profissional de projetos e soluções digitais. Ele será desenvolvido com React, TypeScript, Vite, React Three Fiber e Three.js, com uma estética executivo-premium e futurista. O objetivo final é criar uma presença digital impactante, gerar confiança e ajudar na prospecção de novos clientes.
