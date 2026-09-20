import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export function NavigationMenu({ className, ...props }: ComponentProps<'nav'>) {
  return <nav className={cn('navigation-menu', className)} {...props} />
}

export function NavigationMenuList({ className, ...props }: ComponentProps<'ul'>) {
  return <ul className={cn('navigation-menu-list', className)} {...props} />
}

export function NavigationMenuItem(props: ComponentProps<'li'>) {
  return <li {...props} />
}

export function NavigationMenuLink({ className, ...props }: ComponentProps<'a'>) {
  return <a className={cn('navigation-menu-link', className)} {...props} />
}
