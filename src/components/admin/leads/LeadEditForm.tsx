import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Save, User, MapPin, GraduationCap, Tag, FileText, Loader2, AlertCircle, List, TrendingUp } from 'lucide-react';
import { Lead, LeadStatus, LeadPriority, LeadSource } from '@/types/lead';
import { LeadAllPropertiesModal } from './LeadAllPropertiesModal';
import { LeadService } from '@/services/leadService';
import { leadActivityService } from '@/services/leadActivityService';
import { useToast } from '@/hooks/use-toast';
import { usePrograms } from '@/hooks/usePrograms';
import { useIntakesByProgramName } from '@/hooks/useIntakes';
import { useAcademicTerms } from '@/hooks/useAcademicTerms';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProgramChangeConfirmDialog } from './ProgramChangeConfirmDialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface LifecycleStage {
  id: string;
  property_key: string;
  property_label: string;
  color?: string;
  order_index: number;
}

interface LeadEditFormProps {
  lead: Lead;
  onSave: (updatedLead: Lead) => void;
  onCancel: () => void;
}

export function LeadEditForm({ lead, onSave, onCancel }: LeadEditFormProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>(lead.program_interest?.[0] || '');
  const [selectedIntakeId, setSelectedIntakeId] = useState<string>((lead as any).preferred_intake_id || '');
  const [selectedTermId, setSelectedTermId] = useState<string>((lead as any).academic_term_id || '');
  const [selectedLifecycleStage, setSelectedLifecycleStage] = useState<string>((lead as any).lifecycle_stage || '');
  
  // Fetch lifecycle stages from system_properties
  const { data: lifecycleStages = [], isLoading: stagesLoading } = useQuery({
    queryKey: ['lifecycle-stages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_properties')
        .select('id, property_key, property_label, color, order_index')
        .eq('category', 'lifecycle_stage')
        .eq('is_active', true)
        .order('order_index');
      if (error) throw error;
      return (data || []) as LifecycleStage[];
    }
  });
  
  // Program change confirmation
  const [pendingProgram, setPendingProgram] = useState<string | null>(null);
  const [showProgramConfirm, setShowProgramConfirm] = useState(false);
  
  // Fetch programs, intakes, and academic terms from database
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const { data: availableIntakes = [], isLoading: intakesLoading } = useIntakesByProgramName(selectedProgram);
  const { data: academicTerms = [], isLoading: termsLoading } = useAcademicTerms();
  
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

  // Reset intake when program changes
  useEffect(() => {
    if (selectedProgram !== lead.program_interest?.[0]) {
      setSelectedIntakeId('');
    }
  }, [selectedProgram, lead.program_interest]);

  // Handle program selection with confirmation
  const handleProgramChange = (program: string) => {
    const currentProgram = lead.program_interest?.[0] || '';
    if (currentProgram && currentProgram !== program) {
      // Show confirmation dialog
      setPendingProgram(program);
      setShowProgramConfirm(true);
    } else {
      // No existing program or same program, just set it
      setSelectedProgram(program);
      setSelectedIntakeId('');
      handleInputChange('program_interest', program);
    }
  };

  const confirmProgramChange = () => {
    if (pendingProgram) {
      setSelectedProgram(pendingProgram);
      setSelectedIntakeId('');
      handleInputChange('program_interest', pendingProgram);
      setPendingProgram(null);
    }
    setShowProgramConfirm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: any = {
        ...formData,
        program_interest: selectedProgram ? [selectedProgram] : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        updated_at: new Date().toISOString(),
        preferred_intake_id: selectedIntakeId || null,
        academic_term_id: selectedTermId || null,
        lifecycle_stage: selectedLifecycleStage || null
      };

      // Calculate changed fields for activity logging
      const changedFields: Record<string, { old: any; new: any }> = {};
      
      // Check personal info changes
      if (formData.first_name !== lead.first_name) changedFields.first_name = { old: lead.first_name, new: formData.first_name };
      if (formData.last_name !== lead.last_name) changedFields.last_name = { old: lead.last_name, new: formData.last_name };
      if (formData.email !== lead.email) changedFields.email = { old: lead.email, new: formData.email };
      if (formData.phone !== (lead.phone || '')) changedFields.phone = { old: lead.phone || '', new: formData.phone };
      
      // Check location changes
      if (formData.city !== (lead.city || '')) changedFields.city = { old: lead.city || '', new: formData.city };
      if (formData.state !== (lead.state || '')) changedFields.state = { old: lead.state || '', new: formData.state };
      if (formData.country !== (lead.country || '')) changedFields.country = { old: lead.country || '', new: formData.country };
      
      // Check lead details changes
      if (formData.status !== lead.status) changedFields.status = { old: lead.status, new: formData.status };
      if (formData.priority !== lead.priority) changedFields.priority = { old: lead.priority, new: formData.priority };
      if (formData.source !== lead.source) changedFields.source = { old: lead.source, new: formData.source };
      
      // Check program interest
      const oldProgram = lead.program_interest?.[0] || '';
      if (selectedProgram !== oldProgram) changedFields.program_interest = { old: oldProgram, new: selectedProgram };
      
      // Check intake changes
      const oldIntakeId = (lead as any).preferred_intake_id || '';
      if (selectedIntakeId !== oldIntakeId) changedFields.preferred_intake_id = { old: oldIntakeId, new: selectedIntakeId };
      
      // Check academic term
      const oldTermId = (lead as any).academic_term_id || '';
      if (selectedTermId !== oldTermId) changedFields.academic_term_id = { old: oldTermId, new: selectedTermId };
      
      // Check lifecycle stage
      const oldLifecycleStage = (lead as any).lifecycle_stage || '';
      if (selectedLifecycleStage !== oldLifecycleStage) changedFields.lifecycle_stage = { old: oldLifecycleStage, new: selectedLifecycleStage };
      
      // Check notes
      if (formData.notes !== (lead.notes || '')) changedFields.notes = { old: lead.notes || '', new: formData.notes };

      const { data, error } = await LeadService.updateLead(lead.id, updateData);
      
      if (error) {
        throw new Error(error.message || 'Failed to update lead');
      }

      if (data) {
        // Log lead update activity if there were any changes
        if (Object.keys(changedFields).length > 0) {
          const fieldNames = Object.keys(changedFields);
          const oldValues: Record<string, any> = {};
          const newValues: Record<string, any> = {};
          
          fieldNames.forEach(field => {
            oldValues[field] = changedFields[field].old;
            newValues[field] = changedFields[field].new;
          });
          
          await leadActivityService.logLeadUpdate(lead.id, fieldNames, oldValues, newValues);
        }
        
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
    <>
    <LeadAllPropertiesModal 
      open={showAllProperties} 
      onOpenChange={setShowAllProperties} 
      lead={lead} 
    />
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Edit Lead Information</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={() => setShowAllProperties(true)}>
            <List className="h-4 w-4 mr-2" />
            View All Properties
          </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="lifecycle_stage" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Lifecycle Stage
              </Label>
              <Select 
                value={selectedLifecycleStage} 
                onValueChange={setSelectedLifecycleStage}
                disabled={stagesLoading}
              >
                <SelectTrigger>
                  {stagesLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select lifecycle stage" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {lifecycleStages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.property_key}>
                      <div className="flex items-center gap-2">
                        {stage.color && (
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: stage.color }}
                          />
                        )}
                        {stage.property_label}
                      </div>
                    </SelectItem>
                  ))}
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

          {programs.length === 0 && !programsLoading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No programs configured yet. <a href="/admin/programs" className="underline">Add programs</a> to enable program selection.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Program of Interest</Label>
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
            <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="academic_term">Academic Term</Label>
            <Select value={selectedTermId} onValueChange={setSelectedTermId} disabled={termsLoading}>
              <SelectTrigger>
                {termsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading terms...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select academic term (optional)" />
                )}
              </SelectTrigger>
              <SelectContent>
                {academicTerms.map((term) => (
                  <SelectItem key={term.id} value={term.id}>
                    {term.name} ({term.academic_year})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* Program Change Confirmation Dialog */}
      <ProgramChangeConfirmDialog
        open={showProgramConfirm}
        onOpenChange={setShowProgramConfirm}
        oldProgram={lead.program_interest?.[0] || ''}
        newProgram={pendingProgram || ''}
        onConfirm={confirmProgramChange}
      />
    </form>
    </>
  );
}