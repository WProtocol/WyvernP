import { cn } from "@/lib/utils"

export function Input({ className, ...props }) {
  return (
    <input
      className={cn("rounded-md px-3 py-2 text-sm outline-none", className)}
      {...props}
    />
  )
}
