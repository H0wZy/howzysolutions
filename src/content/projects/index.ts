import type { Project } from '../types'
import { mcp } from './mcp'
import { telasparana } from './telasparana'
import { selzlerConstrutora } from './selzler-construtora'
import { generativeAiE2 } from './generative-ai-e2'
import { viralvideogen } from './viralvideogen'
import { studiobiasantos } from './studiobiasantos'
import { howzysolutions } from './howzysolutions'
import { terminal } from './terminal'
import { authsys } from './authsys'

/** Ordered as presented: featured tools and client work first, study last. */
export const projects: Project[] = [
  mcp,
  telasparana,
  selzlerConstrutora,
  generativeAiE2,
  viralvideogen,
  studiobiasantos,
  howzysolutions,
  terminal,
  authsys,
]

export function findProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}
