import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * The class-name helper every shadcn-generated component calls. It exists at
 * this path because components.json points `utils` here and the generator
 * writes `import { cn } from '@/lib/utils'` into every file it emits.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
