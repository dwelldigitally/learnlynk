import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSegmentSelection } from '@/hooks/useSegmentSelection';
import { ModernCard } from '@/components/modern/ModernCard';
import { PageHeader } from '@/components/modern/PageHeader';

import { supabase } from '@/integrations/supabase/client';
import { 
  Phone, Mail, FileText, Clock, 
  Star, Zap, TrendingUp, AlertCircle, Search,
  DollarSign, Users, Award, Flame, CheckCircle2
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
  const [metrics, setMetrics] = useState<ConversionMetrics>({
    leadToApplicant: 0,
    applicantToEnrolled: 0,
    revenueImpact: 0,
    conversionMomentum: 0
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
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

  const loadConversionMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
      
      toast({
        title: "Action completed",
        description: "Progress tracked successfully",
      });

      loadActions();
    } catch (error) {
      console.error('Error completing action:', error);
      toast({
        title: "Error",
        description: "Failed to complete action",
        variant: "destructive",
      });
    }
  };

  const filteredActions = actions.filter(action => {
    const matchesSearch = !searchQuery || 
      action.metadata?.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.instruction.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

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

  const totalActions = filteredActions.length;
  const urgentCount = categorizedActions.overdueUrgent.length;
  const highValueCount = categorizedActions.hotProspects.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
    <div className="space-y-8">
      <PageHeader 
        title="Today's Command Center"
        subtitle="Prioritized actions and opportunities for maximum impact"
      />
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ModernCard className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Actions</p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalActions}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </ModernCard>

        <ModernCard className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Urgent</p>
                <p className="text-3xl font-bold text-destructive mt-2">{urgentCount}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
            </div>
          </CardContent>
        </ModernCard>

        <ModernCard className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">High Value</p>
                <p className="text-3xl font-bold text-primary mt-2">{highValueCount}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </ModernCard>

        <ModernCard className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Revenue Impact</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  ${(metrics.revenueImpact / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-foreground" />
              </div>
            </div>
          </CardContent>
        </ModernCard>
      </div>

      {/* Search Bar */}
      <ModernCard>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </ModernCard>

      {/* Actions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 h-auto p-1">
          <TabsTrigger value="all" className="flex-col h-auto py-3 gap-1">
            <span className="text-xs font-medium">All</span>
            <Badge variant="secondary" className="text-xs">{totalActions}</Badge>
          </TabsTrigger>
          <TabsTrigger value="urgent" className="flex-col h-auto py-3 gap-1">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Urgent</span>
            <Badge variant="destructive" className="text-xs">{urgentCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="hot" className="flex-col h-auto py-3 gap-1">
            <Flame className="h-4 w-4" />
            <span className="text-xs font-medium">Hot</span>
            <Badge variant="secondary" className="text-xs">{categorizedActions.hotProspects.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex-col h-auto py-3 gap-1">
            <Phone className="h-4 w-4" />
            <span className="text-xs font-medium">Calls</span>
            <Badge variant="secondary" className="text-xs">{categorizedActions.calls.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="comms" className="flex-col h-auto py-3 gap-1">
            <Mail className="h-4 w-4" />
            <span className="text-xs font-medium">Comms</span>
            <Badge variant="secondary" className="text-xs">{categorizedActions.communications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex-col h-auto py-3 gap-1">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-medium">Docs</span>
            <Badge variant="secondary" className="text-xs">{categorizedActions.documentReviews.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="conversion" className="flex-col h-auto py-3 gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Convert</span>
            <Badge variant="secondary" className="text-xs">{categorizedActions.conversionOps.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-8 space-y-6">
          {urgentCount > 0 && (
            <OverdueUrgentWidget 
              actions={categorizedActions.overdueUrgent}
              onCompleteAction={handleCompleteAction}
              selectedItems={overdueUrgentSelection.selectedItems}
              onToggleItem={overdueUrgentSelection.toggleItem}
              onToggleAll={overdueUrgentSelection.toggleAll}
              showBulkActions={true}
            />
          )}

          {highValueCount > 0 && (
            <HotProspectsWidget 
              actions={categorizedActions.hotProspects}
              onCompleteAction={handleCompleteAction}
              selectedItems={hotProspectsSelection.selectedItems}
              onToggleItem={hotProspectsSelection.toggleItem}
              onToggleAll={hotProspectsSelection.toggleAll}
              showBulkActions={true}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categorizedActions.calls.length > 0 && (
              <CallsToMakeWidget 
                actions={categorizedActions.calls}
                onCompleteAction={handleCompleteAction}
                selectedItems={callsSelection.selectedItems}
                onToggleItem={callsSelection.toggleItem}
                onToggleAll={callsSelection.toggleAll}
                showBulkActions={true}
              />
            )}

            {categorizedActions.communications.length > 0 && (
              <CommunicationsWidget 
                actions={categorizedActions.communications}
                onCompleteAction={handleCompleteAction}
                selectedItems={communicationsSelection.selectedItems}
                onToggleItem={communicationsSelection.toggleItem}
                onToggleAll={communicationsSelection.toggleAll}
                showBulkActions={true}
              />
            )}

            {categorizedActions.documentReviews.length > 0 && (
              <DocumentReviewsWidget 
                actions={categorizedActions.documentReviews}
                onCompleteAction={handleCompleteAction}
                selectedItems={documentReviewsSelection.selectedItems}
                onToggleItem={documentReviewsSelection.toggleItem}
                onToggleAll={documentReviewsSelection.toggleAll}
                showBulkActions={true}
              />
            )}

            {categorizedActions.conversionOps.length > 0 && (
              <ConversionOpportunitiesWidget 
                actions={categorizedActions.conversionOps}
                onCompleteAction={handleCompleteAction}
                selectedItems={conversionOpsSelection.selectedItems}
                onToggleItem={conversionOpsSelection.toggleItem}
                onToggleAll={conversionOpsSelection.toggleAll}
                showBulkActions={true}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="urgent" className="mt-6">
          <Card className="border-destructive/50">
            <CardContent className="p-6">
              <OverdueUrgentWidget 
                actions={categorizedActions.overdueUrgent}
                onCompleteAction={handleCompleteAction}
                selectedItems={overdueUrgentSelection.selectedItems}
                onToggleItem={overdueUrgentSelection.toggleItem}
                onToggleAll={overdueUrgentSelection.toggleAll}
                showBulkActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hot" className="mt-6">
          <Card className="border-primary/30">
            <CardContent className="p-6">
              <HotProspectsWidget 
                actions={categorizedActions.hotProspects}
                onCompleteAction={handleCompleteAction}
                selectedItems={hotProspectsSelection.selectedItems}
                onToggleItem={hotProspectsSelection.toggleItem}
                onToggleAll={hotProspectsSelection.toggleAll}
                showBulkActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calls" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <CallsToMakeWidget 
                actions={categorizedActions.calls}
                onCompleteAction={handleCompleteAction}
                selectedItems={callsSelection.selectedItems}
                onToggleItem={callsSelection.toggleItem}
                onToggleAll={callsSelection.toggleAll}
                showBulkActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comms" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <CommunicationsWidget 
                actions={categorizedActions.communications}
                onCompleteAction={handleCompleteAction}
                selectedItems={communicationsSelection.selectedItems}
                onToggleItem={communicationsSelection.toggleItem}
                onToggleAll={communicationsSelection.toggleAll}
                showBulkActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <DocumentReviewsWidget 
                actions={categorizedActions.documentReviews}
                onCompleteAction={handleCompleteAction}
                selectedItems={documentReviewsSelection.selectedItems}
                onToggleItem={documentReviewsSelection.toggleItem}
                onToggleAll={documentReviewsSelection.toggleAll}
                showBulkActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <ConversionOpportunitiesWidget 
                actions={categorizedActions.conversionOps}
                onCompleteAction={handleCompleteAction}
                selectedItems={conversionOpsSelection.selectedItems}
                onToggleItem={conversionOpsSelection.toggleItem}
                onToggleAll={conversionOpsSelection.toggleAll}
                showBulkActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
