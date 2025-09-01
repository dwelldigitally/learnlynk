import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Rocket, Settings, Shield, MessageSquare, Workflow } from "lucide-react";
import { AIAgentWizardData } from "@/types/ai-agent";

interface ReviewLaunchStepProps {
  data: AIAgentWizardData;
  onComplete: (data: AIAgentWizardData) => void;
}

export function ReviewLaunchStep({ data, onComplete }: ReviewLaunchStepProps) {
  const enabledChannels = Object.entries(data.allowedChannels).filter(([_, enabled]) => enabled);
  const hasValidConfiguration = data.name && data.scope && data.functionalBoundaries.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Agent Configuration Review
          </CardTitle>
          <CardDescription>
            Review your agent settings before deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Agent Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <h4 className="font-medium">Agent Identity</h4>
            </div>
            <div className="ml-6 space-y-2">
              <div>
                <span className="text-sm font-medium">Name: </span>
                <span className="text-sm">{data.name || 'Not set'}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Scope: </span>
                <span className="text-sm">{data.scope || 'Not set'}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Capabilities: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.functionalBoundaries.map((boundary) => (
                    <Badge key={boundary} variant="secondary" className="text-xs">
                      {boundary}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Confidence Thresholds */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <h4 className="font-medium">Decision Making</h4>
            </div>
            <div className="ml-6 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-green-700">Auto-Action</p>
                <p className="text-muted-foreground">≥ {data.confidenceThresholds.fullAutoAction}%</p>
              </div>
              <div>
                <p className="font-medium text-blue-700">Suggest</p>
                <p className="text-muted-foreground">
                  {data.confidenceThresholds.suggestionOnly.min}% - {data.confidenceThresholds.suggestionOnly.max}%
                </p>
              </div>
              <div>
                <p className="font-medium text-red-700">Escalate</p>
                <p className="text-muted-foreground">&lt; {data.confidenceThresholds.noAction}%</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Communication */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <h4 className="font-medium">Communication</h4>
            </div>
            <div className="ml-6 space-y-2">
              <div>
                <span className="text-sm font-medium">Tone: </span>
                <Badge variant="outline" className="capitalize">
                  {data.personality.tone}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Channels: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {enabledChannels.map(([channel, _]) => (
                    <Badge key={channel} variant="secondary" className="text-xs capitalize">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Integration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              <h4 className="font-medium">Integration</h4>
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Journey Override: </span>
                <Badge variant={data.journeyIntegration.canOverrideSteps ? "default" : "secondary"}>
                  {data.journeyIntegration.canOverrideSteps ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Play Triggers: </span>
                <Badge variant={data.journeyIntegration.canTriggerPlays ? "default" : "secondary"}>
                  {data.journeyIntegration.canTriggerPlays ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Connected Journeys: </span>
                <span className="text-sm">{data.journeyIntegration.allowedJourneys.length}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Available Plays: </span>
                <span className="text-sm">{data.journeyIntegration.allowedPlays.length}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Guardrails */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <h4 className="font-medium">Safety Guardrails</h4>
            </div>
            <div className="ml-6 space-y-2">
              <div>
                <span className="text-sm font-medium">Daily Message Limit: </span>
                <span className="text-sm">{data.guardrails.maxMessagesPerDay}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Forbidden Topics: </span>
                <span className="text-sm">{data.guardrails.forbiddenTopics.length}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Excluded Groups: </span>
                <span className="text-sm">{data.guardrails.excludedStudentGroups.length}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Compliance Rules: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.guardrails.complianceRules.map((rule) => (
                    <Badge key={rule} variant="outline" className="text-xs">
                      {rule}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Deployment Options
          </CardTitle>
          <CardDescription>
            Choose how to launch your agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="p-6 h-auto flex flex-col items-start space-y-2"
              onClick={() => onComplete({ ...data, deploymentMode: 'shadow' })}
            >
              <div className="font-medium">Shadow Mode</div>
              <div className="text-sm text-muted-foreground text-left">
                Run for 30 days without sending messages. Monitor accuracy and performance before going live.
              </div>
              <Badge variant="secondary">Recommended</Badge>
            </Button>

            <Button
              variant="default"
              className="p-6 h-auto flex flex-col items-start space-y-2"
              onClick={() => onComplete({ ...data, deploymentMode: 'live' })}
              disabled={!hasValidConfiguration}
            >
              <div className="font-medium">Go Live</div>
              <div className="text-sm text-muted-foreground text-left">
                Deploy immediately and start autonomous actions based on confidence thresholds.
              </div>
              <Badge variant="outline">Active</Badge>
            </Button>
          </div>

          {!hasValidConfiguration && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Please complete all required fields before deployment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-green-50/50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-medium text-green-900">🚀 Ready for Launch:</p>
            <ul className="text-green-800 space-y-1 ml-4">
              <li>• Your agent will start monitoring student interactions immediately</li>
              <li>• All actions are logged and can be reviewed in the dashboard</li>
              <li>• You can pause, modify, or delete the agent anytime</li>
              <li>• Performance metrics will be available after 24 hours</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}