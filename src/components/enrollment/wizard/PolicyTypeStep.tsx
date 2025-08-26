import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { POLICY_TYPES, PolicyData } from "@/types/policy";
import { 
  Moon, 
  Timer, 
  StopCircle, 
  Target, 
  Clock3, 
  Settings,
  CheckCircle
} from "lucide-react";

interface PolicyTypeStepProps {
  data: PolicyData;
  onDataChange: (data: Partial<PolicyData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const iconMap = {
  Moon,
  Timer,
  StopCircle,
  Target,
  Clock3,
  Settings
};

const PolicyTypeStep: React.FC<PolicyTypeStepProps> = ({
  data,
  onDataChange,
}) => {
  const handleTypeSelection = (type: typeof POLICY_TYPES[number]) => {
    onDataChange({
      policyType: type.id as any,
      settings: { ...type.template.settings },
      icon: type.icon
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Choose Policy Type</h3>
        <p className="text-muted-foreground">
          Select the type of policy you want to create. Each type comes with pre-configured templates.
        </p>
      </div>

      <div className="grid gap-4">
        {POLICY_TYPES.map((type) => {
          const IconComponent = iconMap[type.icon as keyof typeof iconMap];
          const isSelected = data.policyType === type.id;
          
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                isSelected ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => handleTypeSelection(type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {type.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {type.description}
                </CardDescription>
                
                {/* Preview of template settings */}
                {Object.keys(type.template.settings).length > 0 && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Template includes:</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {type.id === 'quiet_hours' && (
                        <>
                          <div>• Time ranges: {type.template.settings.timeRanges?.[0]?.start} - {type.template.settings.timeRanges?.[0]?.end}</div>
                          <div>• Emergency override: {type.template.settings.emergencyOverride ? 'Enabled' : 'Disabled'}</div>
                          <div>• Channels: {type.template.settings.channels?.join(', ')}</div>
                        </>
                      )}
                      {type.id === 'message_pacing' && (
                        <>
                          <div>• Max per hour: {type.template.settings.maxPerHour}</div>
                          <div>• Max per day: {type.template.settings.maxPerDay}</div>
                          <div>• Min interval: {type.template.settings.minInterval} minutes</div>
                        </>
                      )}
                      {type.id === 'stop_triggers' && (
                        <>
                          <div>• Triggers: {type.template.settings.triggers?.join(', ')}</div>
                          <div>• Grace period: {type.template.settings.gracePeriod} hours</div>
                        </>
                      )}
                      {type.id === 'confidence_bands' && (
                        <>
                          <div>• Min confidence: {(type.template.settings.minConfidence * 100)}%</div>
                          <div>• Thresholds: High ({(type.template.settings.thresholds?.high?.min * 100)}%), Medium ({(type.template.settings.thresholds?.medium?.min * 100)}%)</div>
                        </>
                      )}
                      {type.id === 'sla_management' && (
                        <>
                          <div>• Response targets: Inquiry ({type.template.settings.responseTargets?.inquiry}h), Application ({type.template.settings.responseTargets?.application}h)</div>
                          <div>• Escalation levels configured</div>
                        </>
                      )}
                      {type.id === 'custom' && (
                        <div>• Flexible configuration options</div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PolicyTypeStep;