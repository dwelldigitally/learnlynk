import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface JourneyStageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: any | null;
  onSave: (stage: any) => void;
}

export function JourneyStageEditor({ open, onOpenChange, stage, onSave }: JourneyStageEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stage_type: 'custom',
    is_required: true,
    timing_config: {
      expected_duration_days: 3,
      stall_threshold_days: 7,
    },
  });

  useEffect(() => {
    if (stage) {
      setFormData({
        name: stage.name || '',
        description: stage.description || '',
        stage_type: stage.stage_type || 'custom',
        is_required: stage.is_required !== false,
        timing_config: {
          expected_duration_days: stage.timing_config?.expected_duration_days || 3,
          stall_threshold_days: stage.timing_config?.stall_threshold_days || 7,
        },
      });
    } else {
      setFormData({
        name: '',
        description: '',
        stage_type: 'custom',
        is_required: true,
        timing_config: {
          expected_duration_days: 3,
          stall_threshold_days: 7,
        },
      });
    }
  }, [stage]);

  const handleSave = () => {
    onSave({
      ...stage,
      ...formData,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{stage ? 'Edit Stage' : 'Add New Stage'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Stage Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Document Submission"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what happens in this stage..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage_type">Stage Type</Label>
            <Select
              value={formData.stage_type}
              onValueChange={(value) => setFormData({ ...formData, stage_type: value })}
            >
              <SelectTrigger id="stage_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="document_submission">Document Submission</SelectItem>
                <SelectItem value="application_review">Application Review</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
                <SelectItem value="enrollment">Enrollment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expected_duration">Expected Duration (days)</Label>
              <Input
                id="expected_duration"
                type="number"
                min="1"
                value={formData.timing_config.expected_duration_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timing_config: {
                      ...formData.timing_config,
                      expected_duration_days: parseInt(e.target.value) || 3,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stall_threshold">Stall Threshold (days)</Label>
              <Input
                id="stall_threshold"
                type="number"
                min="1"
                value={formData.timing_config.stall_threshold_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timing_config: {
                      ...formData.timing_config,
                      stall_threshold_days: parseInt(e.target.value) || 7,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_required">Required Stage</Label>
              <p className="text-sm text-muted-foreground">
                Students must complete this stage to progress
              </p>
            </div>
            <Switch
              id="is_required"
              checked={formData.is_required}
              onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim()}>
            {stage ? 'Save Changes' : 'Add Stage'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
