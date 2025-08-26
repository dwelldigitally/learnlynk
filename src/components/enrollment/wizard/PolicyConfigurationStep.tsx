import React from "react";
import { PolicyData } from "@/types/policy";
import QuietHoursConfig from "../policy-configs/QuietHoursConfig";
import MessagePacingConfig from "../policy-configs/MessagePacingConfig";
import StopTriggersConfig from "../policy-configs/StopTriggersConfig";
import ConfidenceBandsConfig from "../policy-configs/ConfidenceBandsConfig";
import SLAManagementConfig from "../policy-configs/SLAManagementConfig";
import CustomPolicyConfig from "../policy-configs/CustomPolicyConfig";

interface PolicyConfigurationStepProps {
  data: PolicyData;
  onDataChange: (data: Partial<PolicyData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PolicyConfigurationStep: React.FC<PolicyConfigurationStepProps> = ({
  data,
  onDataChange,
}) => {
  const handleSettingsChange = (newSettings: Record<string, any>) => {
    onDataChange({ settings: newSettings });
  };

  const renderConfigComponent = () => {
    switch (data.policyType) {
      case 'quiet_hours':
        return (
          <QuietHoursConfig
            settings={data.settings}
            onSettingsChange={handleSettingsChange}
          />
        );
      case 'message_pacing':
        return (
          <MessagePacingConfig
            settings={data.settings}
            onSettingsChange={handleSettingsChange}
          />
        );
      case 'stop_triggers':
        return (
          <StopTriggersConfig
            settings={data.settings}
            onSettingsChange={handleSettingsChange}
          />
        );
      case 'confidence_bands':
        return (
          <ConfidenceBandsConfig
            settings={data.settings}
            onSettingsChange={handleSettingsChange}
          />
        );
      case 'sla_management':
        return (
          <SLAManagementConfig
            settings={data.settings}
            onSettingsChange={handleSettingsChange}
          />
        );
      case 'custom':
      default:
        return (
          <CustomPolicyConfig
            settings={data.settings}
            onSettingsChange={handleSettingsChange}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Configure Policy Settings</h3>
        <p className="text-muted-foreground">
          Customize the specific settings for your {data.policyType.replace('_', ' ')} policy
        </p>
      </div>

      {renderConfigComponent()}
    </div>
  );
};

export default PolicyConfigurationStep;