import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  CheckSquare, 
  StickyNote, 
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  Tag
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadCommunication, LeadTask, LeadNote } from '@/types/leadEnhancements';
import { LeadCommunicationService } from '@/services/leadCommunicationService';
import { LeadTaskService } from '@/services/leadTaskService';
import { LeadNotesService } from '@/services/leadNotesService';
import { useToast } from '@/hooks/use-toast';
import { CommunicationPanel } from './lead-details/CommunicationPanel';
import { TaskPanel } from './lead-details/TaskPanel';
import { NotesPanel } from './lead-details/NotesPanel';
import { LeadTimeline } from './lead-details/LeadTimeline';

interface EnhancedLeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate?: (updatedLead: Lead) => void;
}

export function EnhancedLeadDetailModal({
  lead,
  isOpen,
  onClose,
  onLeadUpdate
}: EnhancedLeadDetailModalProps) {
  const { toast } = useToast();
  const [communications, setCommunications] = useState<LeadCommunication[]>([]);
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (lead && isOpen) {
      loadLeadData();
    }
  }, [lead, isOpen]);

  const loadLeadData = async () => {
    if (!lead) return;
    
    setLoading(true);
    try {
      const [communicationsData, tasksData, notesData] = await Promise.all([
        LeadCommunicationService.getCommunications(lead.id),
        LeadTaskService.getTasks(lead.id),
        LeadNotesService.getNotes(lead.id)
      ]);

      setCommunications(communicationsData);
      setTasks(tasksData);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading lead data:', error);
      toast({
        title: "Error",
        description: "Failed to load lead details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCommunicationCreated = (newCommunication: LeadCommunication) => {
    setCommunications(prev => [newCommunication, ...prev]);
  };

  const handleTaskCreated = (newTask: LeadTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask: LeadTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleNoteCreated = (newNote: LeadNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

  if (!lead) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'converted': return 'default';
      case 'qualified': return 'secondary';
      case 'contacted': return 'outline';
      case 'new': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const overdueTasks = tasks.filter(task => 
    task.status !== 'completed' && 
    task.due_date && 
    new Date(task.due_date) < new Date()
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-5 w-5" />
            {lead.first_name} {lead.last_name}
            <Badge variant={getStatusBadgeVariant(lead.status)}>
              {lead.status}
            </Badge>
            <Badge variant={getPriorityBadgeVariant(lead.priority)}>
              {lead.priority}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.email}</span>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                )}
                {(lead.city || lead.state || lead.country) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {[lead.city, lead.state, lead.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Lead Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground">Source</span>
                  <p className="text-sm capitalize">{lead.source}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Score</span>
                  <p className="text-sm">{lead.lead_score}/100</p>
                </div>
                {lead.program_interest && lead.program_interest.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">Programs of Interest</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {lead.program_interest.map((program, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {lead.tags && lead.tags.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">Tags</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {lead.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Communications</span>
                  <Badge variant="outline">{communications.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Pending Tasks</span>
                  <Badge variant={pendingTasks > 0 ? "default" : "outline"}>
                    {pendingTasks}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Overdue Tasks</span>
                  <Badge variant={overdueTasks > 0 ? "destructive" : "outline"}>
                    {overdueTasks}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Notes</span>
                  <Badge variant="outline">{notes.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="communications">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Communications
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="notes">
                  <StickyNote className="h-4 w-4 mr-1" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <Calendar className="h-4 w-4 mr-1" />
                  Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Recent Communications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {communications.slice(0, 3).map((comm) => (
                        <div key={comm.id} className="border-b border-border last:border-0 py-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium capitalize">{comm.type}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(comm.communication_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {comm.direction}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {communications.length === 0 && (
                        <p className="text-sm text-muted-foreground">No communications yet</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Upcoming Tasks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tasks.filter(task => task.status === 'pending').slice(0, 3).map((task) => (
                        <div key={task.id} className="border-b border-border last:border-0 py-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium">{task.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {task.due_date ? 
                                  `Due: ${new Date(task.due_date).toLocaleDateString()}` :
                                  'No due date'
                                }
                              </p>
                            </div>
                            <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {tasks.filter(task => task.status === 'pending').length === 0 && (
                        <p className="text-sm text-muted-foreground">No pending tasks</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="communications" className="mt-4">
                <CommunicationPanel
                  leadId={lead.id}
                  communications={communications}
                  onCommunicationCreated={handleCommunicationCreated}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="tasks" className="mt-4">
                <TaskPanel
                  leadId={lead.id}
                  tasks={tasks}
                  onTaskCreated={handleTaskCreated}
                  onTaskUpdated={handleTaskUpdated}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <NotesPanel
                  leadId={lead.id}
                  notes={notes}
                  onNoteCreated={handleNoteCreated}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <LeadTimeline
                  leadId={lead.id}
                  communications={communications}
                  tasks={tasks}
                  notes={notes}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}