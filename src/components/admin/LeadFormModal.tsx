import { useState } from 'react';
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
import { STANDARDIZED_PROGRAMS } from '@/constants/programs';
import { IntakeService } from '@/services/intakeService';

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadCreated: () => void;
}

export function LeadFormModal({ open, onOpenChange, onLeadCreated }: LeadFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedIntakeDate, setSelectedIntakeDate] = useState<string>('');
  const [availableIntakeDates, setAvailableIntakeDates] = useState<any[]>([]);
  
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

  // Handle program selection and load intake dates from database
  const handleProgramChange = async (program: string) => {
    setSelectedProgram(program);
    setSelectedIntakeDate(''); // Reset intake date when program changes
    
    try {
      // Get all intakes and filter by program
      const allIntakes = await IntakeService.getAllIntakes();
      console.log('All intakes fetched:', allIntakes);
      
      const programIntakes = allIntakes.filter((intake: any) => {
        console.log('Checking intake:', intake.name, 'Program:', intake.program_name, 'Selected:', program);
        console.log('Date check:', intake.start_date, 'Is future:', new Date(intake.start_date) > new Date());
        console.log('Status:', intake.status);
        
        return intake.program_name === program && 
               new Date(intake.start_date) > new Date() && 
               intake.status === 'open';
      });
      
      console.log('Filtered program intakes:', programIntakes);
      setAvailableIntakeDates(programIntakes);
    } catch (error) {
      console.error('Error fetching intake dates:', error);
      setAvailableIntakeDates([]);
    }
    
    // Update form data with selected program
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
      
      // Add user_id to form data
      const leadDataWithUser = {
        ...formData,
        user_id: user.id
      };
      
      // Include intake date in notes if selected
      const selectedIntake = availableIntakeDates.find(d => d.id === selectedIntakeDate);
      const notesWithIntake = selectedIntake
        ? `${formData.notes ? formData.notes + '\n\n' : ''}Interested in intake: ${selectedIntake.name} (${new Date(selectedIntake.start_date).toLocaleDateString()})`
        : formData.notes;

      const result = await LeadService.createLead({
        ...leadDataWithUser,
        notes: notesWithIntake
      });
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
      setSelectedIntakeDate('');
      setAvailableIntakeDates([]);
      
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="program">Program of Interest *</Label>
              <Select value={selectedProgram} onValueChange={handleProgramChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {STANDARDIZED_PROGRAMS.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="intake_date">Preferred Intake Date</Label>
              <Select 
                value={selectedIntakeDate} 
                onValueChange={setSelectedIntakeDate}
                disabled={!selectedProgram || availableIntakeDates.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedProgram ? "Select intake date" : "Select program first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableIntakeDates.map((intake) => (
                    <SelectItem key={intake.id} value={intake.id}>
                      {intake.name} - {new Date(intake.start_date).toLocaleDateString()} ({intake.capacity} spots total)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProgram && availableIntakeDates.length === 0 && (
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