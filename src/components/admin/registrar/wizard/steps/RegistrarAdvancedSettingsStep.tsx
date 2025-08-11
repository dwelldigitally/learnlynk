import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Shield, 
  FileSearch, 
  Database,
  BarChart3,
  Settings,
  CheckCircle,
  Info,
  Globe,
  Lock,
  Archive
} from "lucide-react";
import { RegistrarAIAgentData } from "../RegistrarAIAgentWizard";

interface RegistrarAdvancedSettingsStepProps {
  data: RegistrarAIAgentData;
  updateData: (updates: Partial<RegistrarAIAgentData>) => void;
}

const COMPLIANCE_REQUIREMENTS = [
  { 
    id: 'ferpa', 
    label: 'FERPA Compliance', 
    description: 'Family Educational Rights and Privacy Act requirements',
    required: true
  },
  { 
    id: 'gdpr', 
    label: 'GDPR Compliance', 
    description: 'General Data Protection Regulation for EU students',
    required: false
  },
  { 
    id: 'state_regulations', 
    label: 'State Regulations', 
    description: 'State-specific educational compliance requirements',
    required: true
  },
  { 
    id: 'accreditation', 
    label: 'Accreditation Standards', 
    description: 'Institutional accreditation body requirements',
    required: true
  },
  { 
    id: 'title_iv', 
    label: 'Title IV Compliance', 
    description: 'Federal financial aid program compliance',
    required: false
  },
  { 
    id: 'accessibility', 
    label: 'ADA Accessibility', 
    description: 'Americans with Disabilities Act compliance',
    required: true
  }
];

const INTEGRATION_OPTIONS = [
  { 
    id: 'sis_integration', 
    label: 'Student Information System', 
    description: 'Connect with your existing SIS for seamless data flow',
    icon: Database
  },
  { 
    id: 'crm_integration', 
    label: 'CRM Integration', 
    description: 'Integrate with customer relationship management system',
    icon: Globe
  },
  { 
    id: 'document_management', 
    label: 'Document Management', 
    description: 'Connect with document storage and management systems',
    icon: FileSearch
  },
  { 
    id: 'communication_platform', 
    label: 'Communication Platform', 
    description: 'Integrate with email and messaging systems',
    icon: Settings
  }
];

const REPORTING_PREFERENCES = [
  'Daily Processing Summary',
  'Weekly Performance Report',
  'Monthly Compliance Report',
  'Application Status Dashboard',
  'Document Processing Analytics',
  'Enrollment Prediction Reports',
  'Escalation Trend Analysis',
  'Student Satisfaction Metrics'
];

const AUDIT_SETTINGS = [
  { 
    id: 'log_all_actions', 
    label: 'Log All Actions', 
    description: 'Record every action taken by the AI agent',
    defaultValue: true
  },
  { 
    id: 'decision_tracking', 
    label: 'Decision Tracking', 
    description: 'Track all automated decisions and their reasoning',
    defaultValue: true
  },
  { 
    id: 'data_access_log', 
    label: 'Data Access Log', 
    description: 'Log all data access and modifications',
    defaultValue: true
  },
  { 
    id: 'compliance_monitoring', 
    label: 'Compliance Monitoring', 
    description: 'Monitor and log compliance-related activities',
    defaultValue: true
  },
  { 
    id: 'performance_tracking', 
    label: 'Performance Tracking', 
    description: 'Track agent performance and efficiency metrics',
    defaultValue: false
  }
];

export function RegistrarAdvancedSettingsStep({ data, updateData }: RegistrarAdvancedSettingsStepProps) {
  const toggleComplianceRequirement = (requirementId: string) => {
    const current = data.compliance_requirements || [];
    const updated = current.includes(requirementId)
      ? current.filter(id => id !== requirementId)
      : [...current, requirementId];
    updateData({ compliance_requirements: updated });
  };

  const toggleReportingPreference = (preference: string) => {
    const current = data.reporting_preferences || [];
    const updated = current.includes(preference)
      ? current.filter(p => p !== preference)
      : [...current, preference];
    updateData({ reporting_preferences: updated });
  };

  const updateIntegrationSetting = (integrationId: string, enabled: boolean) => {
    const current = data.integration_settings || {};
    updateData({ 
      integration_settings: { 
        ...current, 
        [integrationId]: enabled 
      } 
    });
  };

  const updateAuditSetting = (settingId: string, enabled: boolean) => {
    const current = data.audit_settings || {};
    updateData({ 
      audit_settings: { 
        ...current, 
        [settingId]: enabled 
      } 
    });
  };

  return (
    <div className="space-y-6">
      {/* Compliance Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Requirements
          </CardTitle>
          <CardDescription>
            Configure compliance monitoring and regulatory requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {COMPLIANCE_REQUIREMENTS.map((requirement) => (
              <div key={requirement.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{requirement.label}</h4>
                    {requirement.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{requirement.description}</p>
                </div>
                <Switch
                  checked={data.compliance_requirements?.includes(requirement.id) || requirement.required}
                  onCheckedChange={(checked) => !requirement.required && toggleComplianceRequirement(requirement.id)}
                  disabled={requirement.required}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            System Integrations
          </CardTitle>
          <CardDescription>
            Connect your registrar agent with existing systems and platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INTEGRATION_OPTIONS.map((integration) => {
              const IconComponent = integration.icon;
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{integration.label}</h4>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={data.integration_settings?.[integration.id] || false}
                    onCheckedChange={(checked) => updateIntegrationSetting(integration.id, checked)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Audit & Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Audit & Security Settings
          </CardTitle>
          <CardDescription>
            Configure audit trails and security monitoring for your registrar agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {AUDIT_SETTINGS.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{setting.label}</h4>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch
                  checked={data.audit_settings?.[setting.id] ?? setting.defaultValue}
                  onCheckedChange={(checked) => updateAuditSetting(setting.id, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reporting Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reporting Preferences
          </CardTitle>
          <CardDescription>
            Select which reports and analytics you want to receive regularly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {REPORTING_PREFERENCES.map((preference) => (
              <Button
                key={preference}
                variant={data.reporting_preferences?.includes(preference) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleReportingPreference(preference)}
              >
                {preference}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Retention Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Data Retention & Privacy
          </CardTitle>
          <CardDescription>
            Configure how long data should be retained and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Application Data Retention</Label>
              <Select defaultValue="7_years">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_year">1 Year</SelectItem>
                  <SelectItem value="3_years">3 Years</SelectItem>
                  <SelectItem value="5_years">5 Years</SelectItem>
                  <SelectItem value="7_years">7 Years (Recommended)</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Audit Log Retention</Label>
              <Select defaultValue="10_years">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3_years">3 Years</SelectItem>
                  <SelectItem value="5_years">5 Years</SelectItem>
                  <SelectItem value="7_years">7 Years</SelectItem>
                  <SelectItem value="10_years">10 Years (Recommended)</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Advanced Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Compliance Requirements</h4>
                <p className="text-sm text-muted-foreground">
                  {data.compliance_requirements?.length || 0} requirements configured
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.compliance_requirements?.slice(0, 3).map(req => {
                    const requirement = COMPLIANCE_REQUIREMENTS.find(r => r.id === req);
                    return requirement ? (
                      <Badge key={req} variant="outline" className="text-xs">
                        {requirement.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">System Integrations</h4>
                <p className="text-sm text-muted-foreground">
                  {Object.values(data.integration_settings || {}).filter(Boolean).length} integrations enabled
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Audit & Security</h4>
                <p className="text-sm text-muted-foreground">
                  {Object.values(data.audit_settings || {}).filter(Boolean).length} audit features active
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Reporting</h4>
                <p className="text-sm text-muted-foreground">
                  {data.reporting_preferences?.length || 0} report types selected
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}