import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { PlaysService, type StudentAction } from '@/services/playsService';
import { Phone, Mail, FileText, CheckCircle, Clock, User, GraduationCap } from 'lucide-react';

export function TodayDashboard() {
  const [actions, setActions] = useState<StudentAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadActions();
    loadProgress();
  }, []);

  const loadActions = async () => {
    try {
      const data = await PlaysService.getStudentActions();
      setActions(data);
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

  const loadProgress = async () => {
    try {
      const analytics = await PlaysService.getPlayAnalytics();
      setCompletedToday(analytics.completedToday);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleCompleteAction = async (actionId: string) => {
    try {
      await PlaysService.completeAction(actionId);
      setActions(actions.filter(a => a.id !== actionId));
      setCompletedToday(prev => prev + 1);
      
      toast({
        title: "Action completed",
        description: "Great work! Action marked as complete.",
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
      case 'document_request': return <FileText className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800 border-red-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      default: return 'Low';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
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

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Actions</p>
                <p className="text-2xl font-bold">{actions.length}</p>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Today's Progress</p>
                <p className="text-sm font-medium">{Math.round(progressPercentage)}%</p>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Today's Prioritized Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {actions.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                No pending actions right now. Great work! 
                {completedToday > 0 && ` You've completed ${completedToday} actions today.`}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {actions.map((action) => (
                <div key={action.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getActionIcon(action.action_type)}
                          <span className="font-medium">Student #{action.student_id}</span>
                        </div>
                        
                        <Badge variant="outline" className={getPriorityColor(action.priority)}>
                          {getPriorityLabel(action.priority)} Priority
                        </Badge>

                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <GraduationCap className="h-3 w-3" />
                          <span>Business Admin</span>
                        </div>
                      </div>
                      
                      <p className="text-lg">{action.instruction}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {action.reason_chips?.map((chip, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {chip}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {action.scheduled_at && (
                        <div className="text-sm text-muted-foreground">
                          {new Date(action.scheduled_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      )}
                      
                      <Button
                        onClick={() => handleCompleteAction(action.id)}
                        variant="outline"
                        size="sm"
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}