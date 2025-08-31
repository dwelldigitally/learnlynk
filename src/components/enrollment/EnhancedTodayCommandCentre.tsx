import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSegmentSelection } from '@/hooks/useSegmentSelection';

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
import { SmartActionsConfiguration } from './SmartActionsConfiguration';
import { EnhancedBulkActionsToolbar } from './EnhancedBulkActionsToolbar';
// Modern components
import { ExpandableCard } from '../modern/ExpandableCard';
import { SmartActionsHub } from '../modern/SmartActionsHub';
import { EnhancedProductivityDashboard } from '../modern/EnhancedProductivityDashboard';

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
  const [loading, setLoading] = useState(false);
  const [showConfiguration, setShowConfiguration] = useState(false);
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
  
  // Bulk selection for each widget type
  const callsSelection = useSegmentSelection();
  const communicationsSelection = useSegmentSelection();
  const hotProspectsSelection = useSegmentSelection();
  const documentReviewsSelection = useSegmentSelection();
  const overdueUrgentSelection = useSegmentSelection();
  const conversionOpsSelection = useSegmentSelection();
  
  const { toast } = useToast();

  useEffect(() => {
    loadConversionMetrics();
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
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
        description: "Failed to load actions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load conversion metrics and actions

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

      // Actions are automatically updated via real-time subscription
      
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

  // Debug logging for categorized actions
  console.log('📊 Categorized actions:', {
    total: filteredActions.length,
    calls: categorizedActions.calls.length,
    callsData: categorizedActions.calls.map(a => ({ id: a.id, type: a.action_type, student: a.metadata?.student_name }))
  });

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

      {/* Enhanced AI Productivity Dashboard */}
      <div className="mb-6">
        <EnhancedProductivityDashboard />
      </div>

      {/* Smart Actions Hub */}
      <div className="mb-6">
        {showConfiguration ? (
          <SmartActionsConfiguration />
        ) : (
          <SmartActionsHub 
            onConfigurationClick={() => setShowConfiguration(true)}
          />
        )}
      </div>

      {showConfiguration && (
        <div className="mb-6 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => setShowConfiguration(false)}
          >
            Back to Actions
          </Button>
        </div>
      )}

      {/* Enhanced Task Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpandableCard
          title="Hot Prospects"
          subtitle="High-value opportunities requiring immediate attention"
          icon={<Flame className="h-5 w-5" />}
          count={categorizedActions.hotProspects.length}
          priority="urgent"
          defaultExpanded={categorizedActions.hotProspects.length > 0}
          className="animate-stagger-1"
        >
          <HotProspectsWidget 
            actions={categorizedActions.hotProspects}
            onCompleteAction={handleCompleteAction}
            selectedItems={hotProspectsSelection.selectedItems}
            onToggleItem={hotProspectsSelection.toggleItem}
            onToggleAll={hotProspectsSelection.toggleAll}
            showBulkActions={true}
          />
        </ExpandableCard>
        
        <ExpandableCard
          title="Calls to Make"
          subtitle="Priority phone calls and check-ins"
          icon={<Phone className="h-5 w-5" />}
          count={categorizedActions.calls.length}
          priority="high"
          defaultExpanded={categorizedActions.calls.length > 0}
          className="animate-stagger-2"
        >
          <CallsToMakeWidget 
            actions={categorizedActions.calls}
            onCompleteAction={handleCompleteAction}
            selectedItems={callsSelection.selectedItems}
            onToggleItem={callsSelection.toggleItem}
            onToggleAll={callsSelection.toggleAll}
            showBulkActions={true}
          />
        </ExpandableCard>
        
        <ExpandableCard
          title="Communications"
          subtitle="Emails, messages, and follow-ups"
          icon={<Mail className="h-5 w-5" />}
          count={categorizedActions.communications.length}
          priority="medium"
          defaultExpanded={categorizedActions.communications.length > 0}
          className="animate-stagger-3"
        >
          <CommunicationsWidget 
            actions={categorizedActions.communications}
            onCompleteAction={handleCompleteAction}
            selectedItems={communicationsSelection.selectedItems}
            onToggleItem={communicationsSelection.toggleItem}
            onToggleAll={communicationsSelection.toggleAll}
            showBulkActions={true}
          />
        </ExpandableCard>
        
        <ExpandableCard
          title="Document Reviews"
          subtitle="Applications and documents requiring review"
          icon={<FileText className="h-5 w-5" />}
          count={categorizedActions.documentReviews.length}
          priority="medium"
          defaultExpanded={categorizedActions.documentReviews.length > 0}
          className="animate-stagger-4"
        >
          <DocumentReviewsWidget 
            actions={categorizedActions.documentReviews}
            onCompleteAction={handleCompleteAction}
            selectedItems={documentReviewsSelection.selectedItems}
            onToggleItem={documentReviewsSelection.toggleItem}
            onToggleAll={documentReviewsSelection.toggleAll}
            showBulkActions={true}
          />
        </ExpandableCard>
        
        <ExpandableCard
          title="Overdue & Urgent"
          subtitle="Time-sensitive tasks requiring immediate action"
          icon={<AlertCircle className="h-5 w-5" />}
          count={categorizedActions.overdueUrgent.length}
          priority="urgent"
          defaultExpanded={categorizedActions.overdueUrgent.length > 0}
          className="animate-stagger-5"
        >
          <OverdueUrgentWidget 
            actions={categorizedActions.overdueUrgent}
            onCompleteAction={handleCompleteAction}
            selectedItems={overdueUrgentSelection.selectedItems}
            onToggleItem={overdueUrgentSelection.toggleItem}
            onToggleAll={overdueUrgentSelection.toggleAll}
            showBulkActions={true}
          />
        </ExpandableCard>
        
        <ExpandableCard
          title="Conversion Opportunities"
          subtitle="High-potential leads ready for advancement"
          icon={<TrendingUp className="h-5 w-5" />}
          count={categorizedActions.conversionOps.length}
          priority="high"
          defaultExpanded={categorizedActions.conversionOps.length > 0}
          className="animate-stagger-1"
        >
          <ConversionOpportunitiesWidget 
            actions={categorizedActions.conversionOps}
            onCompleteAction={handleCompleteAction}
            selectedItems={conversionOpsSelection.selectedItems}
            onToggleItem={conversionOpsSelection.toggleItem}
            onToggleAll={conversionOpsSelection.toggleAll}
            showBulkActions={true}
          />
        </ExpandableCard>
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