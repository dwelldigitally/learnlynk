import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  GraduationCap, 
  Users, 
  MapPin, 
  Settings,
  Plus,
  Trash2,
  ArrowRight
} from 'lucide-react';

interface ProgramIntegrationConfig {
  enabled: boolean;
  autoPopulatePrograms: boolean;
  defaultProgram?: string;
  routingRules: ProgramRoutingRule[];
  customMappings: ProgramFieldMapping[];
  intakeIntegration: boolean;
  advisorAssignment: boolean;
}

interface ProgramRoutingRule {
  id: string;
  condition: string;
  operator: 'equals' | 'contains' | 'starts_with';
  value: string;
  targetProgramId: string;
  advisorId?: string;
}

interface ProgramFieldMapping {
  id: string;
  formFieldId: string;
  programField: string;
  transformation?: string;
}

interface ProgramIntegrationProps {
  config: ProgramIntegrationConfig;
  onConfigUpdate: (config: ProgramIntegrationConfig) => void;
  availablePrograms?: any[];
  availableAdvisors?: any[];
  formFields?: any[];
}

export function ProgramIntegration({ 
  config, 
  onConfigUpdate,
  availablePrograms = [],
  availableAdvisors = [],
  formFields = []
}: ProgramIntegrationProps) {
  const addRoutingRule = () => {
    const newRule: ProgramRoutingRule = {
      id: `rule_${Date.now()}`,
      condition: '',
      operator: 'equals',
      value: '',
      targetProgramId: ''
    };
    
    onConfigUpdate({
      ...config,
      routingRules: [...config.routingRules, newRule]
    });
  };

  const removeRoutingRule = (id: string) => {
    onConfigUpdate({
      ...config,
      routingRules: config.routingRules.filter(r => r.id !== id)
    });
  };

  const updateRoutingRule = (id: string, updates: Partial<ProgramRoutingRule>) => {
    onConfigUpdate({
      ...config,
      routingRules: config.routingRules.map(r => 
        r.id === id ? { ...r, ...updates } : r
      )
    });
  };

  const addFieldMapping = () => {
    const newMapping: ProgramFieldMapping = {
      id: `mapping_${Date.now()}`,
      formFieldId: '',
      programField: ''
    };
    
    onConfigUpdate({
      ...config,
      customMappings: [...config.customMappings, newMapping]
    });
  };

  const removeFieldMapping = (id: string) => {
    onConfigUpdate({
      ...config,
      customMappings: config.customMappings.filter(m => m.id !== id)
    });
  };

  const updateFieldMapping = (id: string, updates: Partial<ProgramFieldMapping>) => {
    onConfigUpdate({
      ...config,
      customMappings: config.customMappings.map(m => 
        m.id === id ? { ...m, ...updates } : m
      )
    });
  };

  const programFields = [
    'name', 'email', 'phone', 'address', 'date_of_birth', 
    'education_level', 'work_experience', 'preferred_intake',
    'emergency_contact', 'visa_status', 'english_proficiency'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <CardTitle>Program Integration</CardTitle>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => onConfigUpdate({ ...config, enabled })}
          />
        </div>
      </CardHeader>
      
      {config.enabled && (
        <CardContent className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-populate Program Options</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically add program selection field to form
                </p>
              </div>
              <Switch
                checked={config.autoPopulatePrograms}
                onCheckedChange={(autoPopulatePrograms) => 
                  onConfigUpdate({ ...config, autoPopulatePrograms })
                }
              />
            </div>

            {config.autoPopulatePrograms && (
              <div className="space-y-2">
                <Label>Default Program (Optional)</Label>
                <Select
                  value={config.defaultProgram}
                  onValueChange={(defaultProgram) => 
                    onConfigUpdate({ ...config, defaultProgram })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default program" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePrograms.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label>Intake Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Connect with intake management system
                </p>
              </div>
              <Switch
                checked={config.intakeIntegration}
                onCheckedChange={(intakeIntegration) => 
                  onConfigUpdate({ ...config, intakeIntegration })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Advisor Assignment</Label>
                <p className="text-sm text-muted-foreground">
                  Auto-assign leads to program advisors
                </p>
              </div>
              <Switch
                checked={config.advisorAssignment}
                onCheckedChange={(advisorAssignment) => 
                  onConfigUpdate({ ...config, advisorAssignment })
                }
              />
            </div>
          </div>

          {/* Routing Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Program Routing Rules</h3>
              <Button size="sm" onClick={addRoutingRule}>
                <Plus className="h-4 w-4 mr-1" />
                Add Rule
              </Button>
            </div>

            <div className="space-y-3">
              {config.routingRules.map((rule) => (
                <div key={rule.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">IF</Badge>
                    <Select
                      value={rule.condition}
                      onValueChange={(condition) => updateRoutingRule(rule.id, { condition })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {formFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={rule.operator}
                      onValueChange={(operator: any) => updateRoutingRule(rule.id, { operator })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">equals</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                        <SelectItem value="starts_with">starts with</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Value"
                      value={rule.value}
                      onChange={(e) => updateRoutingRule(rule.id, { value: e.target.value })}
                      className="w-32"
                    />

                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    
                    <Badge variant="default">THEN</Badge>
                    <Select
                      value={rule.targetProgramId}
                      onValueChange={(targetProgramId) => updateRoutingRule(rule.id, { targetProgramId })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Assign to program" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePrograms.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeRoutingRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {config.advisorAssignment && (
                    <div className="flex items-center gap-2 ml-6">
                      <Label className="text-sm">Advisor:</Label>
                      <Select
                        value={rule.advisorId}
                        onValueChange={(advisorId) => updateRoutingRule(rule.id, { advisorId })}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select advisor" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAdvisors.map((advisor) => (
                            <SelectItem key={advisor.id} value={advisor.id}>
                              {advisor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Field Mappings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Custom Field Mappings</h3>
              <Button size="sm" onClick={addFieldMapping}>
                <Plus className="h-4 w-4 mr-1" />
                Add Mapping
              </Button>
            </div>

            <div className="space-y-3">
              {config.customMappings.map((mapping) => (
                <div key={mapping.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Select
                    value={mapping.formFieldId}
                    onValueChange={(formFieldId) => updateFieldMapping(mapping.id, { formFieldId })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Form Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {formFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <ArrowRight className="h-4 w-4 text-muted-foreground" />

                  <Select
                    value={mapping.programField}
                    onValueChange={(programField) => updateFieldMapping(mapping.id, { programField })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Program Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {programFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFieldMapping(mapping.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}