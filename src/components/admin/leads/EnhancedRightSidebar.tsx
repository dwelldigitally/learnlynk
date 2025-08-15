import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Phone, Clock, Calendar, Users, 
  Video, CheckCircle, XCircle, Timer,
  Mail, TrendingUp, Zap, PlayCircle,
  PauseCircle, StopCircle, Plus, Eye,
  BarChart3, Target, Settings
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { SmartAdvisorMatch } from './SmartAdvisorMatch';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedRightSidebarProps {
  lead: Lead;
}

export function EnhancedRightSidebar({ lead }: EnhancedRightSidebarProps) {
  const { toast } = useToast();
  const [sequences, setSequences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateSequence, setShowCreateSequence] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState<Record<string, any>>({});
  const [newSequence, setNewSequence] = useState({
    name: '',
    description: '',
    type: 'nurture',
    duration_days: 14,
    email_count: 5
  });

  // Load sequences and progress on mount
  useEffect(() => {
    loadSequences();
    loadSequenceProgress();
  }, [lead.id]);

  const loadSequences = async () => {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSequences(data || []);
    } catch (error) {
      console.error('Error loading sequences:', error);
    }
  };

  const loadSequenceProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_sequence_enrollments')
        .select('*, email_sequences(*)')
        .eq('lead_id', lead.id);
      
      if (error) throw error;
      
      const progressMap = {};
      data?.forEach(enrollment => {
        progressMap[enrollment.sequence_id] = enrollment;
      });
      setSequenceProgress(progressMap);
    } catch (error) {
      console.error('Error loading sequence progress:', error);
    }
  };

  // Mock Aircall history data
  const aircallHistory = [
    {
      id: '1',
      type: 'outbound',
      duration: '5:32',
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z',
      notes: 'Discussed MBA program requirements'
    },
    {
      id: '2',
      type: 'inbound',
      duration: '3:15',
      status: 'completed',
      timestamp: '2024-01-14T14:20:00Z',
      notes: 'Follow-up questions about tuition'
    },
    {
      id: '3',
      type: 'outbound',
      duration: '0:00',
      status: 'missed',
      timestamp: '2024-01-13T16:45:00Z',
      notes: 'No answer, left voicemail'
    }
  ];

  // Mock appointment history
  const appointmentHistory = [
    {
      id: '1',
      title: 'Initial Consultation',
      type: 'video_call',
      status: 'completed',
      date: '2024-01-10T15:00:00Z',
      duration: 45,
      notes: 'Productive discussion about career goals'
    },
    {
      id: '2',
      title: 'Program Deep Dive',
      type: 'phone_call',
      status: 'scheduled',
      date: '2024-01-20T10:00:00Z',
      duration: 30,
      notes: 'Focus on MBA curriculum'
    }
  ];

  const createSequence = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .insert([{
          name: newSequence.name,
          description: newSequence.description,
          type: newSequence.type,
          duration_days: newSequence.duration_days,
          email_count: newSequence.email_count,
          status: 'active',
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      setSequences(prev => [data, ...prev]);
      setShowCreateSequence(false);
      setNewSequence({
        name: '',
        description: '',
        type: 'nurture',
        duration_days: 14,
        email_count: 5
      });
      
      toast({
        title: 'Success',
        description: 'Email sequence created successfully!'
      });
    } catch (error) {
      console.error('Error creating sequence:', error);
      toast({
        title: 'Error',
        description: 'Failed to create sequence',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const enrollInSequence = async (sequenceId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('lead_sequence_enrollments')
        .insert([{
          lead_id: lead.id,
          sequence_id: sequenceId,
          status: 'active',
          current_step: 1,
          enrolled_at: new Date().toISOString()
        }]);

      if (error) throw error;

      await loadSequenceProgress();
      
      toast({
        title: 'Success',
        description: 'Lead enrolled in sequence successfully!'
      });
    } catch (error) {
      console.error('Error enrolling in sequence:', error);
      toast({
        title: 'Error',
        description: 'Failed to enroll in sequence',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSequenceStatus = async (sequenceId: string, status: 'paused' | 'stopped') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('lead_sequence_enrollments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('lead_id', lead.id)
        .eq('sequence_id', sequenceId);

      if (error) throw error;

      await loadSequenceProgress();
      
      toast({
        title: 'Success',
        description: `Sequence ${status} successfully!`
      });
    } catch (error) {
      console.error('Error updating sequence status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update sequence status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getCallStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Timer className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAppointmentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Timer className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleSequenceAction = (sequenceId: string, action: 'enroll' | 'pause' | 'stop') => {
    switch (action) {
      case 'enroll':
        enrollInSequence(sequenceId);
        break;
      case 'pause':
        updateSequenceStatus(sequenceId, 'paused');
        break;
      case 'stop':
        updateSequenceStatus(sequenceId, 'stopped');
        break;
    }
  };

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col overflow-y-auto">
      {/* Aircall History */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-500" />
          Call History
        </h3>
        <div className="space-y-3">
          {aircallHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No calls yet</p>
          ) : (
            aircallHistory.map((call) => (
              <div key={call.id} className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCallStatusIcon(call.status)}
                    <Badge variant="outline" className="text-xs">
                      {call.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {call.duration}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {new Date(call.timestamp).toLocaleString()}
                </div>
                {call.notes && (
                  <p className="text-xs text-foreground">{call.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appointment History */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-500" />
          Appointments
        </h3>
        <div className="space-y-3">
          {appointmentHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments yet</p>
          ) : (
            appointmentHistory.map((appointment) => (
              <div key={appointment.id} className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAppointmentStatusIcon(appointment.status)}
                    <span className="text-sm font-medium">{appointment.title}</span>
                  </div>
                  {appointment.type === 'video_call' && (
                    <Video className="h-4 w-4 text-purple-500" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {new Date(appointment.date).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  Duration: {appointment.duration} minutes
                </div>
                {appointment.notes && (
                  <p className="text-xs text-foreground">{appointment.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-3">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* AI Sequences Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Sequences</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {Object.values(sequenceProgress).filter(p => p.status === 'active').length} Active
            </Badge>
            <Dialog open={showCreateSequence} onOpenChange={setShowCreateSequence}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Email Sequence</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={newSequence.name}
                      onChange={(e) => setNewSequence(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., MBA Welcome Series"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newSequence.description}
                      onChange={(e) => setNewSequence(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the sequence purpose and content"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Duration (days)</label>
                      <Input
                        type="number"
                        value={newSequence.duration_days}
                        onChange={(e) => setNewSequence(prev => ({ ...prev, duration_days: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Count</label>
                      <Input
                        type="number"
                        value={newSequence.email_count}
                        onChange={(e) => setNewSequence(prev => ({ ...prev, email_count: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <Button onClick={createSequence} disabled={loading} className="w-full">
                    {loading ? 'Creating...' : 'Create Sequence'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Automated email sequences powered by AI to nurture and convert leads
        </p>

        <div className="space-y-3">
          {sequences.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No sequences available</p>
              <p className="text-xs">Create your first sequence to get started</p>
            </div>
          ) : (
            sequences.map((sequence) => {
              const enrollment = sequenceProgress[sequence.id];
              const isEnrolled = enrollment && enrollment.status === 'active';
              const isPaused = enrollment && enrollment.status === 'paused';
              
              return (
                <div key={sequence.id} className={`rounded-lg border transition-all duration-200 ${
                  isEnrolled 
                    ? 'bg-green-50 border-green-200 shadow-sm' 
                    : isPaused
                    ? 'bg-yellow-50 border-yellow-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}>
                  <div className="p-3 overflow-hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold truncate">{sequence.name}</h4>
                          <Badge 
                            variant={sequence.type === 'deadline-driven' ? 'destructive' : 'outline'} 
                            className="text-xs px-2 py-0"
                          >
                            {sequence.type}
                          </Badge>
                          {isEnrolled && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {isPaused && <PauseCircle className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 break-words">{sequence.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 min-w-0">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{sequence.duration_days} days</span>
                          </div>
                          <div className="flex items-center gap-1 min-w-0">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{sequence.email_count} emails</span>
                          </div>
                          {enrollment && (
                            <div className="flex items-center gap-1 min-w-0">
                              <Target className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">Step {enrollment.current_step}</span>
                            </div>
                          )}
                        </div>

                        {enrollment && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{Math.round((enrollment.current_step / sequence.email_count) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${(enrollment.current_step / sequence.email_count) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {isEnrolled ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleSequenceAction(sequence.id, 'pause')}
                            disabled={loading}
                          >
                            <PauseCircle className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleSequenceAction(sequence.id, 'stop')}
                            disabled={loading}
                          >
                            <StopCircle className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        </>
                      ) : isPaused ? (
                        <>
                          <Button
                            size="sm"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleSequenceAction(sequence.id, 'enroll')}
                            disabled={loading}
                          >
                            <PlayCircle className="h-3 w-3 mr-1" />
                            Resume
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleSequenceAction(sequence.id, 'stop')}
                            disabled={loading}
                          >
                            <StopCircle className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1 h-7 text-xs"
                          onClick={() => handleSequenceAction(sequence.id, 'enroll')}
                          disabled={loading}
                        >
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Enroll Lead
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="flex-1">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
      </div>

      {/* Smart Advisor Match */}
      <div className="p-4">
        <SmartAdvisorMatch lead={lead} />
      </div>
    </div>
  );
}
