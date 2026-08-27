import type { ContentBundle } from './types'
import { profile } from './profile'
import { projects } from './projects'
import { technologies } from './technologies'
import { stats } from './stats'
import { cv } from './cv'

export const content: ContentBundle = { profile, projects, technologies, stats, cv }

export { profile, projects, technologies, stats, cv }
export { findProject } from './projects'
export { trackedTimeFor } from './stats'
export { educationRange, projectIdFor, railEntries, documentFor } from './cv'
