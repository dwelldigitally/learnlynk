import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Eye, Plus } from 'lucide-react';
import { JourneyStagePreview } from './JourneyStagePreview';
import { JourneyStageEditor } from './JourneyStageEditor';
import { toast } from 'sonner';

interface JourneyTypeTabProps {
  studentType: 'domestic' | 'international';
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  masterTemplate?: any;
  stages: any[];
  onStagesChange: (stages: any[]) => void;
  onOpenBuilder?: () => void;
}

export function JourneyTypeTab({
  studentType,
  enabled,
  onToggleEnabled,
  masterTemplate,
  stages,
  onStagesChange,
  onOpenBuilder,
}: JourneyTypeTabProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<any | null>(null);

  const handleEditStage = (stage: any) => {
    setEditingStage(stage);
    setEditorOpen(true);
  };

  const handleAddStage = (insertAfterIndex: number) => {
    const newStage = {
      id: `stage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      description: '',
      stage_type: 'custom',
      is_required: true,
      timing_config: {
        expected_duration_days: 3,
        stall_threshold_days: 7,
      },
    };
    setEditingStage(newStage);
    setEditorOpen(true);
  };

  const handleSaveStage = (stage: any) => {
    const existingIndex = stages.findIndex((s) => s.id === stage.id);
    if (existingIndex >= 0) {
      const updatedStages = [...stages];
      updatedStages[existingIndex] = stage;
      onStagesChange(updatedStages);
      toast.success('Stage updated successfully');
    } else {
      onStagesChange([...stages, stage]);
      toast.success('Stage added successfully');
    }
  };

  const handleDuplicateStage = (stage: any) => {
    const duplicated = {
      ...stage,
      id: `stage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${stage.name} (Copy)`,
    };
    onStagesChange([...stages, duplicated]);
    toast.success('Stage duplicated successfully');
  };

  const handleDeleteStage = (stageId: string) => {
    onStagesChange(stages.filter((s) => s.id !== stageId));
    toast.success('Stage deleted successfully');
  };

  const handleMoveStageUp = (index: number) => {
    if (index === 0) return;
    const newStages = [...stages];
    [newStages[index - 1], newStages[index]] = [newStages[index], newStages[index - 1]];
    onStagesChange(newStages);
  };

  const handleMoveStageDown = (index: number) => {
    if (index === stages.length - 1) return;
    const newStages = [...stages];
    [newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]];
    onStagesChange(newStages);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base capitalize">{studentType} Journey</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor={`enable-${studentType}`} className="text-sm font-normal">
                Enable
              </Label>
              <Switch
                id={`enable-${studentType}`}
                checked={enabled}
                onCheckedChange={onToggleEnabled}
              />
            </div>
          </div>
        </CardHeader>
        {enabled && (
          <CardContent className="space-y-4">
            {masterTemplate && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Using Master Template</div>
                  <Badge variant="secondary">
                    {masterTemplate.template_data?.stages?.length || 0} stages
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stages are inherited from the institution's master {studentType} template
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h4 className="font-medium">Journey Stages</h4>
              <div className="flex items-center gap-2">
                {onOpenBuilder && (
                  <Button variant="outline" size="sm" onClick={onOpenBuilder} className="gap-2">
                    <Settings className="h-4 w-4" />
                    Open Full Builder
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddStage(stages.length - 1)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Stage
                </Button>
              </div>
            </div>

            <JourneyStagePreview
              stages={stages}
              onEditStage={handleEditStage}
              onDuplicateStage={handleDuplicateStage}
              onDeleteStage={handleDeleteStage}
              onAddStageBetween={handleAddStage}
              onMoveStageUp={handleMoveStageUp}
              onMoveStageDown={handleMoveStageDown}
            />
          </CardContent>
        )}
      </Card>

      <JourneyStageEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        stage={editingStage}
        onSave={handleSaveStage}
      />
    </div>
  );
}
