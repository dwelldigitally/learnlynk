import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Save, User, MapPin, GraduationCap, Tag, FileText } from 'lucide-react';
import { Lead, LeadStatus, LeadPriority, LeadSource } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { useToast } from '@/hooks/use-toast';
import { STANDARDIZED_PROGRAMS } from '@/constants/programs';
import { IntakeService } from '@/services/intakeService';

interface LeadEditFormProps {
  lead: Lead;
  onSave: (updatedLead: Lead) => void;
  onCancel: () => void;
}

export function LeadEditForm({ lead, onSave, onCancel }: LeadEditFormProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>(lead.program_interest?.[0] || '');
  const [selectedIntakeDate, setSelectedIntakeDate] = useState<string>('');
  const [availableIntakeDates, setAvailableIntakeDates] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone || '',
    country: lead.country || '',
    state: lead.state || '',
    city: lead.city || '',
    status: lead.status,
    priority: lead.priority,
    source: lead.source,
    source_details: lead.source_details || '',
    program_interest: lead.program_interest?.join(', ') || '',
    tags: lead.tags?.join(', ') || '',
    notes: lead.notes || '',
    utm_source: lead.utm_source || '',
    utm_medium: lead.utm_medium || '',
    utm_campaign: lead.utm_campaign || '',
    utm_content: lead.utm_content || '',
    utm_term: lead.utm_term || ''
  });

  // Load intake dates when component mounts or program changes
  useEffect(() => {
    const loadIntakeDates = async () => {
      if (selectedProgram) {
        try {
          console.log('🔥 Loading intake dates for program:', selectedProgram);
          const allIntakes = await IntakeService.getAllIntakes();
          console.log('📊 All intakes fetched:', allIntakes);
          
          const currentDate = new Date();
          const programIntakes = allIntakes.filter((intake: any) => {
            const intakeDate = new Date(intake.start_date);
            const isFuture = intakeDate > currentDate;
            const programMatch = intake.program_name === selectedProgram;
            const statusOpen = intake.status === 'open';
            
            console.log('🔍 Checking intake:', {
              name: intake.name,
              program_name: intake.program_name,
              selected_program: selectedProgram,
              start_date: intake.start_date,
              is_future: isFuture,
              status: intake.status,
              program_match: programMatch,
              status_open: statusOpen,
              passes_filter: programMatch && isFuture && statusOpen
            });
            
            return programMatch && isFuture && statusOpen;
          });
          
          console.log('🎯 Filtered program intakes for', selectedProgram, ':', programIntakes);
          setAvailableIntakeDates(programIntakes);
        } catch (error) {
          console.error('💥 Error loading intake dates:', error);
          setAvailableIntakeDates([]);
        }
      } else {
        setAvailableIntakeDates([]);
      }
    };
    
    loadIntakeDates();
  }, [selectedProgram]);

  // Handle program selection and load intake dates
  const handleProgramChange = async (program: string) => {
    console.log('🔥 handleProgramChange called with program:', program);
    setSelectedProgram(program);
    setSelectedIntakeDate(''); // Reset intake date when program changes
    handleInputChange('program_interest', program);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Include intake date in notes if selected
      const notesWithIntake = selectedIntakeDate 
        ? `${formData.notes ? formData.notes + '\n\n' : ''}Interested in intake: ${availableIntakeDates.find(d => d.id === selectedIntakeDate)?.label || selectedIntakeDate}`
        : formData.notes;

      const updateData = {
        ...formData,
        program_interest: selectedProgram ? [selectedProgram] : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        notes: notesWithIntake,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await LeadService.updateLead(lead.id, updateData);
      
      if (error) {
        throw new Error(error.message || 'Failed to update lead');
      }

      if (data) {
        onSave(data);
        toast({
          title: 'Success',
          description: 'Lead updated successfully',
          variant: 'default'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update lead',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Edit Lead Information</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Lead Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: LeadStatus) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="nurturing">Nurturing</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="unqualified">Unqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value: LeadPriority) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Select value={formData.source} onValueChange={(value: LeadSource) => handleInputChange('source', value)}>
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
                  <SelectItem value="chatbot">Chatbot</SelectItem>
                  <SelectItem value="ads">Ads</SelectItem>
                  <SelectItem value="forms">Forms</SelectItem>
                  <SelectItem value="webform">Webform</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source_details">Source Details</Label>
            <Input
              id="source_details"
              value={formData.source_details}
              onChange={(e) => handleInputChange('source_details', e.target.value)}
              placeholder="Additional details about the lead source"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Program of Interest</Label>
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
            <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-muted-foreground">Separate multiple tags with commas</p>
          </div>
        </CardContent>
      </Card>

      {/* UTM Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            UTM Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utm_source">UTM Source</Label>
              <Input
                id="utm_source"
                value={formData.utm_source}
                onChange={(e) => handleInputChange('utm_source', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utm_medium">UTM Medium</Label>
              <Input
                id="utm_medium"
                value={formData.utm_medium}
                onChange={(e) => handleInputChange('utm_medium', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utm_campaign">UTM Campaign</Label>
              <Input
                id="utm_campaign"
                value={formData.utm_campaign}
                onChange={(e) => handleInputChange('utm_campaign', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utm_content">UTM Content</Label>
              <Input
                id="utm_content"
                value={formData.utm_content}
                onChange={(e) => handleInputChange('utm_content', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="utm_term">UTM Term</Label>
            <Input
              id="utm_term"
              value={formData.utm_term}
              onChange={(e) => handleInputChange('utm_term', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              placeholder="Enter any additional notes about this lead..."
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}