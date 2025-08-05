import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Globe, Edit, Save, X, ExternalLink } from 'lucide-react';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';

interface BasicLeadInfoProps {
  lead: Lead;
  onUpdate: () => void;
}

export function BasicLeadInfo({ lead, onUpdate }: BasicLeadInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone || '',
    country: lead.country || '',
    state: lead.state || '',
    city: lead.city || '',
    status: lead.status,
    priority: lead.priority,
    notes: lead.notes || ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setSaving(true);
      await LeadService.updateLead(lead.id, editData);
      setIsEditing(false);
      onUpdate();
      toast({
        title: 'Success',
        description: 'Lead information updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update lead information',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone || '',
      country: lead.country || '',
      state: lead.state || '',
      city: lead.city || '',
      status: lead.status,
      priority: lead.priority,
      notes: lead.notes || ''
    });
    setIsEditing(false);
  };

  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'qualified': return 'outline';
      case 'nurturing': return 'default';
      case 'converted': return 'default';
      case 'lost': return 'destructive';
      case 'unqualified': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: LeadPriority) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const formatLocation = () => {
    const parts = [lead.city, lead.state, lead.country].filter(Boolean);
    return parts.join(', ') || 'Not specified';
  };

  const getTimezone = () => {
    // Simplified timezone detection based on country
    const timezones: Record<string, string> = {
      'United States': 'EST/PST',
      'Canada': 'EST/PST',
      'United Kingdom': 'GMT',
      'Australia': 'AEST',
      'India': 'IST',
      'China': 'CST',
      'Japan': 'JST',
      'Germany': 'CET',
      'France': 'CET'
    };
    return timezones[lead.country || ''] || 'Unknown';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Basic Information
        </CardTitle>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Contact Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              {isEditing ? (
                <Input
                  value={editData.first_name}
                  onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span>{lead.first_name}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              {isEditing ? (
                <Input
                  value={editData.last_name}
                  onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                />
              ) : (
                <span>{lead.last_name}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            {isEditing ? (
              <Input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            {isEditing ? (
              <Input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                placeholder="Phone number"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.phone || 'Not provided'}</span>
                {lead.phone && (
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Geographic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Location & Timezone</h4>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input
                  value={editData.country}
                  onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State/Province</label>
                <Input
                  value={editData.state}
                  onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                  placeholder="State/Province"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  value={editData.city}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{formatLocation()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>Timezone: {getTimezone()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Lead Source Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Source Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Source</label>
              <p className="text-sm">{lead.source.replace('_', ' ').toUpperCase()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Source Details</label>
              <p className="text-sm">{lead.source_details || 'Not specified'}</p>
            </div>
            {lead.utm_source && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Campaign Tracking</label>
                <div className="text-xs space-y-1">
                  <p>Source: {lead.utm_source}</p>
                  {lead.utm_medium && <p>Medium: {lead.utm_medium}</p>}
                  {lead.utm_campaign && <p>Campaign: {lead.utm_campaign}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status & Priority */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Lead Management</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              {isEditing ? (
                <Select value={editData.status} onValueChange={(value: LeadStatus) => setEditData({ ...editData, status: value })}>
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
              ) : (
                <Badge variant={getStatusBadgeVariant(lead.status)}>
                  {lead.status.toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              {isEditing ? (
                <Select value={editData.priority} onValueChange={(value: LeadPriority) => setEditData({ ...editData, priority: value })}>
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
              ) : (
                <Badge variant={getPriorityBadgeVariant(lead.priority)}>
                  {lead.priority.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Lead Score */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Lead Score</h4>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-primary">{lead.lead_score}</div>
            <div className="text-sm text-muted-foreground">/100</div>
            {lead.ai_score && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">AI Score:</span>
                <span className="font-medium">{lead.ai_score.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          {isEditing ? (
            <Textarea
              value={editData.notes}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              placeholder="Add notes about this lead..."
              rows={3}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {lead.notes || 'No notes available'}
            </p>
          )}
        </div>

        {/* Timestamps */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Timeline</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p>{new Date(lead.created_at).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <p>{new Date(lead.updated_at).toLocaleString()}</p>
            </div>
            {lead.last_contacted_at && (
              <div>
                <span className="text-muted-foreground">Last Contacted:</span>
                <p>{new Date(lead.last_contacted_at).toLocaleString()}</p>
              </div>
            )}
            {lead.next_follow_up_at && (
              <div>
                <span className="text-muted-foreground">Next Follow-up:</span>
                <p>{new Date(lead.next_follow_up_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}