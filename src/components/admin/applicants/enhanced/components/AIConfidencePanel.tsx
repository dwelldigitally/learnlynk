import React from "react";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, TrendingUp } from "lucide-react";

interface AIConfidencePanelProps {
  aiConfidence: number;
  programFitScore: number;
  yieldPropensity: number;
}

export const AIConfidencePanel: React.FC<AIConfidencePanelProps> = ({
  aiConfidence,
  programFitScore,
  yieldPropensity
}) => {
  return (
    <div className="bg-card/50 backdrop-blur rounded-xl p-6 border shadow-sm min-w-[280px]">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-semibold text-foreground">AI Confidence Score</span>
        </div>
        <div className="relative">
          <div className="text-5xl font-bold text-primary mb-3">{aiConfidence}%</div>
          <Progress value={aiConfidence} className="h-4 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">Program Fit</span>
            </div>
            <div className="text-xl font-bold text-blue-600">{programFitScore}%</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-muted-foreground">Yield Rate</span>
            </div>
            <div className="text-xl font-bold text-purple-600">{yieldPropensity}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};