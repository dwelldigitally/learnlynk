import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Phone, Mail, FileText, CheckCircle, Clock, User, GraduationCap, 
  Star, Zap, TrendingUp, AlertCircle, Filter, Search, Target,
  DollarSign, Calendar, MessageSquare, Users, Award, Flame
} from 'lucide-react';

// Widget components
import { HotProspectsWidget } from './widgets/HotProspectsWidget';
import { CallsToMakeWidget } from './widgets/CallsToMakeWidget';
import { CommunicationsWidget } from './widgets/CommunicationsWidget';
import { DocumentReviewsWidget } from './widgets/DocumentReviewsWidget';
import { OverdueUrgentWidget } from './widgets/OverdueUrgentWidget';
import { ConversionOpportunitiesWidget } from './widgets/ConversionOpportunitiesWidget';

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
    conversion_stage?: 'lead' | 'applicant' | 'enrolled';
    contact_info?: {
      email?: string;
      phone?: string;
      location?: string;
    };
    play_source?: string;
    revenue_potential?: number;
    // Journey/Play Traceability
    journey_id?: string;
    journey_name?: string;
    stage_id?: string;
    stage_name?: string;
    play_id?: string;
    play_name?: string;
    play_category?: string;
    generation_source?: 'journey-orchestrator' | 'standard-plays' | 'manual' | 'policy-trigger';
    journey_context?: boolean;
  };
}

interface ConversionMetrics {
  leadToApplicant: number;
  applicantToEnrolled: number;
  revenueImpact: number;
  conversionMomentum: number;
}

export function EnhancedTodayCommandCentre() {
  const [actions, setActions] = useState<StudentAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ConversionMetrics>({
    leadToApplicant: 0,
    applicantToEnrolled: 0,
    revenueImpact: 0,
    conversionMomentum: 0
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [yieldFilter, setYieldFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const { toast } = useToast();

  useEffect(() => {
    loadActions();
    loadConversionMetrics();
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

  const loadConversionMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mock conversion metrics - in real app, these would come from analytics
      setMetrics({
        leadToApplicant: 68,
        applicantToEnrolled: 45,
        revenueImpact: 85000,
        conversionMomentum: 12
      });
    } catch (error) {
      console.error('Error loading conversion metrics:', error);
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

      setActions(actions.filter(a => a.id !== actionId));
      
      toast({
        title: "Action completed! 🎉",
        description: "Great work! Progress tracked for conversion analytics.",
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

  // Filter actions based on current filters
  const filteredActions = actions.filter(action => {
    const matchesSearch = !searchQuery || 
      action.metadata?.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.instruction.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesYield = yieldFilter === 'all' || action.metadata?.yield_band === yieldFilter;
    
    const matchesUrgency = urgencyFilter === 'all' || 
      (urgencyFilter === 'overdue' && new Date(action.scheduled_at) < new Date()) ||
      (urgencyFilter === 'today' && new Date(action.scheduled_at).toDateString() === new Date().toDateString()) ||
      (urgencyFilter === 'urgent' && action.priority === 1);
    
    const matchesStage = stageFilter === 'all' || 
      action.metadata?.conversion_stage === stageFilter ||
      (stageFilter === 'journey' && action.metadata?.journey_context);
    
    const matchesType = typeFilter === 'all' || action.metadata?.generation_source === typeFilter;
    
    return matchesSearch && matchesYield && matchesUrgency && matchesStage && matchesType;
  });

  // Categorize actions for widgets
  const categorizedActions = {
    hotProspects: filteredActions.filter(a => 
      a.metadata?.yield_score && a.metadata.yield_score >= 70 && a.priority <= 2
    ),
    calls: filteredActions.filter(a => a.action_type === 'call'),
    communications: filteredActions.filter(a => 
      ['email', 'sms'].includes(a.action_type)
    ),
    documentReviews: filteredActions.filter(a => 
      ['review', 'document', 'application'].includes(a.action_type)
    ),
    overdueUrgent: filteredActions.filter(a => 
      new Date(a.scheduled_at) < new Date() || a.priority === 1
    ),
    conversionOps: filteredActions.filter(a => 
      a.metadata?.conversion_stage === 'applicant' || 
      a.reason_chips?.some(chip => chip.includes('deposit') || chip.includes('decision'))
    )
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

  return (
    <div className="space-y-6">
      {/* Conversion Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Lead → Applicant</p>
                <p className="text-2xl font-bold text-primary">{metrics.leadToApplicant}%</p>
                <p className="text-xs text-muted-foreground">conversion rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Applicant → Enrolled</p>
                <p className="text-2xl font-bold text-green-600">{metrics.applicantToEnrolled}%</p>
                <p className="text-xs text-muted-foreground">enrollment rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue Pipeline</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${(metrics.revenueImpact / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-muted-foreground">potential value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Conversion Momentum</p>
                <p className="text-2xl font-bold text-orange-500">{metrics.conversionMomentum}</p>
                <p className="text-xs text-muted-foreground">actions today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Smart Filters:</span>
            </div>
            
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students or actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={yieldFilter} onValueChange={setYieldFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Yield Band" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Yields</SelectItem>
                <SelectItem value="high">High Yield</SelectItem>
                <SelectItem value="medium">Medium Yield</SelectItem>
                <SelectItem value="low">Low Yield</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="applicant">Applicant</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="journey">Journey Active</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="journey-orchestrator">Journey</SelectItem>
                <SelectItem value="standard-plays">Standard</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setYieldFilter('all');
                setUrgencyFilter('all');
                setStageFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <HotProspectsWidget 
          actions={categorizedActions.hotProspects}
          onCompleteAction={handleCompleteAction}
        />
        
        <CallsToMakeWidget 
          actions={categorizedActions.calls}
          onCompleteAction={handleCompleteAction}
        />
        
        <CommunicationsWidget 
          actions={categorizedActions.communications}
          onCompleteAction={handleCompleteAction}
        />
        
        <DocumentReviewsWidget 
          actions={categorizedActions.documentReviews}
          onCompleteAction={handleCompleteAction}
        />
        
        <OverdueUrgentWidget 
          actions={categorizedActions.overdueUrgent}
          onCompleteAction={handleCompleteAction}
        />
        
        <ConversionOpportunitiesWidget 
          actions={categorizedActions.conversionOps}
          onCompleteAction={handleCompleteAction}
        />
      </div>

      {/* Summary Card */}
      {filteredActions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">All caught up! 🎉</h3>
            <p className="text-muted-foreground">
              No pending actions match your current filters. 
              Try adjusting your filters or check back later for new tasks.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {filteredActions.length} actions ready for conversion impact
                </span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {categorizedActions.hotProspects.length} high-value opportunities
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}