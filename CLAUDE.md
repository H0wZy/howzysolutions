
Use a skill /ui-ux-pro-max para melhorar esse frontend:

use informações que vc sabe sobre mim para incluir na minha stack, deixe o site como linguagem principal em ingles, e secundaria em ptbr, com tema escuro como padrão e alternativa modo claro. melhore as cores do site também.

Prompt:

Use a skill /ui-ux-pro-max para melhorar esse frontend:

# Rebuild this UI draft inside my project

The block below is a self-contained HTML+Tailwind sketch. Treat it as a VISUAL reference for layout, spacing, hierarchy and states — not code to paste.

STEP 1 — Inspect my project first and figure out its stack (do not assume it):

- Framework & language: read package.json / tsconfig (React, Next, Vue, Svelte, Solid, Astro, …; TypeScript or JavaScript).
- Styling system: Tailwind (and which version, via components.json / tailwind config), or CSS Modules, styled-components, vanilla-extract, Emotion, Sass, or plain CSS.
- Component / design system: search the repo for an existing UI kit (shadcn/ui, Radix, MUI, Chakra, Ant, Mantine, or a local components/ui folder) and REUSE its primitives instead of inventing new ones.
- Conventions: path aliases, folder layout, design tokens (theme file or CSS variables), and formatting/lint rules.

STEP 2 — Recreate the sketch using MY stack and MY existing components. Preserve the layout, spacing and visual hierarchy; map the raw HTML onto my own components and design tokens; do not introduce a new UI library or hardcoded colors when my project already has equivalents.

## Constraints

- Match my detected framework, styling system and component library — reuse what exists, don't reinvent it
- Use my design tokens / theme, not hardcoded hex colors
- Only add a dependency or global config if my project genuinely lacks an equivalent, and call it out explicitly
- Real content, no lorem ipsum; keep it accessible

<reference_sketch>

<!DOCTYPE html>

<html lang="en" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Marcos "H0wZy" Junior — Interactive 3D Portfolio</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
--violet:#8b5cf6;
--fuchsia:#d946ef;
--cyan:#22d3ee;
}
html{scroll-behavior:smooth;}
body{
font-family:'Inter',sans-serif;
background:#05050b;
color:#e5e7eb;
overflow-x:hidden;
}
h1,h2,h3,.font-display{font-family:'Space Grotesk',sans-serif;}

/* background layers */
.bg-grid{
background-image:
linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
background-size: 48px 48px;
mask-image: radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 90%);
}
.glow-a{background: radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%);}
.glow-b{background: radial-gradient(circle, rgba(34,211,238,0.28), transparent 70%);}
.glow-c{background: radial-gradient(circle, rgba(217,70,239,0.25), transparent 70%);}

.text-gradient{
background: linear-gradient(90deg, var(--violet), var(--fuchsia) 45%, var(--cyan));
-webkit-background-clip:text;
background-clip:text;
color:transparent;
}
.glass{
background: rgba(255,255,255,0.045);
border: 1px solid rgba(255,255,255,0.09);
backdrop-filter: blur(16px);
}
.glass-strong{
background: rgba(255,255,255,0.06);
border: 1px solid rgba(255,255,255,0.12);
backdrop-filter: blur(20px);
}

/* tilt cards */
.tilt-card{
transform-style: preserve-3d;
transition: transform .2s cubic-bezier(.2,.8,.2,1);
will-change: transform;
}
.tilt-glare{
position:absolute; inset:0; border-radius:inherit;
background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.16), transparent 55%);
opacity:0; transition:opacity .35s ease; pointer-events:none;
}
.tilt-card:hover .tilt-glare{opacity:1;}

/* cursor glow */
#cursor-glow{
position:fixed; width:520px; height:520px; border-radius:50%;
background: radial-gradient(circle, rgba(139,92,246,0.16), transparent 65%);
pointer-events:none; transform:translate(-50%,-50%);
left:50%; top:30%; z-index:0; filter:blur(10px);
transition: opacity .3s;
}

/* logo cube */
.cube-scene{ width:34px; height:34px; perspective:200px; }
.cube{ width:100%; height:100%; position:relative; transform-style:preserve-3d; animation: spin 7s linear infinite; }
.cube div{
position:absolute; inset:0; border-radius:8px;
background:linear-gradient(135deg, var(--violet), var(--cyan));
opacity:0.9;
}
.cube .f1{transform:translateZ(8px);}
.cube .f2{transform:rotateY(90deg) translateZ(8px); opacity:0.55;}
.cube .f3{transform:rotateX(90deg) translateZ(8px); opacity:0.35;}
@keyframes
 spin{ from{transform:rotateY(0) rotateX(10deg);} to{transform:rotateY(360deg) rotateX(10deg);} }

/* floating animation */
@keyframes
 floaty{ 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-14px) rotate(2deg);} }
.float{ animation: floaty 6s ease-in-out infinite; }
.float-delay{ animation-delay:1.2s; }
.float-delay2{ animation-delay:2.4s; }

@keyframes
 pulse-ring{ 0%{box-shadow:0 0 0 0 rgba(34,211,238,0.5);} 70%{box-shadow:0 0 0 12px rgba(34,211,238,0);} 100%{box-shadow:0 0 0 0 rgba(34,211,238,0);} }
.pulse-dot{ animation: pulse-ring 2.2s infinite; }

/* reveal on scroll */
.reveal{ opacity:0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
.reveal.is-visible{ opacity:1; transform:translateY(0); }

/* scrollbar */
::-webkit-scrollbar{width:10px;}
::-webkit-scrollbar-track{background:#0a0a12;}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--violet), var(--cyan)); border-radius:10px;}

.btn-gradient{
background: linear-gradient(90deg, var(--violet), var(--fuchsia) 50%, var(--cyan));
box-shadow: 0 8px 30px -8px rgba(139,92,246,0.6);
}
.btn-gradient:hover{ filter: brightness(1.1); }

.chip{
background: rgba(255,255,255,0.06);
border: 1px solid rgba(255,255,255,0.1);
}

.nav-link{ position:relative; }
.nav-link::after{
content:''; position:absolute; left:0; bottom:-6px; height:2px; width:0%;
background: linear-gradient(90deg, var(--violet), var(--cyan));
transition: width .3s ease;
}
.nav-link:hover::after, .nav-link.active::after{ width:100%; }
.nav-link.active{ color:#fff; }

</head>
<body class="antialiased">

<!-- ambient cursor glow -->

<div id="cursor-glow"></div>

<!-- background decorative grid & blobs -->

<div class="fixed inset-0 -z-10 overflow-hidden">
<div class="absolute inset-0 bg-grid"></div>
<div class="absolute -top-40 -left-40 w-[560px] h-[560px] glow-a rounded-full blur-3xl"></div>
<div class="absolute top-1/3 -right-40 w-[520px] h-[520px] glow-b rounded-full blur-3xl"></div>
<div class="absolute bottom-0 left-1/4 w-[480px] h-[480px] glow-c rounded-full blur-3xl"></div>
</div>

<!-- NAV -->

<header class="fixed top-0 inset-x-0 z-50"></header>




<header class="fixed top-0 inset-x-0 z-50"></header>





<div class="max-w-7xl mx-auto px-6 lg:px-10">
<div class="mt-4 glass rounded-2xl px-5 py-3 flex items-center justify-between">
<a href="#home" class="flex items-center gap-3 group">
<div class="cube-scene">
<div class="cube">
<div class="f1"></div>
<div class="f2"></div>
<div class="f3"></div>
</div>
</div>
<span class="font-display font-bold text-lg tracking-tight">H0wZy<span class="text-gradient">.dev</span></span>
</a>

<!-- HERO -->

<section id="home" class="relative min-h-screen flex items-center pt-32 pb-20 px-6">
<div class="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

<!-- ABOUT -->

<section id="about" class="relative py-28 px-6">
<div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

<!-- SKILLS -->

<section id="skills" class="relative py-28 px-6">
<div class="max-w-7xl mx-auto">
<div class="text-center max-w-2xl mx-auto reveal">
<p class="text-cyan-300 text-sm font-semibold tracking-widest uppercase mb-3">Toolkit</p>
<h2 class="font-display text-3xl sm:text-4xl font-bold text-white">What I bring to the table</h2>
<p class="mt-4 text-slate-400">A stack built for speed, motion and reliability — trained across web, backend and tooling.</p>
</div>

<!-- WORK -->

<section id="work" class="relative py-28 px-6">
<div class="max-w-7xl mx-auto">
<div class="text-center max-w-2xl mx-auto reveal">
<p class="text-cyan-300 text-sm font-semibold tracking-widest uppercase mb-3">Portfolio</p>
<h2 class="font-display text-3xl sm:text-4xl font-bold text-white">Selected Work</h2>
<p class="mt-4 text-slate-400">A few builds that mix interface, motion and code — the H0wZy way.</p>
</div>

<!-- CONTACT -->

<section id="contact" class="relative py-28 px-6">
<div class="max-w-4xl mx-auto reveal" style="perspective:1200px;">
<div class="tilt-card relative glass-strong rounded-3xl px-8 sm:px-16 py-16 text-center overflow-hidden shadow-2xl shadow-violet-900/30">
<div class="tilt-glare"></div>
<div class="absolute -top-24 -right-24 w-72 h-72 glow-a rounded-full blur-3xl"></div>
<div class="absolute -bottom-24 -left-24 w-72 h-72 glow-b rounded-full blur-3xl"></div>

<!-- FOOTER -->

<footer class="relative border-t border-white/10 py-10 px-6">
<div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
<div class="flex items-center gap-3">
<div class="cube-scene">
<div class="cube">
<div class="f1"></div><div class="f2"></div><div class="f3"></div>
</div>
</div>
<p class="text-sm text-slate-400">© <span id="year"></span> Marcos "H0wZy" Junior. All rights reserved.</p>
</div>
<div class="flex items-center gap-4">
<a href="https://github.com/H0wZy" target="_blank" class="text-slate-400 hover:text-cyan-300 transition-colors text-sm">GitHub</a>
<a href="https://linktr.ee/h0wzymarcos" target="_blank" class="text-slate-400 hover:text-cyan-300 transition-colors text-sm">Linktree</a>
<a href="#home" class="w-9 h-9 rounded-lg glass flex items-center justify-center hover:text-cyan-300 transition-colors">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</a>
</div>
</div>
</footer>

<script>
// year
document.getElementById('year').textContent = new Date().getFullYear();

// mobile menu
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => {
mobileMenu.classList.toggle('hidden');
});
document.querySelectorAll('.mobile-link').forEach(l => {
l.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// scroll spy
const navLinks = document.querySelectorAll('[data-nav]');
const sections = document.querySelectorAll('section[id]');
const spy = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
navLinks.forEach(l => l.classList.remove('active'));
const active = document.querySelector(`[data-nav][href="#${entry.target.id}"]`);
if (active) active.classList.add('active');
}
});
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => spy.observe(s));

// reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) {
e.target.classList.add('is-visible');
ro.unobserve(e.target);
}
});
}, { threshold: 0.12 });
reveals.forEach(r => ro.observe(r));

// 3D tilt effect
document.querySelectorAll('.tilt-card').forEach(card => {
card.addEventListener('mousemove', (e) => {
const rect = card.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
const px = x / rect.width;
const py = y / rect.height;
const rx = (py - 0.5) * -12;
const ry = (px - 0.5) * 12;
card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
card.style.setProperty('--mx', `${px * 100}%`);
card.style.setProperty('--my', `${py * 100}%`);
});
card.addEventListener('mouseleave', () => {
card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
});
});

// ambient cursor glow
const glow = document.getElementById('cursor-glow');
window.addEventListener('mousemove', (e) => {
glow.style.left = e.clientX + 'px';
glow.style.top = e.clientY + 'px';
});

// copy handle
const copyBtn = document.getElementById('copy-handle');
const copyText = document.getElementById('copy-text');
copyBtn.addEventListener('click', () => {
navigator.clipboard.writeText('@h0wzymarcos').then(() => {
copyText.textContent = 'Copied to clipboard ✓';
setTimeout(() => copyText.textContent = '@h0wzymarcos — click to copy', 2000);
});
});
</script>

</body>
</html>
</reference_sketch>

## Inspired by 21st

- Inspired by 21st component Personal Landing (itsankitverma/personal-landing) — optionally run `npx  @21st-dev /cli add itsankitverma/personal-landing` for a vetted base, then reconcile it to the brief above.
- Inspired by 21st component Portfolio Gallery (isaiahbjork/portfolio-gallery) — optionally run `npx  @21st-dev /cli add isaiahbjork/portfolio-gallery` for a vetted base, then reconcile it to the brief above.
- Inspired by 21st component Portfolio Hero (wisedev/portfolio-hero) — optionally run `npx  @21st-dev /cli add wisedev/portfolio-hero` for a vetted base, then reconcile it to the brief above.

## Done when

It matches the sketch's layout and hierarchy, uses my project's own framework, components and design tokens, follows my TS/JS and lint conventions, covers loading/empty/error states, and drops into my codebase without new dependencies or global config (unless I was told one is missing).

use informações que vc sabe sobre mim para incluir na minha stack, deixe o site como linguagem principal em ingles, e secundaria em ptbr, com tema escuro como padrão e alternativa modo claro. melhore as cores do site também.
