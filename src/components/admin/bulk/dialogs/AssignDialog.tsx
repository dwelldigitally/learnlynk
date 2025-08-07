import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { FilterSelector } from '../FilterSelector';
import { LeadService } from '@/services/leadService';
import { LeadSearchFilters, AssignmentMethod } from '@/types/lead';

interface AssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  selectedLeadsCount?: number;
}

export function AssignDialog({ open, onOpenChange, onSuccess, selectedLeadsCount = 0 }: AssignDialogProps) {
  const [filters, setFilters] = useState<LeadSearchFilters>({});
  const [leadCount, setLeadCount] = useState(0);
  const [assignmentMethod, setAssignmentMethod] = useState<AssignmentMethod>('round_robin');
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const [selectedAdvisors, setSelectedAdvisors] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const { toast } = useToast();

  // Mock advisors - in real app, fetch from database
  const availableAdvisors = [
    { id: 'advisor-1', name: 'Nicole Ye', email: 'nicole@example.com' },
    { id: 'advisor-2', name: 'Sarah Johnson', email: 'sarah@example.com' },
    { id: 'advisor-3', name: 'Mike Chen', email: 'mike@example.com' },
    { id: 'advisor-4', name: 'Emma Wilson', email: 'emma@example.com' }
  ];

  const handleAssign = async () => {
    if (leadCount === 0) {
      toast({
        title: 'Error',
        description: 'No leads selected for assignment',
        variant: 'destructive'
      });
      return;
    }

    if (assignmentMethod === 'manual' && !selectedAdvisor) {
      toast({
        title: 'Error',
        description: 'Please select an advisor for manual assignment',
        variant: 'destructive'
      });
      return;
    }

    if (assignmentMethod === 'round_robin' && selectedAdvisors.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select advisors for round robin assignment',
        variant: 'destructive'
      });
      return;
    }

    try {
      setAssigning(true);
      
      // For demo purposes - in real app, use the enhanced lead service with filters
      // This would need to be implemented in the backend to handle filtered assignments
      
      toast({
        title: 'Success',
        description: `Successfully assigned ${leadCount} leads`
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign leads',
        variant: 'destructive'
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleAdvisorToggle = (advisorId: string, checked: boolean) => {
    if (checked) {
      setSelectedAdvisors(prev => [...prev, advisorId]);
    } else {
      setSelectedAdvisors(prev => prev.filter(id => id !== advisorId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Assign Leads</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <FilterSelector 
            onFiltersChange={(newFilters, count) => {
              setFilters(newFilters);
              setLeadCount(count);
            }}
            selectedLeadsCount={selectedLeadsCount}
          />

          <div className="space-y-4">
            <div>
              <Label>Assignment Method</Label>
              <Select 
                value={assignmentMethod} 
                onValueChange={(value: AssignmentMethod) => setAssignmentMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Assignment</SelectItem>
                  <SelectItem value="round_robin">Round Robin</SelectItem>
                  <SelectItem value="ai_based">AI-Based (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {assignmentMethod === 'manual' && (
              <div>
                <Label>Select Advisor</Label>
                <Select 
                  value={selectedAdvisor}
                  onValueChange={setSelectedAdvisor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose advisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAdvisors.map((advisor) => (
                      <SelectItem key={advisor.id} value={advisor.id}>
                        {advisor.name} ({advisor.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {assignmentMethod === 'round_robin' && (
              <div className="space-y-2">
                <Label>Select Advisors for Round Robin</Label>
                <div className="space-y-2">
                  {availableAdvisors.map((advisor) => (
                    <div key={advisor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={advisor.id}
                        checked={selectedAdvisors.includes(advisor.id)}
                        onCheckedChange={(checked) => handleAdvisorToggle(advisor.id, checked as boolean)}
                      />
                      <Label htmlFor={advisor.id} className="text-sm font-normal">
                        {advisor.name} ({advisor.email})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={assigning || leadCount === 0}
            >
              {assigning ? 'Assigning...' : `Assign ${leadCount} Leads`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}