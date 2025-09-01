import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, AlertTriangle, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import { JourneyAIAgentData } from "../JourneyBasedAIAgentWizard";

interface ConfidenceSettingsStepProps {
  data: JourneyAIAgentData;
  updateData: (updates: Partial<JourneyAIAgentData>) => void;
}

export function ConfidenceSettingsStep({ data, updateData }: ConfidenceSettingsStepProps) {
  const updateConfidenceSettings = (field: string, value: any) => {
    updateData({
      confidenceSettings: {
        ...data.confidenceSettings,
        [field]: value
      }
    });
  };

  const updateAnalyticsConfig = (field: string, value: boolean) => {
    updateData({
      analyticsConfig: {
        ...data.analyticsConfig,
        [field]: value
      }
    });
  };

  // Ensure min is always less than max for ask approval range
  const handleAskApprovalRangeChange = ([min, max]: number[]) => {
    updateConfidenceSettings('askApprovalRange', { min, max });
    
    // Auto-adjust other thresholds if needed
    if (data.confidenceSettings.autoActThreshold <= max) {
      updateConfidenceSettings('autoActThreshold', max + 5);
    }
    if (data.confidenceSettings.skipThreshold >= min) {
      updateConfidenceSettings('skipThreshold', Math.max(0, min - 5));
    }
  };

  const { autoActThreshold, askApprovalRange, skipThreshold } = data.confidenceSettings;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">Confidence & Decision Thresholds</h3>
        <p className="text-muted-foreground">
          Configure when the AI should act autonomously, ask for approval, or skip actions
        </p>
      </div>

      {/* Confidence Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Decision-Making Thresholds
          </CardTitle>
          <CardDescription>Set confidence levels for automated decision-making</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Auto-Act Threshold */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoAct">Auto-Act Threshold</Label>
                <p className="text-sm text-muted-foreground">
                  AI will automatically execute actions above this confidence level
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">{autoActThreshold}%</span>
                <p className="text-xs text-muted-foreground">High confidence</p>
              </div>
            </div>
            <div className="space-y-2">
              <Slider
                value={[autoActThreshold]}
                onValueChange={([value]) => updateConfidenceSettings('autoActThreshold', value)}
                max={100}
                min={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>60%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Ask Approval Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="askApproval">Ask for Approval Range</Label>
                <p className="text-sm text-muted-foreground">
                  AI will request human approval for actions in this confidence range
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-yellow-600">
                  {askApprovalRange.min}% - {askApprovalRange.max}%
                </span>
                <p className="text-xs text-muted-foreground">Medium confidence</p>
              </div>
            </div>
            <div className="space-y-2">
              <Slider
                value={[askApprovalRange.min, askApprovalRange.max]}
                onValueChange={handleAskApprovalRangeChange}
                max={95}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5%</span>
                <span>95%</span>
              </div>
            </div>
          </div>

          {/* Skip Threshold */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="skip">Skip Action Threshold</Label>
                <p className="text-sm text-muted-foreground">
                  AI will skip actions below this confidence level
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-red-600">&lt;{skipThreshold}%</span>
                <p className="text-xs text-muted-foreground">Low confidence</p>
              </div>
            </div>
            <div className="space-y-2">
              <Slider
                value={[skipThreshold]}
                onValueChange={([value]) => updateConfidenceSettings('skipThreshold', value)}
                max={80}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>80%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Confidence Scale */}
      <Card>
        <CardHeader>
          <CardTitle>Confidence Scale Visualization</CardTitle>
          <CardDescription>How your agent will behave at different confidence levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Visual scale */}
            <div className="relative h-8 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 bg-red-500/20"
                style={{ left: '0%', right: `${100 - skipThreshold}%` }}
              />
              <div 
                className="absolute top-0 bottom-0 bg-yellow-500/20"
                style={{ left: `${skipThreshold}%`, right: `${100 - askApprovalRange.max}%` }}
              />
              <div 
                className="absolute top-0 bottom-0 bg-green-500/20"
                style={{ left: `${autoActThreshold}%`, right: '0%' }}
              />
            </div>

            {/* Labels */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-600">Skip Action</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Below {skipThreshold}% confidence
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Too uncertain to act safely
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-600">Ask Approval</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {askApprovalRange.min}% - {askApprovalRange.max}% confidence
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Moderate confidence, human review needed
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-600">Auto-Execute</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Above {autoActThreshold}% confidence
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  High confidence, safe to act automatically
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics & Monitoring
          </CardTitle>
          <CardDescription>Configure what metrics and events to track</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trackConversions">Track Conversions</Label>
                <p className="text-sm text-muted-foreground">
                  Monitor conversion rates and success metrics
                </p>
              </div>
              <Switch
                id="trackConversions"
                checked={data.analyticsConfig.trackConversions}
                onCheckedChange={(checked) => updateAnalyticsConfig('trackConversions', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trackEngagement">Track Engagement</Label>
                <p className="text-sm text-muted-foreground">
                  Monitor student engagement and response rates
                </p>
              </div>
              <Switch
                id="trackEngagement"
                checked={data.analyticsConfig.trackEngagement}
                onCheckedChange={(checked) => updateAnalyticsConfig('trackEngagement', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="generateReports">Generate Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Create automated performance reports
                </p>
              </div>
              <Switch
                id="generateReports"
                checked={data.analyticsConfig.generateReports}
                onCheckedChange={(checked) => updateAnalyticsConfig('generateReports', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alertOnAnomalies">Alert on Anomalies</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified of unusual patterns or issues
                </p>
              </div>
              <Switch
                id="alertOnAnomalies"
                checked={data.analyticsConfig.alertOnAnomalies}
                onCheckedChange={(checked) => updateAnalyticsConfig('alertOnAnomalies', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Confidence Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Auto-Execute Above</p>
              <p className="text-2xl font-bold text-green-600">{autoActThreshold}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ask Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{askApprovalRange.min}-{askApprovalRange.max}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Skip Below</p>
              <p className="text-2xl font-bold text-red-600">{skipThreshold}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Analytics Enabled</p>
              <p className="text-2xl font-bold">
                {Object.values(data.analyticsConfig).filter(Boolean).length}/4
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}