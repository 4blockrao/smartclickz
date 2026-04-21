
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary hover:bg-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-error/10 text-error hover:bg-error/20",
        outline: "border border-primary text-primary hover:bg-primary/5",
        success: "bg-accent-green/10 text-accent-green hover:bg-accent-green/20",
        warning: "bg-warning/10 text-warning hover:bg-warning/20",
        gold: "bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20",
        verified: "bg-accent-green/10 text-accent-green hover:bg-accent-green/20",
        premium: "bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
