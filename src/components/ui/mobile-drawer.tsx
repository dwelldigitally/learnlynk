import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/lib/utils"

const MobileDrawer = DrawerPrimitive.Root

const MobileDrawerTrigger = DrawerPrimitive.Trigger

const MobileDrawerPortal = DrawerPrimitive.Portal

const MobileDrawerClose = DrawerPrimitive.Close

const MobileDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm", className)}
    {...props}
  />
))
MobileDrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const MobileDrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    direction?: "left" | "right" | "top" | "bottom"
  }
>(({ className, children, direction = "bottom", ...props }, ref) => (
  <DrawerPrimitive.Portal>
    <MobileDrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col bg-background border border-border",
        direction === "bottom" && "inset-x-0 bottom-0 mt-24 rounded-t-[10px]",
        direction === "top" && "inset-x-0 top-0 mb-24 rounded-b-[10px]",
        direction === "left" && "inset-y-0 left-0 mr-24 rounded-r-[10px]",
        direction === "right" && "inset-y-0 right-0 ml-24 rounded-l-[10px]",
        className
      )}
      {...props}
    >
      {direction === "bottom" && (
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      )}
      {children}
    </DrawerPrimitive.Content>
  </DrawerPrimitive.Portal>
))
MobileDrawerContent.displayName = "MobileDrawerContent"

const MobileDrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
MobileDrawerHeader.displayName = "MobileDrawerHeader"

const MobileDrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
)
MobileDrawerFooter.displayName = "MobileDrawerFooter"

const MobileDrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
MobileDrawerTitle.displayName = DrawerPrimitive.Title.displayName

const MobileDrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
MobileDrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  MobileDrawer,
  MobileDrawerPortal,
  MobileDrawerOverlay,
  MobileDrawerTrigger,
  MobileDrawerClose,
  MobileDrawerContent,
  MobileDrawerHeader,
  MobileDrawerFooter,
  MobileDrawerTitle,
  MobileDrawerDescription,
}