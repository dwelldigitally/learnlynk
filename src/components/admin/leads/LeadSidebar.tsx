import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  User, Mail, Phone, MapPin, Edit, Save, X, 
  Calendar, MessageSquare, Users, Target,
  Building, Clock, Star, Tag
} from 'lucide-react';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';

interface LeadSidebarProps {
  lead: Lead;
  onUpdate: () => void;
}

export function LeadSidebar({ lead, onUpdate }: LeadSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone || '',
    status: lead.status,
    priority: lead.priority,
    lead_score: lead.lead_score,
    country: lead.country || '',
    state: lead.state || '',
    city: lead.city || ''
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
        description: 'Lead updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update lead',
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
      status: lead.status,
      priority: lead.priority,
      lead_score: lead.lead_score,
      country: lead.country || '',
      state: lead.state || '',
      city: lead.city || ''
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'converted': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'lost': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: LeadPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Contact Card */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Contact</h2>
          {!isEditing ? (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {lead.first_name[0]}{lead.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editData.first_name}
                  onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                  placeholder="First name"
                />
                <Input
                  value={editData.last_name}
                  onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-foreground truncate">
                  {lead.first_name} {lead.last_name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button variant="outline" size="sm" className="h-9">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="h-4 w-4 mr-2" />
            Meet
          </Button>
        </div>

        {/* Contact Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {isEditing ? (
              <Input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="h-8"
              />
            ) : (
              <span className="truncate">{lead.email}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {isEditing ? (
              <Input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                placeholder="Phone number"
                className="h-8"
              />
            ) : (
              <span>{lead.phone || 'No phone'}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {isEditing ? (
              <div className="flex-1 space-y-1">
                <Input
                  value={editData.city}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  placeholder="City"
                  className="h-8"
                />
                <Input
                  value={editData.state}
                  onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                  placeholder="State"
                  className="h-8"
                />
              </div>
            ) : (
              <span className="truncate">
                {[lead.city, lead.state, lead.country].filter(Boolean).join(', ') || 'No location'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lead Properties */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-semibold mb-4">Lead Properties</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Status</Label>
            {isEditing ? (
              <Select value={editData.status} onValueChange={(value: LeadStatus) => setEditData({ ...editData, status: value })}>
                <SelectTrigger className="h-8 mt-1">
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
              <div className="mt-1">
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Priority</Label>
            {isEditing ? (
              <Select value={editData.priority} onValueChange={(value: LeadPriority) => setEditData({ ...editData, priority: value })}>
                <SelectTrigger className="h-8 mt-1">
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
              <div className="mt-1">
                <Badge className={getPriorityColor(lead.priority)}>
                  {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                </Badge>
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Lead Score</Label>
            <div className="mt-1 flex items-center gap-2">
              <div className="text-2xl font-bold text-primary">{lead.lead_score}</div>
              <div className="text-sm text-muted-foreground">/100</div>
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Source</Label>
            <p className="mt-1 text-sm">
              {lead.source.replace('_', ' ').charAt(0).toUpperCase() + lead.source.replace('_', ' ').slice(1)}
            </p>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Created</Label>
            <p className="mt-1 text-sm">
              {new Date(lead.created_at).toLocaleDateString()}
            </p>
          </div>

          {lead.assigned_to && (
            <div>
              <Label className="text-xs text-muted-foreground">Assigned to</Label>
              <div className="mt-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Team Member</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Program Interest */}
      {lead.program_interest && lead.program_interest.length > 0 && (
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-semibold mb-3">Program Interest</h3>
          <div className="space-y-2">
            {lead.program_interest.map((program, index) => (
              <div key={index} className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{program}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="p-6">
          <h3 className="text-sm font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {lead.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}