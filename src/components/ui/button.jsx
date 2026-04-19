import { cn } from "@/lib/utils"

export function Button({ className, variant = "default", size = "default", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors cursor-pointer",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "default" && "px-4 py-2 text-sm",
        variant === "ghost" && "bg-transparent hover:bg-white/10",
        variant === "outline" && "border border-white/20 bg-transparent",
        className
      )}
      {...props}
    />
  )
}
