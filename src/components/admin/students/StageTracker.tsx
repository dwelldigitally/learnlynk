import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface StageTrackerProps {
  stages: {
    key: string;
    label: string;
    count: number;
    color: string;
  }[];
  activeStage: string;
  onStageChange: (stage: string) => void;
}

export function StageTracker({ stages, activeStage, onStageChange }: StageTrackerProps) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Student Pipeline</h2>
        <div className="text-sm text-muted-foreground">
          Total: {stages.reduce((sum, stage) => sum + stage.count, 0)} students
        </div>
      </div>
      
      <Tabs value={activeStage} onValueChange={onStageChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50">
          <TabsTrigger value="all" className="relative">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium">All</span>
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {stages.reduce((sum, stage) => sum + stage.count, 0)}
              </Badge>
            </div>
          </TabsTrigger>
          
          {stages.map((stage, index) => (
            <TabsTrigger 
              key={stage.key} 
              value={stage.key}
              className="relative"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full",
                      stage.color
                    )}
                  />
                  <span className="text-xs font-medium">{stage.label}</span>
                </div>
                <Badge 
                  variant={activeStage === stage.key ? "default" : "outline"} 
                  className="text-xs px-1.5 py-0.5"
                >
                  {stage.count}
                </Badge>
              </div>
              
              {/* Progress connector line */}
              {index < stages.length - 1 && (
                <div className="absolute -right-4 top-1/2 w-8 h-px bg-border transform -translate-y-1/2 z-10" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}