import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Clock, Shield, Users, Settings } from "lucide-react";
import { PolicyData, POLICY_TYPES, PRIORITY_LEVELS } from "@/types/policy";

interface PolicyPreviewStepProps {
  data: PolicyData;
  onDataChange: (data: Partial<PolicyData>) => void;
  onSave: () => void;
  onPrevious: () => void;
}

const PolicyPreviewStep: React.FC<PolicyPreviewStepProps> = ({
  data,
}) => {
  const policyType = POLICY_TYPES.find(type => type.id === data.policyType);
  const priorityLevel = PRIORITY_LEVELS.find(level => level.value === data.priority);

  const getImpactEstimation = () => {
    switch (data.policyType) {
      case 'quiet_hours':
        return {
          affected: 'All students',
          impact: 'Reduced after-hours communications',
          benefits: 'Improved work-life balance, compliance with regulations'
        };
      case 'message_pacing':
        return {
          affected: 'All active communications',
          impact: 'Controlled message frequency',
          benefits: 'Reduced message fatigue, better engagement rates'
        };
      case 'stop_triggers':
        return {
          affected: 'Students triggering stop events',
          impact: 'Immediate communication halt',
          benefits: 'Compliance protection, reputation management'
        };
      default:
        return {
          affected: 'Varies by configuration',
          impact: 'Custom policy effects',
          benefits: 'Tailored automation benefits'
        };
    }
  };

  const impact = getImpactEstimation();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Policy Preview</h3>
        <p className="text-muted-foreground">
          Review your policy configuration before saving
        </p>
      </div>

      <div className="grid gap-6">
        {/* Policy Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Policy Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Policy Name</Label>
                <div className="text-lg font-semibold">{data.name}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{policyType?.name}</Badge>
                  <Badge 
                    variant="outline" 
                    className={priorityLevel?.color}
                  >
                    {priorityLevel?.label} Priority
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-muted-foreground mt-1">{data.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {data.isActive ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-orange-600" />
                )}
                <span className="text-sm">
                  {data.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {data.category.charAt(0).toUpperCase() + data.category.slice(1)} Policy
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Details */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(data.settings).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.settings).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No specific configuration set (using defaults)
              </p>
            )}
          </CardContent>
        </Card>

        {/* Conditions & Triggers */}
        {(data.conditions.length > 0 || data.triggers.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Rules & Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.conditions.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Conditions ({data.conditions.length})</Label>
                  <div className="mt-2 space-y-2">
                    {data.conditions.map((condition, index) => (
                      <div key={condition.id} className="text-sm bg-muted/50 p-2 rounded">
                        {index > 0 && condition.logicalOperator && (
                          <span className="font-medium">{condition.logicalOperator} </span>
                        )}
                        <span className="font-medium">{condition.field}</span>
                        <span className="mx-2">{condition.operator.replace('_', ' ')}</span>
                        <span className="font-medium">{condition.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.triggers.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Triggers ({data.triggers.length})</Label>
                  <div className="mt-2 space-y-2">
                    {data.triggers.map((trigger) => (
                      <div key={trigger.id} className="text-sm bg-muted/50 p-2 rounded">
                        <span className="font-medium">{trigger.event}</span>
                        {trigger.delay && trigger.delay > 0 && (
                          <span className="text-muted-foreground"> (delay: {trigger.delay}m)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Impact Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Affected Users</Label>
                <p className="text-muted-foreground mt-1">{impact.affected}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Expected Impact</Label>
                <p className="text-muted-foreground mt-1">{impact.impact}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Benefits</Label>
                <p className="text-muted-foreground mt-1">{impact.benefits}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Policy Activation Notice
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {data.isActive 
                    ? "This policy will be activated immediately after creation and will affect ongoing communications."
                    : "This policy will be saved but remain inactive until manually enabled."
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple Label component for this preview
const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = "", 
  children 
}) => (
  <div className={`text-sm font-medium ${className}`}>
    {children}
  </div>
);

export default PolicyPreviewStep;