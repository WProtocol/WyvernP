import { cn } from "@/lib/utils"

export function NavigationMenu({ className, ...props }) {
  return <nav className={cn("flex", className)} {...props} />
}

export function NavigationMenuList({ className, ...props }) {
  return <ul className={cn("flex items-center list-none", className)} {...props} />
}

export function NavigationMenuItem({ className, ...props }) {
  return <li className={cn("", className)} {...props} />
}

export function NavigationMenuLink({ className, ...props }) {
  return <a className={cn("", className)} {...props} />
}
