import React from "react"
import { HelpIcon } from "./help-icon"
import { cn } from "@/lib/utils"

interface HelpSectionProps {
  title: string
  helpKey: string
  children: React.ReactNode
  className?: string
  titleClassName?: string
}

export function HelpSection({ 
  title, 
  helpKey, 
  children, 
  className,
  titleClassName 
}: HelpSectionProps) {
  const { getHelpContent } = require('@/hooks/useHelpContent').useHelpContent()
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn("flex items-center gap-2", titleClassName)}>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <HelpIcon 
          content={getHelpContent(helpKey)}
          size="sm"
        />
      </div>
      {children}
    </div>
  )
}

interface HelpLabelProps {
  label: string
  helpKey: string
  required?: boolean
  className?: string
}

export function HelpLabel({ 
  label, 
  helpKey, 
  required = false, 
  className 
}: HelpLabelProps) {
  const { getHelpContent } = require('@/hooks/useHelpContent').useHelpContent()
  
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </span>
      <HelpIcon 
        content={getHelpContent(helpKey)}
        size="sm"
      />
    </div>
  )
}