import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { Lead, LeadActivity, LeadStatus } from '@/types/lead';
import { Mail, Phone, MapPin, Calendar, User, MessageSquare } from 'lucide-react';

interface LeadDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onLeadUpdated: () => void;
}

export function LeadDetailModal({ open, onOpenChange, lead, onStatusChange, onLeadUpdated }: LeadDetailModalProps) {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && lead.id) {
      loadActivities();
    }
  }, [open, lead.id]);

  const loadActivities = async () => {
    try {
      const activities = await LeadService.getLeadActivities(lead.id);
      setActivities(activities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    try {
      setLoading(true);
      await onStatusChange(lead.id, newStatus);
      onLeadUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setAddingNote(true);
      await LeadService.createActivity(lead.id, {
        activity_type: 'note',
        activity_description: newNote,
        activity_data: {}
      });
      
      setNewNote('');
      await loadActivities();
      
      toast({
        title: 'Success',
        description: 'Note added successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive'
      });
    } finally {
      setAddingNote(false);
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{lead.first_name} {lead.last_name}</span>
            <Badge variant={getStatusBadgeVariant(lead.status)}>
              {lead.status.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {(lead.city || lead.state || lead.country) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {[lead.city, lead.state, lead.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lead Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lead Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Source:</span>
                    <span className="ml-2">{lead.source.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Priority:</span>
                    <Badge className="ml-2" variant="outline">
                      {lead.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Lead Score:</span>
                    <span className="ml-2 font-bold">{lead.lead_score}/100</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Created:</span>
                    <span className="ml-2">{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Select value={lead.status} onValueChange={handleStatusChange} disabled={loading}>
                    <SelectTrigger className="w-40">
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
                  <span className="text-sm text-muted-foreground">
                    {loading ? 'Updating...' : 'Select new status to update'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {lead.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Initial Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{lead.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No activities yet</p>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3 border-b pb-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {activity.activity_type === 'note' ? (
                              <MessageSquare className="h-4 w-4" />
                            ) : activity.activity_type === 'status_change' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Calendar className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                              {activity.activity_type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.performed_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.activity_description}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add a note about this lead..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote} disabled={addingNote || !newNote.trim()}>
                  {addingNote ? 'Adding...' : 'Add Note'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}