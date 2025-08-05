import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Star, Clock, RotateCcw, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface StatusChange {
  id: string;
  from_status: LeadStatus;
  to_status: LeadStatus;
  changed_by: string;
  changed_at: string;
  reason?: string;
}

interface AdminPanelProps {
  lead: Lead;
  onUpdate: () => void;
  onStatusChange: (status: LeadStatus) => void;
}

export function AdminPanel({ lead, onUpdate, onStatusChange }: AdminPanelProps) {
  const [statusHistory, setStatusHistory] = useState<StatusChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const { toast } = useToast();

  const [statusChange, setStatusChange] = useState({
    new_status: lead.status as LeadStatus,
    reason: ''
  });

  const [scoreUpdate, setScoreUpdate] = useState({
    lead_score: lead.lead_score?.toString() || '0',
    ai_score: lead.ai_score?.toString() || '0',
    reason: ''
  });

  const [assignmentUpdate, setAssignmentUpdate] = useState({
    assigned_to: lead.assigned_to || '',
    reason: ''
  });

  useEffect(() => {
    loadStatusHistory();
  }, [lead.id]);

  const loadStatusHistory = async () => {
    try {
      // Mock status history data
      const mockHistory: StatusChange[] = [
        {
          id: '1',
          from_status: 'new',
          to_status: 'contacted',
          changed_by: 'admin@university.edu',
          changed_at: '2024-01-10T10:00:00Z',
          reason: 'Initial contact made via phone call'
        },
        {
          id: '2',
          from_status: 'contacted',
          to_status: 'qualified',
          changed_by: 'advisor@university.edu',
          changed_at: '2024-01-12T14:30:00Z',
          reason: 'Lead meets all program requirements and showed strong interest'
        }
      ];
      setStatusHistory(mockHistory);
    } catch (error) {
      console.error('Error loading status history:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      await LeadService.updateLeadStatus(lead.id, statusChange.new_status);
      
      // Add to status history
      const newChange: StatusChange = {
        id: `change-${Date.now()}`,
        from_status: lead.status,
        to_status: statusChange.new_status,
        changed_by: 'current_user@university.edu',
        changed_at: new Date().toISOString(),
        reason: statusChange.reason
      };
      setStatusHistory(prev => [newChange, ...prev]);

      setStatusChange({ new_status: statusChange.new_status, reason: '' });
      setStatusDialogOpen(false);
      onStatusChange(statusChange.new_status);
      onUpdate();

      toast({
        title: "Success",
        description: "Lead status updated successfully"
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScoreUpdate = async () => {
    try {
      setLoading(true);
      await LeadService.updateLead(lead.id, {
        lead_score: parseInt(scoreUpdate.lead_score),
        ai_score: parseFloat(scoreUpdate.ai_score)
      });

      setScoreUpdate({ lead_score: scoreUpdate.lead_score, ai_score: scoreUpdate.ai_score, reason: '' });
      setScoreDialogOpen(false);
      onUpdate();

      toast({
        title: "Success",
        description: "Lead scores updated successfully"
      });
    } catch (error) {
      console.error('Error updating scores:', error);
      toast({
        title: "Error",
        description: "Failed to update lead scores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentUpdate = async () => {
    try {
      setLoading(true);
      await LeadService.updateLead(lead.id, {
        assigned_to: assignmentUpdate.assigned_to || null,
        assigned_at: assignmentUpdate.assigned_to ? new Date().toISOString() : null
      });

      setAssignmentUpdate({ assigned_to: assignmentUpdate.assigned_to, reason: '' });
      setAssignmentDialogOpen(false);
      onUpdate();

      toast({
        title: "Success",
        description: assignmentUpdate.assigned_to ? "Lead assigned successfully" : "Lead unassigned successfully"
      });
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update lead assignment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'text-blue-600';
      case 'contacted': return 'text-purple-600';
      case 'qualified': return 'text-green-600';
      case 'converted': return 'text-emerald-600';
      case 'unqualified': return 'text-red-600';
      case 'lost': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: LeadStatus) => {
    switch (status) {
      case 'converted': return <CheckCircle className="h-4 w-4" />;
      case 'unqualified':
      case 'lost': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Admin Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">Status & History</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Current Status</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Updated: {format(new Date(lead.updated_at), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </div>
              <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Change Status
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Lead Status</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>New Status</Label>
                      <Select value={statusChange.new_status} onValueChange={(value: LeadStatus) => setStatusChange({ ...statusChange, new_status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="unqualified">Unqualified</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status-reason">Reason for Change</Label>
                      <Textarea
                        id="status-reason"
                        value={statusChange.reason}
                        onChange={(e) => setStatusChange({ ...statusChange, reason: e.target.value })}
                        placeholder="Explain why the status is changing..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleStatusUpdate} disabled={loading || statusChange.new_status === lead.status}>
                      Update Status
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Status History</h3>
              {statusHistory.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No status changes recorded</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {statusHistory.map((change) => (
                    <div key={change.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getStatusIcon(change.to_status)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(change.from_status)}>
                            {change.from_status}
                          </Badge>
                          <span className="text-sm">→</span>
                          <Badge variant="outline" className={getStatusColor(change.to_status)}>
                            {change.to_status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(change.changed_at), 'MMM d, yyyy h:mm a')} by {change.changed_by}
                        </div>
                        {change.reason && (
                          <p className="text-sm">{change.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scoring" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{lead.lead_score || 0}</div>
                <div className="text-sm text-muted-foreground">Lead Score</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{lead.ai_score?.toFixed(1) || '0.0'}</div>
                <div className="text-sm text-muted-foreground">AI Score</div>
              </div>
            </div>

            <Dialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Update Scores
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Lead Scores</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lead-score">Lead Score (0-100)</Label>
                      <Input
                        id="lead-score"
                        type="number"
                        min="0"
                        max="100"
                        value={scoreUpdate.lead_score}
                        onChange={(e) => setScoreUpdate({ ...scoreUpdate, lead_score: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ai-score">AI Score (0-10)</Label>
                      <Input
                        id="ai-score"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={scoreUpdate.ai_score}
                        onChange={(e) => setScoreUpdate({ ...scoreUpdate, ai_score: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="score-reason">Reason for Change</Label>
                    <Textarea
                      id="score-reason"
                      value={scoreUpdate.reason}
                      onChange={(e) => setScoreUpdate({ ...scoreUpdate, reason: e.target.value })}
                      placeholder="Explain the scoring rationale..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleScoreUpdate} disabled={loading}>
                    Update Scores
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="text-sm text-muted-foreground">
              <Shield className="h-4 w-4 inline mr-1" />
              Lead scores are used for prioritization and routing decisions
            </div>
          </TabsContent>

          <TabsContent value="assignment" className="space-y-4">
            <div>
              <h3 className="font-medium">Current Assignment</h3>
              <div className="mt-2">
                {lead.assigned_to ? (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{lead.assigned_to}</span>
                    <Badge variant="outline" className="text-xs">
                      Assigned {lead.assigned_at ? format(new Date(lead.assigned_at), 'MMM d, yyyy') : 'Unknown'}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <User className="h-4 w-4 inline mr-1" />
                    Unassigned
                  </div>
                )}
              </div>
            </div>

            <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  {lead.assigned_to ? 'Reassign Lead' : 'Assign Lead'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Lead Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="assigned-to">Assign To</Label>
                    <Select value={assignmentUpdate.assigned_to} onValueChange={(value) => setAssignmentUpdate({ ...assignmentUpdate, assigned_to: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select advisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        <SelectItem value="advisor1@university.edu">Sarah Johnson</SelectItem>
                        <SelectItem value="advisor2@university.edu">Michael Chen</SelectItem>
                        <SelectItem value="advisor3@university.edu">Emily Davis</SelectItem>
                        <SelectItem value="advisor4@university.edu">Robert Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignment-reason">Reason for Assignment</Label>
                    <Textarea
                      id="assignment-reason"
                      value={assignmentUpdate.reason}
                      onChange={(e) => setAssignmentUpdate({ ...assignmentUpdate, reason: e.target.value })}
                      placeholder="Why is this advisor the best fit?"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAssignmentUpdate} disabled={loading}>
                    Update Assignment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="text-sm text-muted-foreground">
              <Shield className="h-4 w-4 inline mr-1" />
              Assignment determines who is responsible for following up with this lead
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}