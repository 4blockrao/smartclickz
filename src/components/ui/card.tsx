
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "interactive" | "highlight" | "bordered" | "elevated"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-card text-card-foreground border border-border shadow-card rounded-2xl",
    interactive: "bg-card text-card-foreground border border-border shadow-card rounded-2xl hover:shadow-card-hover cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-primary/20",
    highlight: "bg-card text-card-foreground border border-primary/20 shadow-card rounded-2xl bg-primary/5",
    bordered: "bg-card text-card-foreground border-2 border-border shadow-sm rounded-2xl hover:shadow-card transition-all duration-200",
    elevated: "bg-card text-card-foreground border border-border shadow-card-hover rounded-2xl"
  }

  return (
    <div
      ref={ref}
      className={cn(
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6
  }
>(({ className, level = 3, ...props }, ref) => {
  const Component = `h${level}` as const
  
  return (
    <Component
      ref={ref}
      className={cn(
        "font-semibold leading-tight tracking-tight text-card-title",
        {
          "text-hero": level === 1,
          "text-section": level === 2,
          "text-card-title": level === 3,
          "text-lg": level === 4,
          "text-base": level === 5,
          "text-sm": level === 6,
        },
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-caption text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-5 pt-0", className)} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
