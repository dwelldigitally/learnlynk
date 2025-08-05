import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Plus, Phone, Mail, MessageCircle, Calendar, Send, ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react';
import { AIVideoIntegration } from './AIVideoIntegration';
import { AITranscriptionPanel } from './AITranscriptionPanel';
import { AIMeetingAnalysis } from './AIMeetingAnalysis';
import { AIFollowUpGenerator } from './AIFollowUpGenerator';
import { Lead } from '@/types/lead';
import { LeadCommunication, CommunicationFormData, CommunicationType, CommunicationDirection } from '@/types/leadEnhancements';
import { LeadCommunicationService } from '@/services/leadCommunicationService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface CommunicationHubProps {
  lead: Lead;
  onUpdate: () => void;
}

export function CommunicationHub({ lead, onUpdate }: CommunicationHubProps) {
  const [communications, setCommunications] = useState<LeadCommunication[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newCommunication, setNewCommunication] = useState<CommunicationFormData>({
    type: 'email',
    direction: 'outbound',
    content: '',
    communication_date: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    loadCommunications();
  }, [lead.id]);

  const loadCommunications = async () => {
    try {
      setLoading(true);
      const data = await LeadCommunicationService.getCommunications(lead.id);
      setCommunications(data);
    } catch (error) {
      console.error('Error loading communications:', error);
      toast({
        title: "Error",
        description: "Failed to load communications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunication = async () => {
    try {
      await LeadCommunicationService.createCommunication(lead.id, newCommunication);
      setNewCommunication({
        type: 'email',
        direction: 'outbound',
        content: '',
        communication_date: new Date().toISOString().slice(0, 16)
      });
      setDialogOpen(false);
      loadCommunications();
      onUpdate();
      toast({
        title: "Success",
        description: "Communication logged successfully"
      });
    } catch (error) {
      console.error('Error creating communication:', error);
      toast({
        title: "Error",
        description: "Failed to log communication",
        variant: "destructive"
      });
    }
  };

  const getCommunicationIcon = (type: CommunicationType) => {
    switch (type) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageCircle className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getDirectionIcon = (direction: CommunicationDirection) => {
    return direction === 'inbound' ? 
      <ArrowDownLeft className="h-3 w-3 text-green-500" /> : 
      <ArrowUpRight className="h-3 w-3 text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      scheduled: 'secondary',
      failed: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'} className="text-xs">
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="communications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="ai-features">
            <Zap className="h-4 w-4 mr-2" />
            AI Features
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="communications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Hub
                </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Log Communication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log New Communication</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select value={newCommunication.type} onValueChange={(value: CommunicationType) => setNewCommunication({ ...newCommunication, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Direction</Label>
                    <Select value={newCommunication.direction} onValueChange={(value: CommunicationDirection) => setNewCommunication({ ...newCommunication, direction: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outbound">Outbound</SelectItem>
                        <SelectItem value="inbound">Inbound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {(newCommunication.type === 'email' || newCommunication.type === 'meeting') && (
                  <div>
                    <Label htmlFor="communication-subject">Subject</Label>
                    <Input
                      id="communication-subject"
                      value={newCommunication.subject || ''}
                      onChange={(e) => setNewCommunication({ ...newCommunication, subject: e.target.value })}
                      placeholder="Subject/Title"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="communication-content">Content/Notes</Label>
                  <Textarea
                    id="communication-content"
                    value={newCommunication.content}
                    onChange={(e) => setNewCommunication({ ...newCommunication, content: e.target.value })}
                    placeholder="Enter communication details..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="communication-date">Date & Time</Label>
                  <Input
                    id="communication-date"
                    type="datetime-local"
                    value={newCommunication.communication_date}
                    onChange={(e) => setNewCommunication({ ...newCommunication, communication_date: e.target.value })}
                  />
                </div>
                
                <Button onClick={handleCreateCommunication} disabled={!newCommunication.content.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Log Communication
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {communications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No communications logged yet</p>
            <p className="text-sm mt-1">Start by logging your first interaction with this lead</p>
          </div>
        ) : (
          <div className="space-y-4">
            {communications.map((comm, index) => (
              <div key={comm.id}>
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-1 mt-1">
                    {getCommunicationIcon(comm.type)}
                    {getDirectionIcon(comm.direction)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{comm.type}</span>
                          <Badge variant="outline" className="text-xs">
                            {comm.direction}
                          </Badge>
                          {getStatusBadge(comm.status)}
                        </div>
                        {comm.subject && (
                          <p className="text-sm font-medium">{comm.subject}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comm.communication_date), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comm.content}</p>
                  </div>
                </div>
                {index < communications.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
        </TabsContent>
        
        <TabsContent value="ai-features" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIVideoIntegration 
              leadId={lead.id} 
              onMeetingScheduled={(meetingData) => {
                // Handle meeting scheduled
                console.log('Meeting scheduled:', meetingData);
                onUpdate();
              }}
            />
            <AITranscriptionPanel 
              leadId={lead.id}
              onTranscriptUpdate={(transcript) => {
                // Handle transcript updates
                console.log('Transcript updated:', transcript);
              }}
            />
            <AIMeetingAnalysis 
              leadId={lead.id}
            />
            <AIFollowUpGenerator 
              leadId={lead.id}
              onActionCreated={(action) => {
                // Handle action creation
                console.log('Action created:', action);
                onUpdate();
              }}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Communication Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{communications.length}</div>
                  <div className="text-sm text-muted-foreground">Total Communications</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {communications.filter(c => c.direction === 'inbound').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Inbound Responses</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {communications.filter(c => c.type === 'meeting').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Meetings Held</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}