import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, MoreVertical } from "lucide-react"

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children
}: MobileBottomSheetProps) {
  const isMobile = useIsMobile()

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isMobile) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Bottom Sheet */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-lg border-t border-border transition-transform duration-300 ease-in-out max-h-[90vh] overflow-hidden",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        {(title || description) && (
          <div className="px-4 pb-4 border-b border-border">
            {title && (
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </>
  )
}

interface MobileListItemProps {
  title: string
  subtitle?: string
  description?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function MobileListItem({
  title,
  subtitle,
  description,
  icon,
  rightElement,
  onClick,
  className
}: MobileListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center space-x-3 p-4 border-b border-border last:border-b-0 min-h-[60px]",
        onClick && "cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors",
        className
      )}
      onClick={onClick}
    >
      {icon && (
        <div className="flex-shrink-0">
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground truncate">
            {subtitle}
          </div>
        )}
        {description && (
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {description}
          </div>
        )}
      </div>

      {rightElement && (
        <div className="flex-shrink-0">
          {rightElement}
        </div>
      )}
    </div>
  )
}

interface MobileTabsProps {
  tabs: Array<{
    id: string
    label: string
    count?: number
  }>
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function MobileTabs({ tabs, activeTab, onTabChange }: MobileTabsProps) {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return null
  }

  return (
    <div className="flex space-x-1 bg-muted p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors min-h-[44px] flex items-center justify-center",
            activeTab === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {tab.count && (
            <span className={cn(
              "ml-2 px-2 py-0.5 text-xs rounded-full",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

interface MobileActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  actions: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: 'default' | 'destructive'
  }>
}

export function MobileActionSheet({
  isOpen,
  onClose,
  title,
  actions
}: MobileActionSheetProps) {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Action Sheet */}
      <div className={cn(
        "fixed bottom-0 left-4 right-4 z-50 transition-transform duration-300 ease-in-out pb-4",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        <Card className="bg-background/95 backdrop-blur-sm">
          {title && (
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-base">{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent className="p-0">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 px-4 rounded-none first:rounded-t-lg last:rounded-b-lg",
                  action.variant === 'destructive' && "text-destructive hover:text-destructive"
                )}
                onClick={() => {
                  action.onClick()
                  onClose()
                }}
              >
                {action.icon && <span className="mr-3">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
        
        <Button
          variant="secondary"
          className="w-full h-12 mt-2"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </>
  )
}