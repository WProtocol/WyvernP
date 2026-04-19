import { cn } from "@/lib/utils"

export function Card({ className, ...props }) {
  return <div className={cn("rounded-lg", className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn("", className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("", className)} {...props} />
}
