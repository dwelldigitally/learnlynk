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
    <div className="flex items-center justify-between bg-card border rounded-lg p-4">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold">Pipeline:</h2>
        <div className="text-xs text-muted-foreground">
          {stages.reduce((sum, stage) => sum + stage.count, 0)} total
        </div>
      </div>
      
      <Tabs value={activeStage} onValueChange={onStageChange} className="flex-1 max-w-3xl">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50 h-10">
          <TabsTrigger value="all" className="text-xs">
            <div className="flex items-center gap-1">
              <span>All</span>
              <Badge variant="outline" className="text-xs px-1 py-0">
                {stages.reduce((sum, stage) => sum + stage.count, 0)}
              </Badge>
            </div>
          </TabsTrigger>
          
          {stages.map((stage) => (
            <TabsTrigger 
              key={stage.key} 
              value={stage.key}
              className="text-xs"
            >
              <div className="flex items-center gap-1">
                <div 
                  className={cn("w-1.5 h-1.5 rounded-full", stage.color)}
                />
                <span className="hidden sm:inline">{stage.label}</span>
                <span className="sm:hidden">{stage.label.substring(0, 3)}</span>
                <Badge 
                  variant={activeStage === stage.key ? "default" : "outline"} 
                  className="text-xs px-1 py-0"
                >
                  {stage.count}
                </Badge>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}