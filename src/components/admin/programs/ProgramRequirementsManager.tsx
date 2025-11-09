import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useProgramRequirements } from '@/hooks/useProgramRequirements';
import { programRequirementsService } from '@/services/programRequirementsService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MasterRequirement } from '@/types/requirement';

interface ProgramRequirementsManagerProps {
  programId: string;
  programName: string;
}

export const ProgramRequirementsManager: React.FC<ProgramRequirementsManagerProps> = ({
  programId,
  programName
}) => {
  const { requirements, loading, refetch } = useProgramRequirements(programId);
  const [availableRequirements, setAvailableRequirements] = useState<MasterRequirement[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<string>('');
  const [overrides, setOverrides] = useState({
    minimum_value_override: '',
    maximum_value_override: '',
    is_mandatory: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAvailableRequirements();
  }, []);

  const loadAvailableRequirements = async () => {
    const { data, error } = await supabase
      .from('master_requirements')
      .select('*')
      .eq('is_active', true)
      .order('title');

    if (error) {
      console.error('Error loading requirements:', error);
      return;
    }

    setAvailableRequirements(data as any);
  };

  const handleAddRequirement = async () => {
    if (!selectedRequirement) return;

    try {
      await programRequirementsService.assignRequirementToProgram(
        programId,
        selectedRequirement,
        overrides.minimum_value_override || overrides.maximum_value_override
          ? overrides
          : undefined
      );

      toast({
        title: 'Requirement Added',
        description: 'Requirement has been added to the program'
      });

      setShowAddDialog(false);
      setSelectedRequirement('');
      setOverrides({
        minimum_value_override: '',
        maximum_value_override: '',
        is_mandatory: true
      });
      refetch();
    } catch (error) {
      console.error('Error adding requirement:', error);
      toast({
        title: 'Error',
        description: 'Failed to add requirement',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveRequirement = async (requirementId: string) => {
    try {
      await programRequirementsService.removeRequirementFromProgram(programId, requirementId);
      toast({
        title: 'Requirement Removed',
        description: 'Requirement has been removed from the program'
      });
      refetch();
    } catch (error) {
      console.error('Error removing requirement:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove requirement',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Requirements for {programName}</CardTitle>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading requirements...</p>
        ) : requirements.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requirements assigned to this program</p>
        ) : (
          <div className="space-y-3">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{req.requirement?.name}</p>
                    {req.is_mandatory && (
                      <Badge variant="outline" className="text-xs">Mandatory</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {req.requirement?.description}
                  </p>
                  {(req.minimum_value_override || req.maximum_value_override) && (
                    <div className="text-xs bg-muted/50 p-2 rounded">
                      <span className="font-medium">Program Override: </span>
                      {req.minimum_value_override && `Min: ${req.minimum_value_override}`}
                      {req.minimum_value_override && req.maximum_value_override && ' • '}
                      {req.maximum_value_override && `Max: ${req.maximum_value_override}`}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRequirement(req.requirement_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Requirement to Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Requirement</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedRequirement}
                  onChange={(e) => setSelectedRequirement(e.target.value)}
                >
                  <option value="">Choose a requirement...</option>
                  {availableRequirements.map((req) => (
                    <option key={req.id} value={req.id}>
                      {req.name} {req.minimum_value && `(Min: ${req.minimum_value})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Minimum Value Override (optional)</Label>
                <Input
                  value={overrides.minimum_value_override}
                  onChange={(e) => setOverrides({ ...overrides, minimum_value_override: e.target.value })}
                  placeholder="Leave empty to use default"
                />
              </div>

              <div className="space-y-2">
                <Label>Maximum Value Override (optional)</Label>
                <Input
                  value={overrides.maximum_value_override}
                  onChange={(e) => setOverrides({ ...overrides, maximum_value_override: e.target.value })}
                  placeholder="Leave empty to use default"
                />
              </div>

              <Button onClick={handleAddRequirement} className="w-full" disabled={!selectedRequirement}>
                Add Requirement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
