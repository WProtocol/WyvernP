import { cn } from "@/lib/utils"

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "outline" && "border border-current bg-transparent",
        className
      )}
      {...props}
    />
  )
}
