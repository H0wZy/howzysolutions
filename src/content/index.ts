import type { ContentBundle } from './types'
import { profile } from './profile'
import { projects } from './projects'
import { technologies } from './technologies'
import { stats } from './stats'
import { cv } from './cv'
import { privacy } from './privacy'
import { terms } from './terms'

/*
 * The legal documents are deliberately NOT in here. They are prerendered by
 * src/entry-server.tsx and never hydrated (src/main.tsx), so putting them in
 * this object would ship two static prose pages to every visitor of every
 * other page, as JavaScript, for nothing. They are still exported below, for
 * the server render and for the tests.
 */
export const content: ContentBundle = { profile, projects, technologies, stats, cv }

export { profile, projects, technologies, stats, cv, privacy, terms }
export { findProject } from './projects'
export { trackedTimeFor } from './stats'
export { educationRange, projectIdFor, railEntries, documentFor } from './cv'
