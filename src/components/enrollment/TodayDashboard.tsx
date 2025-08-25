import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail, FileText, CheckCircle, Clock, User, GraduationCap, 
         MapPin, Star, Zap, TrendingUp, AlertCircle } from 'lucide-react';

interface StudentAction {
  id: string;
  action_type: string;
  instruction: string;
  reason_chips: string[];
  priority: number;
  status: string;
  scheduled_at: string;
  metadata: {
    student_name?: string;
    program?: string;
    yield_score?: number;
    yield_band?: string;
    contact_info?: {
      email?: string;
      phone?: string;
      location?: string;
    };
    play_source?: string;
  };
}

export function TodayDashboard() {
  const [actions, setActions] = useState<StudentAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(0);
  const [momentum, setMomentum] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadActions();
    loadStats();
  }, []);

  const loadActions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('student_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('priority', { ascending: true })
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our interface, ensuring metadata is properly typed
      const transformedActions = (data || []).map(action => ({
        ...action,
        metadata: typeof action.metadata === 'string' 
          ? JSON.parse(action.metadata) 
          : action.metadata || {}
      })) as StudentAction[];
      
      setActions(transformedActions);
    } catch (error) {
      console.error('Error loading actions:', error);
      toast({
        title: "Error",
        description: "Failed to load today's actions",
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

      // Get completed actions today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: completed, error: completedError } = await supabase
        .from('student_actions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', today.toISOString());

      if (completedError) throw completedError;
      
      const completedCount = completed?.length || 0;
      setCompletedToday(completedCount);
      
      // Calculate momentum (actions completed in last 2 hours)
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const { data: recent, error: recentError } = await supabase
        .from('student_actions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', twoHoursAgo.toISOString());

      if (recentError) throw recentError;
      setMomentum(recent?.length || 0);
      
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCompleteAction = async (actionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('student_actions')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString(),
          completed_by: user.id 
        })
        .eq('id', actionId);

      if (error) throw error;

      // Remove from local state and update stats
      setActions(actions.filter(a => a.id !== actionId));
      setCompletedToday(prev => prev + 1);
      setMomentum(prev => prev + 1);
      
      toast({
        title: "Action completed! 🎉",
        description: "Great work! Student will be notified of next steps.",
      });
    } catch (error) {
      console.error('Error completing action:', error);
      toast({
        title: "Error",
        description: "Failed to complete action",
        variant: "destructive",
      });
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Mail className="h-4 w-4" />;
      case 'task': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300';
      case 2: return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300';
      case 3: return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'URGENT';
      case 2: return 'High';
      case 3: return 'Medium';
      default: return 'Low';
    }
  };

  const getYieldBandColor = (band: string) => {
    switch (band) {
      case 'high': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300';
      case 'low': return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950 dark:text-gray-400';
      default: return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const isOverdue = (scheduledAt: string) => {
    return new Date(scheduledAt) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((completedToday / Math.max(1, actions.length + completedToday)) * 100, 100);
  const overdueActions = actions.filter(a => isOverdue(a.scheduled_at));
  const urgentActions = actions.filter(a => a.priority === 1);

  return (
    <div className="space-y-6">
      {/* Enhanced Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className={overdueActions.length > 0 ? "border-red-200 bg-red-50/50" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              {overdueActions.length > 0 ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Clock className="h-5 w-5 text-primary" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  {overdueActions.length > 0 ? 'Overdue Actions' : 'Pending Actions'}
                </p>
                <p className="text-2xl font-bold">
                  {overdueActions.length > 0 ? overdueActions.length : actions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">{completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Momentum</p>
                <p className="text-2xl font-bold">{momentum}</p>
                <p className="text-xs text-muted-foreground">last 2 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Today's Progress</p>
                <p className="text-sm font-medium">{Math.round(progressPercentage)}%</p>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Actions Alert */}
      {urgentActions.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">
                {urgentActions.length} urgent action{urgentActions.length > 1 ? 's' : ''} need{urgentActions.length === 1 ? 's' : ''} immediate attention
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Actions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Today's Prioritized Actions</span>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {actions.length} pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {actions.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All caught up! 🎉</h3>
              <p className="text-muted-foreground">
                No pending actions right now. Amazing work! 
                {completedToday > 0 && ` You've completed ${completedToday} actions today.`}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {actions.map((action) => {
                const isActionOverdue = isOverdue(action.scheduled_at);
                const studentName = action.metadata?.student_name || `Student #${action.id.slice(0, 8)}`;
                const program = action.metadata?.program || 'Unknown Program';
                const yieldScore = action.metadata?.yield_score || 0;
                const yieldBand = action.metadata?.yield_band || 'unknown';
                const contactInfo = action.metadata?.contact_info;
                const playSource = action.metadata?.play_source;
                
                return (
                  <div 
                    key={action.id} 
                    className={`p-6 hover:bg-muted/50 transition-colors ${
                      isActionOverdue ? 'bg-red-50/50 border-l-4 border-l-red-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header with student info */}
                        <div className="flex items-center flex-wrap gap-2">
                          <div className="flex items-center space-x-2">
                            {getActionIcon(action.action_type)}
                            <span className="font-semibold text-lg">{studentName}</span>
                          </div>
                          
                          <Badge 
                            variant="outline" 
                            className={`${getPriorityColor(action.priority)} font-medium`}
                          >
                            {getPriorityLabel(action.priority)}
                          </Badge>

                          <Badge 
                            variant="outline" 
                            className={getYieldBandColor(yieldBand)}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {yieldScore}% yield
                          </Badge>

                          {playSource && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {playSource}
                            </Badge>
                          )}
                        </div>

                        {/* Program and Contact Info */}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{program}</span>
                          </div>
                          
                          {contactInfo?.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{contactInfo.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Action instruction */}
                        <p className="text-lg font-medium text-foreground">{action.instruction}</p>
                        
                        {/* Contact details */}
                        {contactInfo && (
                          <div className="flex flex-wrap gap-3 text-sm">
                            {contactInfo.email && (
                              <span className="flex items-center space-x-1 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span>{contactInfo.email}</span>
                              </span>
                            )}
                            {contactInfo.phone && (
                              <span className="flex items-center space-x-1 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span>{contactInfo.phone}</span>
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Reason chips */}
                        <div className="flex flex-wrap gap-1">
                          {action.reason_chips?.map((chip, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-muted/60">
                              {chip}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action controls */}
                      <div className="flex items-center space-x-3 ml-6">
                        <div className="text-right">
                          {action.scheduled_at && (
                            <div className={`text-sm ${isActionOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                              {isActionOverdue ? 'OVERDUE' : 'Due'} {new Date(action.scheduled_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          )}
                        </div>
                        
                        <Button
                          onClick={() => handleCompleteAction(action.id)}
                          variant={action.priority === 1 ? "default" : "outline"}
                          size="sm"
                          className={action.priority === 1 ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          {action.priority === 1 ? 'Complete Now' : 'Complete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}