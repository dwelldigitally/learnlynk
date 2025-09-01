import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { AIAgentWizardData } from "@/types/ai-agent";

interface ConfidenceThresholdsStepProps {
  data: AIAgentWizardData;
  updateData: (updates: Partial<AIAgentWizardData>) => void;
}

export function ConfidenceThresholdsStep({ data, updateData }: ConfidenceThresholdsStepProps) {
  const updateFullAutoAction = (value: number) => {
    updateData({
      confidenceThresholds: {
        ...data.confidenceThresholds,
        fullAutoAction: value,
        suggestionOnly: {
          ...data.confidenceThresholds.suggestionOnly,
          max: Math.min(value - 1, data.confidenceThresholds.suggestionOnly.max)
        }
      }
    });
  };

  const updateSuggestionMax = (value: number) => {
    updateData({
      confidenceThresholds: {
        ...data.confidenceThresholds,
        suggestionOnly: {
          ...data.confidenceThresholds.suggestionOnly,
          max: value
        }
      }
    });
  };

  const updateSuggestionMin = (value: number) => {
    updateData({
      confidenceThresholds: {
        ...data.confidenceThresholds,
        suggestionOnly: {
          ...data.confidenceThresholds.suggestionOnly,
          min: value
        },
        noAction: value
      }
    });
  };

  const { fullAutoAction, suggestionOnly, noAction } = data.confidenceThresholds;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Confidence-Based Decision Making</CardTitle>
          <CardDescription>
            Set thresholds that determine when the agent acts autonomously vs. asks for human review
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Full Auto Action */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <Label className="text-base font-medium">Full Auto-Action Threshold</Label>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ≥ {fullAutoAction}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Agent executes actions immediately without human review
            </p>
            <div className="space-y-2">
              <Slider
                value={[fullAutoAction]}
                onValueChange={([value]) => updateFullAutoAction(value)}
                max={100}
                min={70}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>70%</span>
                <span>Conservative</span>
                <span>Aggressive</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Suggestion Range */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-medium">Suggestion Range</Label>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {suggestionOnly.min}% - {suggestionOnly.max}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Agent suggests actions but waits for human approval
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Upper bound (max {fullAutoAction - 1}%)</Label>
                <Slider
                  value={[suggestionOnly.max]}
                  onValueChange={([value]) => updateSuggestionMax(value)}
                  max={fullAutoAction - 1}
                  min={suggestionOnly.min + 1}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Lower bound</Label>
                <Slider
                  value={[suggestionOnly.min]}
                  onValueChange={([value]) => updateSuggestionMin(value)}
                  max={suggestionOnly.max - 1}
                  min={30}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* No Action */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <Label className="text-base font-medium">No Action Threshold</Label>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                &lt; {noAction}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Agent escalates to human review without suggesting specific actions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Visual Representation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Decision Flow Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative h-12 bg-gradient-to-r from-red-200 via-blue-200 to-green-200 rounded-lg overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-red-400/50 flex items-center justify-center text-xs font-medium"
                style={{ width: `${noAction}%` }}
              >
                Escalate
              </div>
              <div 
                className="absolute top-0 h-full bg-blue-400/50 flex items-center justify-center text-xs font-medium"
                style={{ 
                  left: `${suggestionOnly.min}%`, 
                  width: `${suggestionOnly.max - suggestionOnly.min}%` 
                }}
              >
                Suggest
              </div>
              <div 
                className="absolute right-0 top-0 h-full bg-green-400/50 flex items-center justify-center text-xs font-medium"
                style={{ width: `${100 - fullAutoAction}%` }}
              >
                Auto-Act
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-red-700">Escalate</div>
                <div className="text-muted-foreground">0% - {noAction}%</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-700">Suggest</div>
                <div className="text-muted-foreground">{suggestionOnly.min}% - {suggestionOnly.max}%</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-700">Auto-Act</div>
                <div className="text-muted-foreground">{fullAutoAction}% - 100%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-yellow-50/50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-medium text-yellow-900">🎯 Threshold Recommendations:</p>
            <ul className="text-yellow-800 space-y-1 ml-4">
              <li>• <strong>Conservative:</strong> 95% auto, 70-94% suggest, &lt;70% escalate</li>
              <li>• <strong>Balanced:</strong> 90% auto, 60-89% suggest, &lt;60% escalate</li>
              <li>• <strong>Aggressive:</strong> 80% auto, 50-79% suggest, &lt;50% escalate</li>
              <li>• Start conservative and adjust based on performance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}