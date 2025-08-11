import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  User, Mail, Phone, MapPin, Edit, Save, X, 
  Calendar, MessageSquare, Users, Target,
  Building, Clock, Star, Tag, Brain, TrendingUp,
  AlertTriangle, CheckCircle, Pause, Activity, Video,
  Zap, FileText, Send, BookOpen, Coffee, Gift,
  ArrowRight, Sparkles, ThumbsUp, Eye
} from 'lucide-react';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { AIVideoModal } from './AIVideoModal';
import { SequenceEnrollmentDialog } from './SequenceEnrollmentDialog';

interface EnhancedLeadSidebarProps {
  lead: Lead;
  onUpdate: () => void;
}

export function EnhancedLeadSidebar({ lead, onUpdate }: EnhancedLeadSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [enrollingSequence, setEnrollingSequence] = useState<string | null>(null);
  const [enrolledSequences, setEnrolledSequences] = useState<Set<string>>(new Set());
  const [showSequenceDetails, setShowSequenceDetails] = useState<string | null>(null);
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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
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

  const executeAIAction = async (actionId: string, actionName: string) => {
    setExecutingAction(actionId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCompletedActions(prev => new Set([...prev, actionId]));
      
      toast({
        title: "Action Completed",
        description: `${actionName} has been executed successfully`,
      });
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to execute the action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExecutingAction(null);
    }
  };

  const enrollInSequence = async (sequenceId: string, sequenceName: string) => {
    setEnrollingSequence(sequenceId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEnrolledSequences(prev => new Set([...prev, sequenceId]));
      
      toast({
        title: "Sequence Enrollment",
        description: `Successfully enrolled lead in "${sequenceName}"`,
      });
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Failed to enroll in sequence. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnrollingSequence(null);
    }
  };

  const unenrollFromSequence = async (sequenceId: string, sequenceName: string) => {
    try {
      setEnrolledSequences(prev => {
        const newSet = new Set(prev);
        newSet.delete(sequenceId);
        return newSet;
      });
      
      toast({
        title: "Sequence Unenrollment",
        description: `Removed lead from "${sequenceName}"`,
      });
    } catch (error) {
      toast({
        title: "Unenrollment Failed",
        description: "Failed to unenroll from sequence.",
        variant: "destructive",
      });
    }
  };

  const aiRecommendations = [
    {
      id: 'follow-up-email',
      title: 'Send Follow-up Email',
      description: 'Personalized follow-up based on recent activity',
      icon: Mail,
      color: 'blue',
      priority: 'high',
      confidence: 92
    },
    {
      id: 'schedule-consultation',
      title: 'Schedule Consultation',
      description: 'Free 30-min consultation call',
      icon: Calendar,
      color: 'green',
      priority: 'medium',
      confidence: 87
    },
    {
      id: 'send-program-info',
      title: 'Send Program Information',
      description: 'Detailed brochure for interested programs',
      icon: BookOpen,
      color: 'purple',
      priority: 'medium',
      confidence: 78
    },
    {
      id: 'offer-scholarship',
      title: 'Offer Scholarship Info',
      description: 'Early bird scholarship opportunities',
      icon: Gift,
      color: 'orange',
      priority: 'low',
      confidence: 65
    }
  ];

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

  const aiScore = lead.ai_score || 0;
  const engagementScore = Math.round((lead.lead_score / 100) * 85);

  // Mock student flags - in real app, this would come from AI analysis
  const studentFlags = [
    { label: 'Active', type: 'success', icon: CheckCircle },
    { label: 'High Engagement', type: 'info', icon: TrendingUp }
  ];

  // Mock sequences - in real app, this would come from sequence service
  const availableSequences = [
    { 
      id: '1', 
      name: 'Welcome Series', 
      description: '5-email introduction sequence',
      type: 'nurturing',
      duration: '5 days',
      emails: 5,
      openRate: 68,
      clickRate: 12,
      conversionRate: 8,
      tags: ['new-lead', 'introduction']
    },
    { 
      id: '2', 
      name: 'MBA Info Campaign', 
      description: 'Program-specific nurturing for MBA prospects',
      type: 'program-specific',
      duration: '2 weeks',
      emails: 8,
      openRate: 72,
      clickRate: 18,
      conversionRate: 15,
      tags: ['mba', 'program-info']
    },
    { 
      id: '3', 
      name: 'Application Reminder', 
      description: 'Deadline-based follow-ups with urgency',
      type: 'deadline-driven',
      duration: '1 week',
      emails: 3,
      openRate: 85,
      clickRate: 25,
      conversionRate: 22,
      tags: ['deadline', 'urgent']
    }
  ];

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col overflow-y-auto">
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

      {/* Assigned Advisor Section */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-500" />
          Assigned Advisor
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                SJ
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sarah Johnson</span>
              </div>
              <p className="text-xs text-muted-foreground">AI selected based on specialization match</p>
            </div>
          </div>
          
          <Select defaultValue="advisor-1">
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder="Reassign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="advisor-1">Sarah Johnson</SelectItem>
              <SelectItem value="advisor-2">Michael Chen</SelectItem>
              <SelectItem value="advisor-3">Emily Rodriguez</SelectItem>
              <SelectItem value="advisor-4">David Thompson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Actions Section with AI Video Integration */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-green-500" />
          Quick Actions
        </h3>
        <div className="space-y-3">
          {/* Communication Buttons */}
          <div className="flex flex-col gap-2">
            {lead.phone && (
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call {lead.phone}
              </Button>
            )}
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <Video className="h-4 w-4 mr-2 text-blue-600" />
              AI Video Meeting
            </Button>
          </div>
          
          {/* AI Recommended Actions */}
        <div className="pt-2 border-t">
          <SequenceEnrollmentDialog
            leadId={lead.id}
            leadName={`${lead.first_name} ${lead.last_name}`}
            trigger={
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Mail className="h-4 w-4" />
                Enroll in Sequence
              </Button>
            }
          />
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">AI Recommendations</p>
                <p className="text-xs text-muted-foreground">Smart actions for this lead</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {aiRecommendations.map((action) => {
                const Icon = action.icon;
                const isExecuting = executingAction === action.id;
                const isCompleted = completedActions.has(action.id);
                
                return (
                  <TooltipProvider key={action.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`group relative p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                              action.color === 'green' ? 'bg-green-100 text-green-600' :
                              action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Icon className="h-4 w-4" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm truncate">{action.title}</p>
                                {action.priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs px-1.5 py-0">
                                    High
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Brain className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {action.confidence}% confidence
                                    </span>
                                  </div>
                                </div>
                                
                                <Button
                                  size="sm"
                                  variant={isCompleted ? "secondary" : "default"}
                                  className={`h-7 px-3 text-xs ${
                                    action.color === 'blue' && !isCompleted ? 'bg-blue-600 hover:bg-blue-700' :
                                    action.color === 'green' && !isCompleted ? 'bg-green-600 hover:bg-green-700' :
                                    action.color === 'purple' && !isCompleted ? 'bg-purple-600 hover:bg-purple-700' :
                                    action.color === 'orange' && !isCompleted ? 'bg-orange-600 hover:bg-orange-700' : ''
                                  }`}
                                  onClick={() => !isCompleted && executeAIAction(action.id, action.title)}
                                  disabled={isExecuting || isCompleted}
                                >
                                  {isExecuting ? (
                                    <div className="flex items-center gap-1">
                                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                      <span>Running...</span>
                                    </div>
                                  ) : isCompleted ? (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      <span>Done</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <Send className="h-3 w-3" />
                                      <span>Execute</span>
                                    </div>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress bar for high priority items */}
                          {action.priority === 'high' && !isCompleted && (
                            <div className="mt-2">
                              <Progress value={action.confidence} className="h-1" />
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium">{action.title}</p>
                          <p className="text-xs">{action.description}</p>
                          <p className="text-xs text-muted-foreground">
                            AI Confidence: {action.confidence}%
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
            
            {/* Action Summary */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {completedActions.size} of {aiRecommendations.length} actions completed
                </span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span className="text-muted-foreground">AI Monitoring</span>
                </div>
              </div>
              <Progress 
                value={(completedActions.size / aiRecommendations.length) * 100} 
                className="mt-2 h-1" 
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          AI Insights
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">AI Score</span>
              <span className="text-lg font-bold text-primary">{aiScore.toFixed(1)}</span>
            </div>
            <Progress value={aiScore * 10} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {aiScore >= 8 ? 'High conversion potential' : 
               aiScore >= 6 ? 'Good potential' : 
               aiScore >= 4 ? 'Moderate potential' : 'Needs nurturing'}
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Engagement</span>
              <span className="text-sm font-semibold">{engagementScore}%</span>
            </div>
            <Progress value={engagementScore} className="h-2" />
          </div>
        </div>
      </div>

      {/* Student Flags */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-orange-500" />
          Student Status
        </h3>
        <div className="space-y-2">
          {studentFlags.map((flag, index) => {
            const Icon = flag.icon;
            return (
              <div key={index} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${flag.type === 'success' ? 'text-green-500' : 'text-blue-500'}`} />
                <Badge variant={flag.type === 'success' ? 'default' : 'secondary'} className="text-xs">
                  {flag.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Suggested Sequences */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <Star className="h-3 w-3 text-white" />
            </div>
            Smart Sequences
          </h3>
          <Badge variant="secondary" className="text-xs">
            {enrolledSequences.size} Active
          </Badge>
        </div>
        
        <div className="space-y-3">
          {availableSequences.map((sequence) => {
            const isEnrolling = enrollingSequence === sequence.id;
            const isEnrolled = enrolledSequences.has(sequence.id);
            const isExpanded = showSequenceDetails === sequence.id;
            
            return (
              <div key={sequence.id} className={`group rounded-lg border transition-all duration-200 ${
                isEnrolled 
                  ? 'bg-green-50 border-green-200 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold">{sequence.name}</h4>
                        <Badge 
                          variant={sequence.type === 'deadline-driven' ? 'destructive' : 'outline'} 
                          className="text-xs px-2 py-0"
                        >
                          {sequence.type.replace('-', ' ')}
                        </Badge>
                        {isEnrolled && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{sequence.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{sequence.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{sequence.emails} emails</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{sequence.conversionRate}% conv.</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-3">
                      {isEnrolled ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => unenrollFromSequence(sequence.id, sequence.name)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                          onClick={() => enrollInSequence(sequence.id, sequence.name)}
                          disabled={isEnrolling}
                        >
                          {isEnrolling ? (
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                              <span>Enrolling...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              <span>Enroll</span>
                            </div>
                          )}
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                        onClick={() => setShowSequenceDetails(isExpanded ? null : sequence.id)}
                      >
                        {isExpanded ? (
                          <div className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3 rotate-90 transition-transform" />
                            <span>Less</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3 transition-transform" />
                            <span>Details</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="animate-fade-in border-t pt-3 mt-3 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-sm font-semibold text-blue-600">{sequence.openRate}%</div>
                          <div className="text-xs text-muted-foreground">Open Rate</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-sm font-semibold text-green-600">{sequence.clickRate}%</div>
                          <div className="text-xs text-muted-foreground">Click Rate</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-sm font-semibold text-purple-600">{sequence.conversionRate}%</div>
                          <div className="text-xs text-muted-foreground">Conversion</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium mb-2">Tags:</div>
                        <div className="flex flex-wrap gap-1">
                          {sequence.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {isEnrolled && (
                        <div className="p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 text-xs text-green-700">
                            <Activity className="h-3 w-3" />
                            <span>Lead is actively enrolled in this sequence</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Progress indicator for enrolled sequences */}
                {isEnrolled && (
                  <div className="px-4 pb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Sequence Progress</span>
                      <span>2 of {sequence.emails} sent</span>
                    </div>
                    <Progress value={(2 / sequence.emails) * 100} className="h-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Sequence Summary */}
        <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="font-medium">AI Optimization</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Active Learning
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Sequences are automatically optimized based on lead behavior and engagement patterns.
          </p>
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
            <Label className="text-xs text-muted-foreground">Intake Date</Label>
            <p className="mt-1 text-sm">September 2024</p>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Payment Plan</Label>
            <p className="mt-1 text-sm">Full Payment Preferred</p>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Created</Label>
            <p className="mt-1 text-sm">
              {new Date(lead.created_at).toLocaleDateString()}
            </p>
          </div>
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

      {/* AI Video Modal */}
      <AIVideoModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        leadName={`${lead.first_name} ${lead.last_name}`}
        leadEmail={lead.email}
      />
    </div>
  );
}
