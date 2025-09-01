
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

// Extend the props interface to include indicatorClassName
interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  variant?: 'default' | 'enrollment';
  enrollmentPercentage?: number;
}

const getEnrollmentColor = (percentage: number): string => {
  if (percentage >= 90) return "bg-red-500"; // Over-enrolled/high demand
  if (percentage >= 70) return "bg-green-500"; // Good enrollment
  if (percentage >= 50) return "bg-yellow-500"; // Moderate enrollment
  if (percentage >= 30) return "bg-orange-500"; // Low enrollment
  return "bg-red-400"; // Very low enrollment
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, variant = 'default', enrollmentPercentage, ...props }, ref) => {
  const dynamicIndicatorClass = variant === 'enrollment' && enrollmentPercentage !== undefined 
    ? getEnrollmentColor(enrollmentPercentage)
    : "bg-primary";
    
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all",
          dynamicIndicatorClass,
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
