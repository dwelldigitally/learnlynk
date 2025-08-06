import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileOptimizedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

export function MobileOptimizedForm({ 
  children, 
  className, 
  ...props 
}: MobileOptimizedFormProps) {
  const isMobile = useIsMobile()

  return (
    <form
      className={cn(
        "space-y-6",
        isMobile && "space-y-4",
        className
      )}
      {...props}
    >
      {children}
    </form>
  )
}

interface MobileFormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  forceStack?: boolean
}

export function MobileFormRow({ 
  children, 
  className, 
  forceStack = false,
  ...props 
}: MobileFormRowProps) {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        "grid gap-4",
        (isMobile || forceStack) ? "grid-cols-1" : "grid-cols-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface MobileFormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  label?: string
  description?: string
  required?: boolean
}

export function MobileFormGroup({ 
  children, 
  className,
  label,
  description,
  required,
  ...props 
}: MobileFormGroupProps) {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        "space-y-2",
        isMobile && "space-y-3",
        className
      )}
      {...props}
    >
      {label && (
        <label className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          isMobile && "text-base"
        )}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className={cn(
          "text-xs text-muted-foreground",
          isMobile && "text-sm"
        )}>
          {description}
        </p>
      )}
      {children}
    </div>
  )
}

interface MobileButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export function MobileButtonGroup({ 
  children, 
  className,
  orientation = 'horizontal',
  ...props 
}: MobileButtonGroupProps) {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        "flex gap-3",
        (isMobile || orientation === 'vertical') ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}