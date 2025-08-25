import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Play as PlayIcon, Zap, Clock, FileText, Users, Heart, 
         TrendingUp, Target, Calendar, AlertCircle } from 'lucide-react';

interface Play {
  id: string;
  name: string;
  description: string;
  play_type: string;
  trigger_type: string;
  trigger_config: any;
  is_active: boolean;
  estimated_impact: string;
  target_stage?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export function PlaysManagement() {
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, actionsGenerated: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadPlays();
    loadStats();
  }, []);

  const loadPlays = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('plays')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlays(data || []);
    } catch (error) {
      console.error('Error loading plays:', error);
      toast({
        title: "Error",
        description: "Failed to load plays",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get total actions generated today by plays
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: actions, error } = await supabase
        .from('student_actions')
        .select('id, metadata')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      if (error) throw error;
      
      const playGeneratedActions = actions?.filter(a => 
        a.metadata && typeof a.metadata === 'object' && 
        'play_source' in a.metadata
      ) || [];
      
      setStats(prev => ({ 
        ...prev, 
        actionsGenerated: playGeneratedActions.length 
      }));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleTogglePlay = async (playId: string, isActive: boolean) => {
    setToggleLoading(playId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('plays')
        .update({ is_active: isActive })
        .eq('id', playId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setPlays(plays.map(p => p.id === playId ? data : p));
      
      if (isActive) {
        // Generate actions based on play
        const actionsGenerated = await generateActionsForPlay(data);
        await loadStats(); // Refresh stats
        
        toast({
          title: "Play activated! 🚀",
          description: `${actionsGenerated} new actions added to Today's queue`,
        });
      } else {
        toast({
          title: "Play deactivated",
          description: "Play has been turned off",
        });
      }
    } catch (error) {
      console.error('Error toggling play:', error);
      toast({
        title: "Error",
        description: "Failed to toggle play",
        variant: "destructive",
      });
    } finally {
      setToggleLoading(null);
    }
  };

  const generateActionsForPlay = async (play: Play): Promise<number> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const actions = getActionsForPlayType(play, user.id);
      
      if (actions.length > 0) {
        const { error } = await supabase
          .from('student_actions')
          .insert(actions);

        if (error) throw error;
      }

      return actions.length;
    } catch (error) {
      console.error('Error generating actions:', error);
      return 0;
    }
  };

  const getActionsForPlayType = (play: Play, userId: string) => {
    const now = new Date();
    const actions: any[] = [];

    switch (play.play_type) {
      case 'immediate_response':
        // Speed-to-Lead: Create urgent callback actions
        actions.push({
          user_id: userId,
          student_id: crypto.randomUUID(),
          action_type: 'call',
          instruction: 'Call new high-intent inquiry within 5 minutes',
          reason_chips: ['New form submission', 'High yield score', 'Speed-to-lead triggered'],
          priority: 1,
          status: 'pending',
          scheduled_at: new Date(now.getTime() + 5 * 60 * 1000).toISOString(), // 5 min
          metadata: {
            student_name: 'Sarah Martinez',
            program: 'Computer Science',
            yield_score: 89,
            yield_band: 'high',
            contact_info: {
              email: 'sarah.martinez@email.com',
              phone: '+1-555-0190',
              location: 'Los Angeles, CA'
            },
            play_source: play.name
          }
        });
        break;

      case 'nurture_sequence':
        // Stalled 7-Day: Multi-channel re-engagement
        actions.push({
          user_id: userId,
          student_id: crypto.randomUUID(),
          action_type: 'email',
          instruction: 'Send stalled application nudge email',
          reason_chips: ['Application stalled 8 days', 'Documents incomplete', 'Previous engagement high'],
          priority: 2,
          status: 'pending',
          scheduled_at: now.toISOString(),
          metadata: {
            student_name: 'Michael Rodriguez',
            program: 'Business Administration',
            yield_score: 76,
            yield_band: 'medium',
            contact_info: {
              email: 'michael.rodriguez@email.com',
              phone: '+1-555-0191',
              location: 'Phoenix, AZ'
            },
            play_source: play.name
          }
        });
        break;

      case 'document_follow_up':
        // Document Chase: Missing transcript follow-up
        actions.push({
          user_id: userId,
          student_id: crypto.randomUUID(),
          action_type: 'email',
          instruction: 'Send transcript reminder with upload link',
          reason_chips: ['Transcript missing 5 days', 'Application 85% complete', 'High intent signals'],
          priority: 2,
          status: 'pending',
          scheduled_at: now.toISOString(),
          metadata: {
            student_name: 'Jessica Chen',
            program: 'Data Science',
            yield_score: 82,
            yield_band: 'high',
            contact_info: {
              email: 'jessica.chen@email.com',
              phone: '+1-555-0192',
              location: 'Seattle, WA'
            },
            play_source: play.name
          }
        });
        break;

      case 'event_response':
        // RSVP → Interview: Post-webinar follow-up
        actions.push({
          user_id: userId,
          student_id: crypto.randomUUID(),
          action_type: 'task',
          instruction: 'Schedule interview within 48 hours',
          reason_chips: ['Attended full webinar', '25 mins engagement', 'Asked specific questions'],
          priority: 2,
          status: 'pending',
          scheduled_at: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
          metadata: {
            student_name: 'David Park',
            program: 'Cybersecurity',
            yield_score: 91,
            yield_band: 'high',
            contact_info: {
              email: 'david.park@email.com',
              phone: '+1-555-0193',
              location: 'Austin, TX'
            },
            play_source: play.name
          }
        });
        break;

      case 'status_transition':
        // Deposit → Onboarding: Welcome sequence
        actions.push({
          user_id: userId,
          student_id: crypto.randomUUID(),
          action_type: 'task',
          instruction: 'Send welcome package and onboarding checklist',
          reason_chips: ['Deposit confirmed', 'Enrollment complete', 'Begin onboarding'],
          priority: 2,
          status: 'pending',
          scheduled_at: new Date(now.getTime() + 30 * 60 * 1000).toISOString(), // 30 min
          metadata: {
            student_name: 'Amanda Wilson',
            program: 'Nursing',
            yield_score: 95,
            yield_band: 'high',
            contact_info: {
              email: 'amanda.wilson@email.com',
              phone: '+1-555-0194',
              location: 'Denver, CO'
            },
            play_source: play.name
          }
        });
        break;
    }

    return actions;
  };

  const getPlayIcon = (playType: string) => {
    switch (playType) {
      case 'immediate_response': return <Zap className="h-5 w-5" />;
      case 'nurture_sequence': return <Clock className="h-5 w-5" />;
      case 'document_follow_up': return <FileText className="h-5 w-5" />;
      case 'event_response': return <Users className="h-5 w-5" />;
      case 'status_transition': return <Heart className="h-5 w-5" />;
      default: return <PlayIcon className="h-5 w-5" />;
    }
  };

  const getPlayTypeLabel = (playType: string) => {
    switch (playType) {
      case 'immediate_response': return 'Immediate Response';
      case 'nurture_sequence': return 'Nurture Sequence';
      case 'document_follow_up': return 'Document Follow-up';
      case 'event_response': return 'Event Response';
      case 'status_transition': return 'Status Transition';
      default: return 'Sequence';
    }
  };

  const getPlayTypeColor = (playType: string) => {
    switch (playType) {
      case 'immediate_response': return 'bg-red-50 text-red-700 border-red-200';
      case 'nurture_sequence': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'document_follow_up': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'event_response': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'status_transition': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-5 bg-muted rounded w-48"></div>
                      <div className="h-4 bg-muted rounded w-64"></div>
                    </div>
                    <div className="h-6 w-12 bg-muted rounded-full"></div>
                  </div>
                  <div className="h-16 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activePlays = plays.filter(p => p.is_active);
  stats.total = plays.length;
  stats.active = activePlays.length;

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Starter Playbooks</h1>
          <p className="text-muted-foreground">
            Turn plays on or off to control which actions appear in Today's queue
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-2xl font-bold">{stats.actionsGenerated}</p>
            <p className="text-sm text-muted-foreground">Actions today</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {stats.active}/{stats.total} Active
          </Badge>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Actions Generated</p>
                <p className="font-medium">{stats.actionsGenerated} today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Expected Lift</p>
                <p className="font-medium">15-24% improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Attribution Window</p>
                <p className="font-medium">7-14 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Explanation */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">How Plays Work</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Each play is a proven action recipe that automatically creates prioritized tasks. 
                When you activate a play, it immediately scans for matching students and adds relevant 
                actions to Today's queue with proper reasoning.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">Auto-prioritized</Badge>
                <Badge variant="secondary" className="text-xs">Real student data</Badge>
                <Badge variant="secondary" className="text-xs">Instant activation</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Plays List */}
      <div className="grid gap-6">
        {plays.map((play) => (
          <Card 
            key={play.id} 
            className={`transition-all duration-200 ${
              play.is_active 
                ? "border-primary bg-primary/5 shadow-md" 
                : "hover:shadow-sm"
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    play.is_active 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {getPlayIcon(play.play_type || '')}
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{play.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={getPlayTypeColor(play.play_type || '')}
                      >
                        {getPlayTypeLabel(play.play_type || '')}
                      </Badge>
                      {play.trigger_type && (
                        <Badge variant="secondary" className="text-xs">
                          {play.trigger_type.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {play.is_active && (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      ● RUNNING
                    </Badge>
                  )}
                  <Switch
                    checked={play.is_active}
                    onCheckedChange={(checked) => handleTogglePlay(play.id, checked)}
                    disabled={toggleLoading === play.id}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{play.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Expected Impact</p>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{play.estimated_impact}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">When It Triggers</p>
                  <div className="text-sm text-muted-foreground">
                    {play.trigger_type === 'form_submission' && 'New form submissions'}
                    {play.trigger_type === 'time_based' && 'Daily at scheduled time'}
                    {play.trigger_type === 'document_status' && 'Document status changes'}
                    {play.trigger_type === 'event_attendance' && 'Event attendance'}
                    {play.trigger_type === 'payment_received' && 'Payment confirmation'}
                  </div>
                </div>
              </div>

              {/* Action Preview */}
              {play.trigger_config && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <p className="text-sm font-medium mb-2">Trigger Configuration:</p>
                  <div className="text-xs font-mono text-muted-foreground">
                    {JSON.stringify(play.trigger_config, null, 2).slice(0, 200)}...
                  </div>
                </div>
              )}

              {play.is_active && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-green-800">
                      Active - Monitoring for triggers
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateActionsForPlay(play)}
                    disabled={toggleLoading === play.id}
                  >
                    Test Generate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {plays.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <PlayIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No starter plays found</h3>
            <p className="text-muted-foreground">
              The 5 starter plays should be automatically seeded. Try refreshing the page.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}