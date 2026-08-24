import type { Technology } from './types'

/**
 * Every technology referenced by a project record. The reverse index — technology
 * to projects — is derived at read time, never stored (data-model.md).
 */
export const technologies: Technology[] = [
  // Languages
  { id: 'typescript', name: 'TypeScript', category: 'language' },
  { id: 'csharp', name: 'C# / .NET 10', category: 'language' },
  { id: 'python', name: 'Python 3.11+', category: 'language' },
  { id: 'go', name: 'Go 1.25', category: 'language' },
  { id: 'bash', name: 'Bash', category: 'language' },
  { id: 'powershell', name: 'PowerShell 7', category: 'language' },

  // Frameworks and UI
  { id: 'nextjs', name: 'Next.js (App Router)', category: 'framework' },
  { id: 'react', name: 'React 19', category: 'framework' },
  { id: 'aspnetcore', name: 'ASP.NET Core', category: 'framework' },
  { id: 'fastapi', name: 'FastAPI', category: 'framework' },
  { id: 'gin', name: 'Gin', category: 'framework' },
  { id: 'typer', name: 'Typer', category: 'framework' },
  { id: 'tailwind', name: 'Tailwind CSS v4', category: 'framework' },
  { id: 'shadcn', name: 'shadcn/ui on Base UI', category: 'framework' },
  { id: 'vite', name: 'Vite', category: 'framework' },

  // Data
  { id: 'postgres', name: 'PostgreSQL 16', category: 'data' },
  { id: 'efcore', name: 'EF Core 10 + Npgsql', category: 'data' },
  { id: 'sqlalchemy', name: 'SQLAlchemy 2', category: 'data' },
  { id: 'alembic', name: 'Alembic', category: 'data' },
  { id: 'gorm', name: 'GORM', category: 'data' },
  { id: 'sqlite-vec', name: 'SQLite + sqlite-vec', category: 'data' },
  { id: 'pydantic', name: 'Pydantic 2', category: 'data' },

  // Infrastructure
  { id: 'gcp', name: 'Google Cloud', category: 'infra' },
  { id: 'terraform', name: 'Terraform', category: 'infra' },
  { id: 'cloudrun', name: 'Cloud Run', category: 'infra' },
  { id: 'cloudsql', name: 'Cloud SQL', category: 'infra' },
  { id: 'github-actions', name: 'GitHub Actions', category: 'infra' },
  { id: 'docker', name: 'Docker', category: 'infra' },
  { id: 'cloudflare-r2', name: 'Cloudflare R2', category: 'infra' },
  { id: 'vercel', name: 'Vercel', category: 'infra' },
  { id: 'jwt', name: 'JWT', category: 'infra' },

  // AI
  { id: 'openrouter', name: 'OpenRouter', category: 'ai' },
  { id: 'anthropic-sdk', name: 'Anthropic SDK', category: 'ai' },
  { id: 'sentence-transformers', name: 'sentence-transformers', category: 'ai' },
  { id: 'whisper', name: 'faster-whisper', category: 'ai' },
  { id: 'mcp', name: 'Model Context Protocol', category: 'ai' },
  { id: 'opencv', name: 'OpenCV', category: 'ai' },

  // Tooling
  { id: 'vitest', name: 'Vitest', category: 'tooling' },
  { id: 'xunit', name: 'xUnit + Moq', category: 'tooling' },
  { id: 'pytest', name: 'pytest', category: 'tooling' },
  { id: 'spec-kit', name: 'GitHub Spec Kit', category: 'tooling' },
  { id: 'skeeper', name: 'Skeeper', category: 'tooling' },
  { id: 'make', name: 'GNU Make', category: 'tooling' },
  { id: 'oh-my-posh', name: 'Oh My Posh', category: 'tooling' },
  { id: 'git', name: 'Git', category: 'tooling' },
]
