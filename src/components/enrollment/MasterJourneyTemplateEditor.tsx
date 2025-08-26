import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, GripVertical, Clock, FileText, Phone, Video, Users } from 'lucide-react';
import { JourneyTemplate, JourneyStageTemplate } from '@/types/academicJourney';
import { toast } from 'sonner';

interface MasterJourneyTemplateEditorProps {
  template?: JourneyTemplate | null;
  studentType: 'domestic' | 'international';
  onSave: (template: JourneyTemplate) => Promise<void>;
  onCancel: () => void;
}

const STAGE_TYPES = [
  { value: 'application_review', label: 'Application Review', icon: FileText },
  { value: 'document_verification', label: 'Document Verification', icon: FileText },
  { value: 'phone_interview', label: 'Phone Interview', icon: Phone },
  { value: 'video_interview', label: 'Video Interview', icon: Video },
  { value: 'committee_review', label: 'Committee Review', icon: Users },
  { value: 'enrollment_confirmation', label: 'Enrollment Confirmation', icon: FileText },
  { value: 'orientation', label: 'Orientation', icon: Users },
  { value: 'custom', label: 'Custom Stage', icon: FileText }
];

export function MasterJourneyTemplateEditor({
  template,
  studentType,
  onSave,
  onCancel
}: MasterJourneyTemplateEditorProps) {
  const [templateData, setTemplateData] = useState<JourneyTemplate>({
    id: template?.id || '',
    name: template?.name || `${studentType.charAt(0).toUpperCase() + studentType.slice(1)} Master Journey Template`,
    description: template?.description || `Master journey template for ${studentType} students`,
    category: template?.category || 'enrollment',
    student_type: studentType,
    complexity_level: template?.complexity_level || 'medium',
    is_master_template: true,
    is_system_template: template?.is_system_template || false,
    usage_count: template?.usage_count || 0,
    created_at: template?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    template_data: template?.template_data || {
      stages: [],
      default_timings: {
        stall_threshold_days: 7,
        expected_duration_days: 30
      },
      communication_rules: []
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addStage = () => {
    const newStage: JourneyStageTemplate = {
      name: 'New Stage',
      stage_type: 'custom',
      order_index: templateData.template_data?.stages?.length || 0,
      timing_config: {
        expected_duration_days: 3,
        stall_threshold_days: 7
      },
      requirements: [],
      channel_rules: []
    };

    setTemplateData(prev => ({
      ...prev,
      template_data: {
        ...prev.template_data!,
        stages: [...(prev.template_data?.stages || []), newStage]
      }
    }));
  };

  const updateStage = (index: number, updates: Partial<JourneyStageTemplate>) => {
    setTemplateData(prev => ({
      ...prev,
      template_data: {
        ...prev.template_data!,
        stages: prev.template_data!.stages.map((stage, i) => 
          i === index ? { ...stage, ...updates } : stage
        )
      }
    }));
  };

  const removeStage = (index: number) => {
    setTemplateData(prev => ({
      ...prev,
      template_data: {
        ...prev.template_data!,
        stages: prev.template_data!.stages.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSave(templateData);
      toast.success('Master journey template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStageIcon = (stageType: string) => {
    const stageConfig = STAGE_TYPES.find(type => type.value === stageType);
    return stageConfig?.icon || FileText;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {studentType.charAt(0).toUpperCase() + studentType.slice(1)} Journey Template Editor
          </h2>
          <p className="text-muted-foreground">
            Configure the stages and requirements for your academic journey template
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Template Settings</CardTitle>
              <CardDescription>
                Basic information about this journey template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Domestic Student Journey"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={templateData.description}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this journey template..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="student-type">Student Type</Label>
                <Select
                  value={templateData.student_type}
                  onValueChange={(value: 'domestic' | 'international') => 
                    setTemplateData(prev => ({ ...prev, student_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complexity">Complexity Level</Label>
                <Select
                  value={templateData.complexity_level}
                  onValueChange={(value: 'simple' | 'medium' | 'complex') => 
                    setTemplateData(prev => ({ ...prev, complexity_level: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="complex">Complex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Default Timings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expected-duration">Expected Duration (days)</Label>
                    <Input
                      id="expected-duration"
                      type="number"
                      value={templateData.template_data?.default_timings?.expected_duration_days}
                      onChange={(e) => setTemplateData(prev => ({
                        ...prev,
                        template_data: {
                          ...prev.template_data!,
                          default_timings: {
                            ...prev.template_data!.default_timings,
                            expected_duration_days: parseInt(e.target.value) || 30
                          }
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stall-threshold">Stall Threshold (days)</Label>
                    <Input
                      id="stall-threshold"
                      type="number"
                      value={templateData.template_data?.default_timings?.stall_threshold_days}
                      onChange={(e) => setTemplateData(prev => ({
                        ...prev,
                        template_data: {
                          ...prev.template_data!,
                          default_timings: {
                            ...prev.template_data!.default_timings,
                            stall_threshold_days: parseInt(e.target.value) || 7
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Journey Stages</CardTitle>
                  <CardDescription>
                    Configure the stages students will go through in this journey
                  </CardDescription>
                </div>
                <Button onClick={addStage} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stage
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templateData.template_data?.stages?.map((stage, index) => {
                  const StageIcon = getStageIcon(stage.stage_type);
                  return (
                    <Card key={`stage-${index}`} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <StageIcon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">{index + 1}</Badge>
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Stage Name</Label>
                                <Input
                                  value={stage.name}
                                  onChange={(e) => updateStage(index, { name: e.target.value })}
                                  placeholder="Stage name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Stage Type</Label>
                                <Select
                                  value={stage.stage_type}
                                  onValueChange={(value: any) => updateStage(index, { stage_type: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {STAGE_TYPES.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Expected Duration (days)</Label>
                                <Input
                                  type="number"
                                  value={stage.timing_config?.expected_duration_days}
                                  onChange={(e) => updateStage(index, {
                                    timing_config: {
                                      ...stage.timing_config,
                                      expected_duration_days: parseInt(e.target.value) || 3
                                    }
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Stall Threshold (days)</Label>
                                <Input
                                  type="number"
                                  value={stage.timing_config?.stall_threshold_days}
                                  onChange={(e) => updateStage(index, {
                                    timing_config: {
                                      ...stage.timing_config,
                                      stall_threshold_days: parseInt(e.target.value) || 7
                                    }
                                  })}
                                />
                              </div>
                              <div className="flex items-center space-x-2 pt-6">
                                <Switch
                                  checked={true}
                                  onCheckedChange={() => {}}
                                />
                                <Label>Required</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStage(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}

                {(!templateData.template_data?.stages || templateData.template_data.stages.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No stages configured yet</p>
                    <p className="text-sm">Click "Add Stage" to start building your journey</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}