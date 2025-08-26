import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";

interface ConfidenceBandsConfigProps {
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
}

const ACTIONS = [
  { value: 'auto_send', label: 'Auto Send', description: 'Automatically send the message' },
  { value: 'review_required', label: 'Review Required', description: 'Queue for human review' },
  { value: 'block', label: 'Block', description: 'Prevent message from being sent' },
  { value: 'escalate', label: 'Escalate', description: 'Send to supervisor for approval' },
  { value: 'alternative_content', label: 'Alternative Content', description: 'Use fallback message' }
];

const FALLBACK_ACTIONS = [
  { value: 'human_review', label: 'Human Review' },
  { value: 'delay_send', label: 'Delay Send' },
  { value: 'cancel_send', label: 'Cancel Send' },
  { value: 'use_template', label: 'Use Template' }
];

const ConfidenceBandsConfig: React.FC<ConfidenceBandsConfigProps> = ({
  settings,
  onSettingsChange
}) => {
  const minConfidence = settings.minConfidence || 0.7;
  const thresholds = settings.thresholds || {
    high: { min: 0.9, action: 'auto_send' },
    medium: { min: 0.7, action: 'review_required' },
    low: { min: 0.5, action: 'block' }
  };
  const fallbackAction = settings.fallbackAction || 'human_review';
  const enableML = settings.enableML ?? true;

  const updateSettings = (updates: Partial<typeof settings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const updateThreshold = (band: 'high' | 'medium' | 'low', field: 'min' | 'action', value: number | string) => {
    const newThresholds = {
      ...thresholds,
      [band]: {
        ...thresholds[band],
        [field]: value
      }
    };
    updateSettings({ thresholds: newThresholds });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Confidence Bands Configuration
          </CardTitle>
          <CardDescription>
            Set ML confidence thresholds and corresponding actions for content quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Minimum Confidence */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Minimum Confidence Threshold: {(minConfidence * 100).toFixed(0)}%
            </Label>
            <div className="px-2">
              <Slider
                value={[minConfidence]}
                onValueChange={([value]) => updateSettings({ minConfidence: value })}
                max={1}
                min={0}
                step={0.01}
                className="w-full"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Messages below this threshold will not be processed
            </div>
          </div>

          {/* Confidence Bands */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Confidence Bands & Actions</Label>
            
            {/* High Confidence */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">High Confidence</Label>
                <span className={`text-sm font-medium ${getConfidenceColor(thresholds.high?.min || 0.9)}`}>
                  {((thresholds.high?.min || 0.9) * 100).toFixed(0)}%+
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Minimum Threshold</Label>
                  <div className="px-2">
                    <Slider
                      value={[thresholds.high?.min || 0.9]}
                      onValueChange={([value]) => updateThreshold('high', 'min', value)}
                      max={1}
                      min={0.5}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Action</Label>
                  <Select
                    value={thresholds.high?.action || 'auto_send'}
                    onValueChange={(value) => updateThreshold('high', 'action', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIONS.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Medium Confidence */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Medium Confidence</Label>
                <span className={`text-sm font-medium ${getConfidenceColor(thresholds.medium?.min || 0.7)}`}>
                  {((thresholds.medium?.min || 0.7) * 100).toFixed(0)}%+
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Minimum Threshold</Label>
                  <div className="px-2">
                    <Slider
                      value={[thresholds.medium?.min || 0.7]}
                      onValueChange={([value]) => updateThreshold('medium', 'min', value)}
                      max={0.9}
                      min={0.3}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Action</Label>
                  <Select
                    value={thresholds.medium?.action || 'review_required'}
                    onValueChange={(value) => updateThreshold('medium', 'action', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIONS.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Low Confidence */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Low Confidence</Label>
                <span className={`text-sm font-medium ${getConfidenceColor(thresholds.low?.min || 0.5)}`}>
                  {((thresholds.low?.min || 0.5) * 100).toFixed(0)}%+
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Minimum Threshold</Label>
                  <div className="px-2">
                    <Slider
                      value={[thresholds.low?.min || 0.5]}
                      onValueChange={([value]) => updateThreshold('low', 'min', value)}
                      max={0.7}
                      min={0.1}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Action</Label>
                  <Select
                    value={thresholds.low?.action || 'block'}
                    onValueChange={(value) => updateThreshold('low', 'action', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIONS.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Fallback Action */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Fallback Action</Label>
            <Select
              value={fallbackAction}
              onValueChange={(value) => updateSettings({ fallbackAction: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FALLBACK_ACTIONS.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              Action to take when confidence cannot be determined
            </div>
          </div>

          {/* Information */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">How Confidence Bands Work:</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ML models evaluate content quality and appropriateness</li>
              <li>• Higher confidence means more likely to be effective</li>
              <li>• Actions are automatically applied based on confidence level</li>
              <li>• Thresholds can be adjusted based on performance data</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfidenceBandsConfig;