import React from "react"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HelpIconProps {
  content: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  size?: "sm" | "md" | "lg"
  className?: string
  triggerClassName?: string
}

export function HelpIcon({ 
  content, 
  side = "top", 
  size = "sm", 
  className,
  triggerClassName 
}: HelpIconProps) {
  const sizeMap = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full",
              triggerClassName
            )}
            aria-label="Help information"
          >
            <HelpCircle className={cn(sizeMap[size], className)} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={cn(
            "max-w-80 p-3 text-sm bg-popover border shadow-lg z-50",
            "text-popover-foreground"
          )}
          sideOffset={4}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}