import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { LeadFormData, LeadSource } from '@/types/lead';
import { supabase } from '@/integrations/supabase/client';
import { usePrograms } from '@/hooks/usePrograms';
import { useIntakesByProgramName } from '@/hooks/useIntakes';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadCreated: () => void;
}

export function LeadFormModal({ open, onOpenChange, onLeadCreated }: LeadFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedIntakeId, setSelectedIntakeId] = useState<string>('');
  
  // Fetch programs and intakes from database
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const { data: availableIntakes = [], isLoading: intakesLoading } = useIntakesByProgramName(selectedProgram);
  
  const [formData, setFormData] = useState<LeadFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    source: 'web',
    source_details: '',
    program_interest: [],
    notes: ''
  });
  const { toast } = useToast();

  // Reset intake when program changes
  useEffect(() => {
    setSelectedIntakeId('');
  }, [selectedProgram]);

  // Handle program selection
  const handleProgramChange = (program: string) => {
    setSelectedProgram(program);
    setSelectedIntakeId(''); // Reset intake date when program changes
    updateFormData('program_interest', [program]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedProgram) {
      toast({
        title: 'Error',
        description: 'Please select a program of interest',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Add user_id and intake data to form data
      const leadDataWithUser: any = {
        ...formData,
        user_id: user.id,
        preferred_intake_id: selectedIntakeId || null
      };

      const result = await LeadService.createLead(leadDataWithUser);
      console.log('Lead creation result:', result);
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to create lead');
      }
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        city: '',
        source: 'web',
        source_details: '',
        program_interest: [],
        notes: ''
      });
      setSelectedProgram('');
      setSelectedIntakeId('');
      
      console.log('Calling onLeadCreated');
      onLeadCreated();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create lead',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof LeadFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => updateFormData('first_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => updateFormData('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => updateFormData('state', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Lead Source *</Label>
              <Select value={formData.source} onValueChange={(value) => updateFormData('source', value as LeadSource)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="walk_in">Walk In</SelectItem>
                  <SelectItem value="api_import">API Import</SelectItem>
                  <SelectItem value="csv_import">CSV Import</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="source_details">Source Details</Label>
              <Input
                id="source_details"
                value={formData.source_details}
                onChange={(e) => updateFormData('source_details', e.target.value)}
                placeholder="e.g., Facebook Ad Campaign"
              />
            </div>
          </div>

          {programs.length === 0 && !programsLoading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No programs configured yet. <a href="/admin/programs" className="underline">Add programs</a> to enable program selection.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="program">Program of Interest *</Label>
              <Select value={selectedProgram} onValueChange={handleProgramChange} disabled={programsLoading}>
                <SelectTrigger>
                  {programsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading programs...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select a program" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.name}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="intake_date">Preferred Intake Date</Label>
              <Select 
                value={selectedIntakeId} 
                onValueChange={setSelectedIntakeId}
                disabled={!selectedProgram || intakesLoading || availableIntakes.length === 0}
              >
                <SelectTrigger>
                  {intakesLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading intakes...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder={selectedProgram ? "Select intake date" : "Select program first"} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {availableIntakes.map((intake) => (
                    <SelectItem key={intake.id} value={intake.id}>
                      {intake.name} - {new Date(intake.start_date).toLocaleDateString()} {intake.capacity && `(${intake.capacity} spots)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProgram && !intakesLoading && availableIntakes.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">No upcoming intake dates available for this program</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Additional notes about this lead..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}