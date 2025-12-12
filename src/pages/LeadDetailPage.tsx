import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, MessageSquare, FileText, Clock, Users, Route, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lead, LeadStatus } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { EnhancedLeadSidebar } from '@/components/admin/leads/EnhancedLeadSidebar';
import { EnhancedRightSidebar } from '@/components/admin/leads/EnhancedRightSidebar';
import { AgenticAIIndicator } from '@/components/admin/leads/AgenticAIIndicator';
import { MobileLeadInfoSheet } from '@/components/admin/leads/MobileLeadInfoSheet';

import { CommunicationHub } from '@/components/admin/leads/CommunicationHub';
import { DocumentsSection } from '@/components/admin/leads/DocumentsSection';
import { ComprehensiveTimeline } from '@/components/admin/leads/ComprehensiveTimeline';
import { TasksAndNotes } from '@/components/admin/leads/TasksAndNotes';
import { TopNavigationBar } from '@/components/admin/TopNavigationBar';
import { AcademicJourneyTracker } from '@/components/admin/leads/AcademicJourneyTracker';
import { AIPlaysPanel } from '@/components/admin/leads/AIPlaysPanel';
import { AICommunicationDemo } from '@/components/admin/leads/AICommunicationDemo';

import { PastelBadge, PillButton, PillIconButton, getLeadStatusColor, HotSheetTabsList, HotSheetTabsTrigger } from '@/components/hotsheet';

export default function LeadDetailPage() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('journey');
  const [timelineRefreshTrigger, setTimelineRefreshTrigger] = useState(0);
  const [timelineFilter, setTimelineFilter] = useState('all');

  const triggerTimelineRefresh = () => setTimelineRefreshTrigger(prev => prev + 1);

  // UUID validation function
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    if (leadId) {
      loadLead();
    }
  }, [leadId, navigate]);

  const loadLead = async () => {
    if (!leadId) {
      console.log('❌ No leadId found');
      return;
    }
    
    console.log('🔍 Loading lead with ID:', leadId);
    
    try {
      setLoading(true);
      console.log('📡 Calling LeadService.getLeadById...');
      const { data: leadData, error } = await LeadService.getLeadById(leadId);
      console.log('📊 Lead data received:', leadData);
      
      if (leadData) {
        setLead(leadData);
        console.log('✅ Lead set successfully');
      } else {
        console.log('❌ No lead data returned');
        toast({
          title: 'Error',
          description: 'Lead not found',
          variant: 'destructive'
        });
        navigate('/admin/leads');
      }
    } catch (error) {
      console.log('❌ Error loading lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lead',
        variant: 'destructive'
      });
      navigate('/admin/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleAITakeover = async () => {
    if (!lead?.id) return;
    
    try {
      await LeadService.removeAIAgentFromLead(lead.id);
      await loadLead(); // Reload to get updated data
      toast({
        title: "AI Takeover Successful",
        description: "You have taken over this lead from the AI agent."
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to take over from AI agent.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Lead not found</h2>
          <PillButton onClick={() => navigate('/admin/leads')}>
            Back to Leads
          </PillButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNavigationBar />
      
      {/* Header with back button and lead info */}
      <div className="border-b border-border/40 bg-card px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <PillButton 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin/leads')}
              className="min-h-[44px]"
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Back to Leads</span>
            </PillButton>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                {lead.first_name} {lead.last_name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <PastelBadge color={getLeadStatusColor(lead.status)} dot>
                  {lead.status}
                </PastelBadge>
                <AgenticAIIndicator 
                  isAIManaged={lead.ai_managed || false}
                  aiStatus={lead.ai_managed ? 'active' : undefined}
                  onHumanTakeover={handleAITakeover}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <PillButton 
              variant="soft" 
              size="sm" 
              onClick={() => navigate(`/admin/leads/test/${leadId}`)}
              className="hidden sm:inline-flex"
            >
              🧪 Try New Design
            </PillButton>
            <PastelBadge color="primary" size="lg">
              Score: {lead.lead_score}
            </PastelBadge>
          </div>
        </div>
      </div>
      

      {/* Layout - Three columns on desktop, single column on mobile */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <EnhancedLeadSidebar lead={lead} onUpdate={() => { loadLead(); triggerTimelineRefresh(); }} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
              <HotSheetTabsList className="flex overflow-x-auto md:grid md:grid-cols-6 mb-6 w-full">
                <HotSheetTabsTrigger value="journey" icon={<Route className="h-4 w-4" />}>
                  <span className="hidden sm:inline">Journey</span>
                </HotSheetTabsTrigger>
                <HotSheetTabsTrigger value="ai-plays" icon={<Bot className="h-4 w-4" />}>
                  <span className="hidden sm:inline">AI Plays</span>
                </HotSheetTabsTrigger>
                <HotSheetTabsTrigger value="communication" icon={<MessageSquare className="h-4 w-4" />}>
                  <span className="hidden sm:inline">Communication</span>
                </HotSheetTabsTrigger>
                <HotSheetTabsTrigger value="documents" icon={<FileText className="h-4 w-4" />}>
                  <span className="hidden sm:inline">Documents</span>
                </HotSheetTabsTrigger>
                <HotSheetTabsTrigger value="timeline" icon={<Clock className="h-4 w-4" />}>
                  <span className="hidden sm:inline">Activity</span>
                </HotSheetTabsTrigger>
                <HotSheetTabsTrigger value="tasks" icon={<Users className="h-4 w-4" />}>
                  <span className="hidden sm:inline">Tasks</span>
                </HotSheetTabsTrigger>
              </HotSheetTabsList>

              <div className="flex-1">
                <TabsContent value="journey" className="m-0">
                  <AcademicJourneyTracker lead={lead} onUpdate={() => { loadLead(); triggerTimelineRefresh(); }} />
                </TabsContent>

                <TabsContent value="ai-plays" className="m-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    <AIPlaysPanel lead={lead} onUpdate={() => { loadLead(); triggerTimelineRefresh(); }} />
                    <AICommunicationDemo lead={lead} />
                  </div>
                </TabsContent>

                <TabsContent value="communication" className="m-0">
                  <CommunicationHub lead={lead} onUpdate={() => { loadLead(); triggerTimelineRefresh(); }} />
                </TabsContent>

                <TabsContent value="documents" className="m-0">
                  <DocumentsSection lead={lead} onUpdate={() => { loadLead(); triggerTimelineRefresh(); }} />
                </TabsContent>

                <TabsContent value="timeline" className="m-0">
                  <ComprehensiveTimeline 
                    leadId={lead.id}
                    filter={timelineFilter}
                    onFilterChange={setTimelineFilter}
                    refreshTrigger={timelineRefreshTrigger}
                  />
                </TabsContent>

                <TabsContent value="tasks" className="m-0">
                  <TasksAndNotes lead={lead} onUpdate={() => { loadLead(); triggerTimelineRefresh(); }} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        
        {/* Right Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <EnhancedRightSidebar lead={lead} />
        </div>
      </div>

      {/* Mobile FAB + Bottom Sheet */}
      <div className="lg:hidden">
        <MobileLeadInfoSheet lead={lead} onUpdate={() => { loadLead(); triggerTimelineRefresh(); }}>
          <PillIconButton
            icon={<User className="h-6 w-6" />}
            size="lg"
            variant="primary"
            className="fixed bottom-6 right-6 h-14 w-14 shadow-lg z-50"
            label="View lead info"
          />
        </MobileLeadInfoSheet>
      </div>
    </div>
  );
}