import type { Project } from '../types'
import { telasparana } from './telasparana'
import { selzlerConstrutora } from './selzler-construtora'
import { generativeAiE2 } from './generative-ai-e2'
import { viralvideogen } from './viralvideogen'
import { studiobiasantos } from './studiobiasantos'
import { howzysolutions } from './howzysolutions'
import { terminal } from './terminal'
import { authsys } from './authsys'
import { skeeperSpecs } from './skeeper-specs'

/** Ordered as presented: production client work first, study and tooling last. */
export const projects: Project[] = [
  telasparana,
  selzlerConstrutora,
  generativeAiE2,
  viralvideogen,
  studiobiasantos,
  howzysolutions,
  terminal,
  authsys,
  skeeperSpecs,
]

export function findProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}
