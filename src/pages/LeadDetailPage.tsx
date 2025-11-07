import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageSquare, FileText, Clock, Users, Route, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lead, LeadStatus } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { EnhancedLeadSidebar } from '@/components/admin/leads/EnhancedLeadSidebar';
import { EnhancedRightSidebar } from '@/components/admin/leads/EnhancedRightSidebar';
import { AgenticAIIndicator } from '@/components/admin/leads/AgenticAIIndicator';

import { CommunicationHub } from '@/components/admin/leads/CommunicationHub';
import { DocumentsSection } from '@/components/admin/leads/DocumentsSection';
import { SegmentedTimeline } from '@/components/admin/leads/SegmentedTimeline';
import { TasksAndNotes } from '@/components/admin/leads/TasksAndNotes';
import { TopNavigationBar } from '@/components/admin/TopNavigationBar';
import { AcademicJourneyTracker } from '@/components/admin/leads/AcademicJourneyTracker';
import { AIPlaysPanel } from '@/components/admin/leads/AIPlaysPanel';
import { AICommunicationDemo } from '@/components/admin/leads/AICommunicationDemo';

export default function LeadDetailPage() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('journey');

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
          <Button onClick={() => navigate('/admin/leads')}>
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNavigationBar 
        activeSection="leads" 
        onSectionChange={() => {}} 
      />
      
      {/* Header with back button and lead info */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/leads')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">
                {lead.first_name} {lead.last_name}
              </h1>
              <Badge className={getStatusColor(lead.status)}>
                {lead.status}
              </Badge>
              <AgenticAIIndicator 
                isAIManaged={lead.ai_managed || false}
                aiStatus={lead.ai_managed ? 'active' : undefined}
                onHumanTakeover={handleAITakeover}
                className="ml-2"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/admin/leads/test/${leadId}`)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
            >
              🧪 Try New Design
            </Button>
            <div className="text-sm text-muted-foreground">
              Lead Score: <span className="font-semibold text-foreground">{lead.lead_score}</span>
            </div>
          </div>
        </div>
      </div>
      

      {/* Three-column layout */}
      <div className="flex">
        {/* Left Sidebar - Enhanced Lead Details with AI Insights */}
        <EnhancedLeadSidebar lead={lead} onUpdate={loadLead} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="journey" className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Journey
                </TabsTrigger>
                <TabsTrigger value="ai-plays" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI Plays
                </TabsTrigger>
                <TabsTrigger value="communication" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Communication
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tasks & Notes
                </TabsTrigger>
              </TabsList>

              <div className="flex-1">
                <TabsContent value="journey" className="m-0">
                  <AcademicJourneyTracker lead={lead} onUpdate={loadLead} />
                </TabsContent>

                <TabsContent value="ai-plays" className="m-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    <AIPlaysPanel lead={lead} onUpdate={loadLead} />
                    <AICommunicationDemo lead={lead} />
                  </div>
                </TabsContent>

                <TabsContent value="communication" className="m-0">
                  <CommunicationHub lead={lead} onUpdate={loadLead} />
                </TabsContent>

                <TabsContent value="documents" className="m-0">
                  <DocumentsSection lead={lead} onUpdate={loadLead} />
                </TabsContent>

                <TabsContent value="timeline" className="m-0">
                  <SegmentedTimeline 
                    leadId={lead.id}
                    communications={[]}
                    tasks={[]}
                    notes={[]}
                  />
                </TabsContent>

                <TabsContent value="tasks" className="m-0">
                  <TasksAndNotes lead={lead} onUpdate={loadLead} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        
        {/* Right Sidebar - Aircall History & Appointments */}
        <EnhancedRightSidebar lead={lead} />
      </div>
    </div>
  );
}