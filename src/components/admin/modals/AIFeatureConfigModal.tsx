import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, MessageSquare, FileText, Calendar, Brain, TrendingUp, Zap, Clock, Users, Target } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIFeatureConfig {
  featureId: string;
  settings: Record<string, any>;
}

interface AIFeatureConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureId: string;
  featureName: string;
  onSave: (config: AIFeatureConfig) => void;
}

export function AIFeatureConfigModal({ 
  isOpen, 
  onClose, 
  featureId, 
  featureName, 
  onSave 
}: AIFeatureConfigModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen && featureId) {
      loadConfiguration();
    }
  }, [isOpen, featureId]);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Load existing configuration from database
      // For now using default configurations
      setConfig(getDefaultConfig(featureId));
    } catch (error) {
      console.error('Failed to load configuration:', error);
      setConfig(getDefaultConfig(featureId));
    } finally {
      setLoading(false);
    }
  };

  const getDefaultConfig = (featureId: string): Record<string, any> => {
    const configs: Record<string, any> = {
      'auto-follow-up': {
        enabled: true,
        frequency: 'smart', // smart, daily, weekly
        triggerDelay: 24, // hours
        maxFollowUps: 5,
        personalizeMessages: true,
        includeDocuments: false,
        workingHoursOnly: true,
        workingHours: { start: '09:00', end: '17:00' },
        timezone: 'auto',
        templates: ['welcome', 'follow-up-1', 'follow-up-2'],
        escalationRules: {
          noResponseAfter: 72, // hours
          escalateTo: 'manager'
        }
      },
      'smart-scoring': {
        enabled: true,
        weightFactors: {
          demographics: 25,
          behavior: 40,
          engagement: 25,
          source: 10
        },
        thresholds: {
          hot: 80,
          warm: 60,
          cold: 40
        },
        realTimeUpdates: true,
        learningMode: true,
        feedbackLoop: true
      },
      'document-processing': {
        enabled: false,
        autoClassify: true,
        ocrEnabled: true,
        supportedFormats: ['pdf', 'jpg', 'png', 'doc', 'docx'],
        autoRequest: true,
        qualityChecks: true,
        notifyOnCompletion: true,
        retentionPeriod: 365 // days
      },
      'meeting-scheduler': {
        enabled: false,
        autoSchedule: false,
        bufferTime: 15, // minutes
        defaultDuration: 30, // minutes
        availability: {
          monday: { enabled: true, start: '09:00', end: '17:00' },
          tuesday: { enabled: true, start: '09:00', end: '17:00' },
          wednesday: { enabled: true, start: '09:00', end: '17:00' },
          thursday: { enabled: true, start: '09:00', end: '17:00' },
          friday: { enabled: true, start: '09:00', end: '17:00' },
          saturday: { enabled: false, start: '09:00', end: '17:00' },
          sunday: { enabled: false, start: '09:00', end: '17:00' }
        },
        confirmationRequired: true,
        reminderSettings: {
          enabled: true,
          timing: [24, 2] // hours before
        }
      },
      'conversion-prediction': {
        enabled: true,
        modelVersion: 'v2.1',
        confidenceThreshold: 70,
        updateFrequency: 'daily',
        factors: {
          demographics: true,
          behavior: true,
          engagement: true,
          timeline: true,
          source: true
        },
        notifications: {
          highProbability: true,
          lowProbability: false,
          thresholdChanges: true
        }
      },
      'workflow-optimization': {
        enabled: false,
        analysisFrequency: 'weekly',
        trackMetrics: {
          responseTime: true,
          conversionRate: true,
          engagementLevel: true,
          workload: true
        },
        suggestions: {
          autoApply: false,
          requireApproval: true,
          categories: ['routing', 'timing', 'communication']
        },
        reporting: {
          frequency: 'weekly',
          recipients: ['manager'],
          includeRecommendations: true
        }
      }
    };
    return configs[featureId] || {};
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Save configuration to database
      // For now, just call the onSave callback
      onSave({ featureId, settings: config });
      
      toast({
        title: "Configuration Saved",
        description: `${featureName} settings have been updated successfully.`,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to save configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedConfig = (parent: string, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  const renderAutoFollowUpConfig = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Basic Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enable Automated Follow-ups</Label>
            <Switch
              id="enabled"
              checked={config.enabled}
              onCheckedChange={(checked) => updateConfig('enabled', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Follow-up Frequency</Label>
            <Select value={config.frequency} onValueChange={(value) => updateConfig('frequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smart">Smart (AI-determined)</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom Schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="triggerDelay">Initial Delay (hours)</Label>
            <Slider
              value={[config.triggerDelay]}
              onValueChange={([value]) => updateConfig('triggerDelay', value)}
              max={168}
              min={1}
              step={1}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground">{config.triggerDelay} hours</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxFollowUps">Maximum Follow-ups</Label>
            <Input
              type="number"
              value={config.maxFollowUps}
              onChange={(e) => updateConfig('maxFollowUps', parseInt(e.target.value))}
              min={1}
              max={10}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Working Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="workingHoursOnly">Send only during working hours</Label>
            <Switch
              id="workingHoursOnly"
              checked={config.workingHoursOnly}
              onCheckedChange={(checked) => updateConfig('workingHoursOnly', checked)}
            />
          </div>

          {config.workingHoursOnly && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  type="time"
                  value={config.workingHours?.start}
                  onChange={(e) => updateNestedConfig('workingHours', 'start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  type="time"
                  value={config.workingHours?.end}
                  onChange={(e) => updateNestedConfig('workingHours', 'end', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Escalation Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="noResponseAfter">Escalate after no response (hours)</Label>
            <Input
              type="number"
              value={config.escalationRules?.noResponseAfter}
              onChange={(e) => updateNestedConfig('escalationRules', 'noResponseAfter', parseInt(e.target.value))}
              min={24}
              max={168}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="escalateTo">Escalate to</Label>
            <Select 
              value={config.escalationRules?.escalateTo} 
              onValueChange={(value) => updateNestedConfig('escalationRules', 'escalateTo', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="senior_advisor">Senior Advisor</SelectItem>
                <SelectItem value="team_lead">Team Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSmartScoringConfig = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Scoring Weights</CardTitle>
          <p className="text-xs text-muted-foreground">Adjust how much each factor contributes to the lead score</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(config.weightFactors || {}).map(([factor, weight]) => (
            <div key={factor} className="space-y-2">
              <div className="flex justify-between">
                <Label className="capitalize">{factor.replace('_', ' ')}</Label>
                <span className="text-sm text-muted-foreground">{weight as number}%</span>
              </div>
              <Slider
                value={[weight as number]}
                onValueChange={([value]) => updateNestedConfig('weightFactors', factor, value)}
                max={50}
                min={5}
                step={5}
                className="w-full"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Score Thresholds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(config.thresholds || {}).map(([level, threshold]) => (
            <div key={level} className="flex items-center justify-between">
              <Label className="capitalize flex items-center gap-2">
                {level}
                <Badge variant={level === 'hot' ? 'destructive' : level === 'warm' ? 'default' : 'secondary'}>
                  {threshold as number}+
                </Badge>
              </Label>
              <Input
                type="number"
                value={threshold as number}
                onChange={(e) => updateNestedConfig('thresholds', level, parseInt(e.target.value))}
                min={0}
                max={100}
                className="w-20"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="realTimeUpdates">Real-time score updates</Label>
            <Switch
              id="realTimeUpdates"
              checked={config.realTimeUpdates}
              onCheckedChange={(checked) => updateConfig('realTimeUpdates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="learningMode">AI learning mode</Label>
            <Switch
              id="learningMode"
              checked={config.learningMode}
              onCheckedChange={(checked) => updateConfig('learningMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="feedbackLoop">Enable feedback loop</Label>
            <Switch
              id="feedbackLoop"
              checked={config.feedbackLoop}
              onCheckedChange={(checked) => updateConfig('feedbackLoop', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocumentProcessingConfig = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Processing Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoClassify">Auto-classify documents</Label>
            <Switch
              id="autoClassify"
              checked={config.autoClassify}
              onCheckedChange={(checked) => updateConfig('autoClassify', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ocrEnabled">Enable OCR processing</Label>
            <Switch
              id="ocrEnabled"
              checked={config.ocrEnabled}
              onCheckedChange={(checked) => updateConfig('ocrEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="qualityChecks">Quality validation checks</Label>
            <Switch
              id="qualityChecks"
              checked={config.qualityChecks}
              onCheckedChange={(checked) => updateConfig('qualityChecks', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Supported File Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['pdf', 'jpg', 'png', 'doc', 'docx', 'xlsx', 'txt'].map((format) => (
              <Badge
                key={format}
                variant={config.supportedFormats?.includes(format) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  const current = config.supportedFormats || [];
                  const updated = current.includes(format)
                    ? current.filter((f: string) => f !== format)
                    : [...current, format];
                  updateConfig('supportedFormats', updated);
                }}
              >
                {format.toUpperCase()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfiguration = () => {
    switch (featureId) {
      case 'auto-follow-up':
        return renderAutoFollowUpConfig();
      case 'smart-scoring':
        return renderSmartScoringConfig();
      case 'document-processing':
        return renderDocumentProcessingConfig();
      default:
        return (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Configuration options for {featureName} coming soon.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configure {featureName}
          </DialogTitle>
          <DialogDescription>
            Customize how this AI feature works for your organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            renderConfiguration()
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}