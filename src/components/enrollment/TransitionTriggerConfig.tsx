import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Trash2, Zap, FileCheck, DollarSign, 
  FileText, CheckCircle2, Clock, Bell
} from 'lucide-react';
import { 
  useStageTransitionTriggers, 
  useCreateTransitionTrigger, 
  useDeleteTransitionTrigger,
  useUpdateTransitionTrigger,
  TRIGGER_TYPE_OPTIONS
} from '@/hooks/useStageTransitions';
import { TriggerType } from '@/services/stageTransitionService';

interface TransitionTriggerConfigProps {
  stageId: string;
  stageName: string;
  journeyId: string;
}

const TRIGGER_ICONS: Record<TriggerType, React.ComponentType<any>> = {
  'all_documents_approved': FileCheck,
  'specific_document_approved': FileText,
  'payment_received': DollarSign,
  'form_submitted': FileText,
  'manual_approval': CheckCircle2,
  'time_elapsed': Clock,
  'all_requirements_completed': CheckCircle2
};

export function TransitionTriggerConfig({ stageId, stageName }: TransitionTriggerConfigProps) {
  const [showAddTrigger, setShowAddTrigger] = useState(false);
  const [selectedTriggerType, setSelectedTriggerType] = useState<TriggerType>('all_documents_approved');
  
  const { data: triggers = [], isLoading } = useStageTransitionTriggers(stageId);
  const createTrigger = useCreateTransitionTrigger();
  const deleteTrigger = useDeleteTransitionTrigger();
  const updateTrigger = useUpdateTransitionTrigger();

  const handleAddTrigger = async () => {
    await createTrigger.mutateAsync({
      stage_id: stageId,
      trigger_type: selectedTriggerType,
      notify_student: true,
      notify_admin: true
    });
    setShowAddTrigger(false);
    setSelectedTriggerType('all_documents_approved');
  };

  const handleToggleActive = async (triggerId: string, currentValue: boolean) => {
    await updateTrigger.mutateAsync({
      triggerId,
      updates: { is_active: !currentValue }
    });
  };

  const handleToggleNotifyAdmin = async (triggerId: string, currentValue: boolean) => {
    await updateTrigger.mutateAsync({
      triggerId,
      updates: { notify_admin: !currentValue }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <h4 className="font-medium text-sm">Auto-Transition Triggers</h4>
        </div>
        <Badge variant="secondary" className="text-xs">
          {triggers.length} active
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        Configure when leads automatically move to the next stage
      </p>

      {/* Existing Triggers */}
      <div className="space-y-2">
        {triggers.map((trigger) => {
          const TriggerIcon = TRIGGER_ICONS[trigger.trigger_type as TriggerType] || Zap;
          const triggerOption = TRIGGER_TYPE_OPTIONS.find(t => t.value === trigger.trigger_type);
          
          return (
            <Card key={trigger.id} className="border-dashed">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <TriggerIcon className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{triggerOption?.label || trigger.trigger_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {triggerOption?.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                          <Switch
                            id={`notify-${trigger.id}`}
                            checked={trigger.notify_admin}
                            onCheckedChange={() => handleToggleNotifyAdmin(trigger.id, trigger.notify_admin)}
                            className="scale-75"
                          />
                          <Label htmlFor={`notify-${trigger.id}`} className="text-xs text-muted-foreground">
                            <Bell className="h-3 w-3 inline mr-1" />
                            Notify admin
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={trigger.is_active}
                      onCheckedChange={() => handleToggleActive(trigger.id, trigger.is_active)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteTrigger.mutate(trigger.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Trigger Form */}
      {showAddTrigger ? (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-sm">Trigger Type</Label>
              <Select
                value={selectedTriggerType}
                onValueChange={(v) => setSelectedTriggerType(v as TriggerType)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddTrigger(false)}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleAddTrigger}
                disabled={createTrigger.isPending}
              >
                {createTrigger.isPending ? 'Adding...' : 'Add Trigger'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          onClick={() => setShowAddTrigger(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trigger
        </Button>
      )}

      {triggers.length === 0 && !showAddTrigger && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No auto-transition triggers configured.<br />
          Add triggers to automatically move leads to the next stage.
        </div>
      )}
    </div>
  );
}
