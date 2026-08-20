import type { ContentBundle } from './types'
import { profile } from './profile'
import { projects } from './projects'
import { technologies } from './technologies'
import { stats } from './stats'

export const content: ContentBundle = { profile, projects, technologies, stats }

export { profile, projects, technologies, stats }
export { findProject } from './projects'
export { trackedTimeFor } from './stats'
