import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSegmentSelection } from '@/hooks/useSegmentSelection';

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
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Actions</p>
                <p className="text-3xl font-bold text-foreground mt-1">{totalActions}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-3xl font-bold text-destructive mt-1">{urgentCount}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Value</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{highValueCount}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Impact</p>
                <p className="text-3xl font-bold text-success mt-1">
                  ${(metrics.revenueImpact / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
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
      </Card>

      {/* Actions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">{totalActions}</Badge>
          </TabsTrigger>
          <TabsTrigger value="urgent">
            <AlertCircle className="h-4 w-4 mr-1" />
            Urgent
            <Badge variant="destructive" className="ml-2">{urgentCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="hot">
            <Flame className="h-4 w-4 mr-1" />
            Hot
            <Badge variant="secondary" className="ml-2">{categorizedActions.hotProspects.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="calls">
            <Phone className="h-4 w-4 mr-1" />
            Calls
            <Badge variant="secondary" className="ml-2">{categorizedActions.calls.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="comms">
            <Mail className="h-4 w-4 mr-1" />
            Comms
            <Badge variant="secondary" className="ml-2">{categorizedActions.communications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="docs">
            <FileText className="h-4 w-4 mr-1" />
            Docs
            <Badge variant="secondary" className="ml-2">{categorizedActions.documentReviews.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="conversion">
            <TrendingUp className="h-4 w-4 mr-1" />
            Convert
            <Badge variant="secondary" className="ml-2">{categorizedActions.conversionOps.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {urgentCount > 0 && (
            <Card className="border-destructive/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Overdue & Urgent
                  <Badge variant="destructive">{urgentCount}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
          )}

          {highValueCount > 0 && (
            <Card className="border-amber-500/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-600" />
                  Hot Prospects
                  <Badge className="bg-amber-500">{highValueCount}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {categorizedActions.calls.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Calls to Make
                    <Badge variant="secondary">{categorizedActions.calls.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
            )}

            {categorizedActions.communications.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Communications
                    <Badge variant="secondary">{categorizedActions.communications.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
            )}

            {categorizedActions.documentReviews.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Reviews
                    <Badge variant="secondary">{categorizedActions.documentReviews.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
            )}

            {categorizedActions.conversionOps.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Conversion Opportunities
                    <Badge variant="secondary">{categorizedActions.conversionOps.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
          <Card className="border-amber-500/50">
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
