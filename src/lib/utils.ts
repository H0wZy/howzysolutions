import { clsx, type ClassValue } from 'clsx'

/**
 * The class-name helper every shadcn-generated component calls.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
