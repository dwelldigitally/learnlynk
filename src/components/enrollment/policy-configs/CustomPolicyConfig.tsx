import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Settings, Code } from "lucide-react";

interface CustomPolicyConfigProps {
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
}

const SETTING_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'select', label: 'Select' },
  { value: 'json', label: 'JSON Object' }
];

interface CustomSetting {
  key: string;
  type: string;
  value: any;
  label: string;
  description: string;
  options?: string[];
}

const CustomPolicyConfig: React.FC<CustomPolicyConfigProps> = ({
  settings,
  onSettingsChange
}) => {
  const [newSettingKey, setNewSettingKey] = useState('');
  const [newSettingType, setNewSettingType] = useState('text');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Convert settings to custom settings format
  const customSettings: CustomSetting[] = Object.entries(settings).map(([key, value]) => ({
    key,
    type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'text',
    value,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    description: `Custom ${typeof value} setting`
  }));

  const updateSettings = (newCustomSettings: CustomSetting[]) => {
    const newSettings: Record<string, any> = {};
    newCustomSettings.forEach(setting => {
      newSettings[setting.key] = setting.value;
    });
    onSettingsChange(newSettings);
  };

  const addCustomSetting = () => {
    if (!newSettingKey.trim()) return;

    const defaultValue = newSettingType === 'boolean' ? false : 
                        newSettingType === 'number' ? 0 : 
                        newSettingType === 'json' ? {} : '';

    const newSetting: CustomSetting = {
      key: newSettingKey,
      type: newSettingType,
      value: defaultValue,
      label: newSettingKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      description: `Custom ${newSettingType} setting`
    };

    updateSettings([...customSettings, newSetting]);
    setNewSettingKey('');
    setNewSettingType('text');
  };

  const updateCustomSetting = (index: number, updates: Partial<CustomSetting>) => {
    const newCustomSettings = customSettings.map((setting, i) =>
      i === index ? { ...setting, ...updates } : setting
    );
    updateSettings(newCustomSettings);
  };

  const removeCustomSetting = (index: number) => {
    const newCustomSettings = customSettings.filter((_, i) => i !== index);
    updateSettings(newCustomSettings);
  };

  const renderSettingInput = (setting: CustomSetting, index: number) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.value}
            onCheckedChange={(checked) => updateCustomSetting(index, { value: checked })}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => updateCustomSetting(index, { value: parseFloat(e.target.value) || 0 })}
            className="w-full"
          />
        );
      case 'select':
        return (
          <Select
            value={setting.value}
            onValueChange={(value) => updateCustomSetting(index, { value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(setting.options || ['option1', 'option2']).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'json':
        return (
          <Textarea
            value={JSON.stringify(setting.value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateCustomSetting(index, { value: parsed });
              } catch {
                // Invalid JSON, don't update
              }
            }}
            className="w-full font-mono text-sm"
            rows={4}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={setting.value}
            onChange={(e) => updateCustomSetting(index, { value: e.target.value })}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Custom Policy Configuration
          </CardTitle>
          <CardDescription>
            Create a flexible policy with custom settings and rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Custom Settings */}
          {customSettings.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Custom Settings</Label>
              {customSettings.map((setting, index) => (
                <div key={setting.key} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">{setting.label}</Label>
                      <div className="text-xs text-muted-foreground">
                        Key: {setting.key} • Type: {setting.type}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomSetting(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Value</Label>
                    {renderSettingInput(setting, index)}
                  </div>
                  
                  {showAdvanced && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={setting.label}
                          onChange={(e) => updateCustomSetting(index, { label: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={setting.description}
                          onChange={(e) => updateCustomSetting(index, { description: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add New Setting */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Add New Setting</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-sm">Setting Key</Label>
                <Input
                  placeholder="e.g., maxRetries"
                  value={newSettingKey}
                  onChange={(e) => setNewSettingKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Type</Label>
                <Select value={newSettingType} onValueChange={setNewSettingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SETTING_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Action</Label>
                <Button
                  onClick={addCustomSetting}
                  disabled={!newSettingKey.trim()}
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Advanced Options</Label>
              <div className="text-sm text-muted-foreground">
                Show additional configuration options for each setting
              </div>
            </div>
            <Switch
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
          </div>

          {/* Policy Logic Template */}
          {showAdvanced && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code className="h-4 w-4" />
                  Policy Logic Template
                </CardTitle>
                <CardDescription className="text-sm">
                  JSON template for advanced policy logic (for developers)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={JSON.stringify({
                    rules: [
                      {
                        condition: "student.stage === 'enrolled'",
                        action: "allow",
                        settings: settings
                      }
                    ],
                    defaults: settings
                  }, null, 2)}
                  readOnly
                  className="font-mono text-sm"
                  rows={8}
                />
              </CardContent>
            </Card>
          )}

          {/* Information */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">Custom Policy Features:</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Flexible configuration with custom key-value pairs</li>
              <li>• Support for multiple data types (text, numbers, booleans, JSON)</li>
              <li>• Can be used for any business logic not covered by standard policies</li>
              <li>• Settings are passed to policy evaluation functions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomPolicyConfig;
