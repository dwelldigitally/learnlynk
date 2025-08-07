import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageSquare, FileText, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lead, LeadStatus } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { EnhancedLeadSidebar } from '@/components/admin/leads/EnhancedLeadSidebar';
import { EnhancedRightSidebar } from '@/components/admin/leads/EnhancedRightSidebar';
import { QuickActionBar } from '@/components/admin/leads/QuickActionBar';
import { CommunicationHub } from '@/components/admin/leads/CommunicationHub';
import { DocumentsSection } from '@/components/admin/leads/DocumentsSection';
import { SegmentedTimeline } from '@/components/admin/leads/SegmentedTimeline';
import { TasksAndNotes } from '@/components/admin/leads/TasksAndNotes';
import { TopNavigationBar } from '@/components/admin/TopNavigationBar';

export default function LeadDetailPage() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('communication');

  // UUID validation function
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    if (leadId) {
      // Check if leadId is a valid UUID, if not redirect to leads overview
      if (!isValidUUID(leadId)) {
        navigate('/admin/leads', { replace: true });
        return;
      }
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
      const leadData = await LeadService.getLeadById(leadId);
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
        onToggleMobileMenu={() => {}} 
      />
      
      {/* Header with back button and quick actions */}
      <div className="border-b bg-card px-6 py-2">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
        </div>
      </div>
      
      {/* Quick Action Bar */}
      <QuickActionBar lead={lead} onUpdate={loadLead} />

      {/* Three-column layout */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Sidebar - Enhanced Lead Details with AI Insights */}
        <EnhancedLeadSidebar lead={lead} onUpdate={loadLead} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 mb-6">
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

              <div className="flex-1 min-h-0">
                <TabsContent value="communication" className="h-full m-0">
                  <CommunicationHub lead={lead} onUpdate={loadLead} />
                </TabsContent>

                <TabsContent value="documents" className="h-full m-0">
                  <DocumentsSection lead={lead} onUpdate={loadLead} />
                </TabsContent>

                <TabsContent value="timeline" className="h-full m-0">
                  <SegmentedTimeline 
                    leadId={lead.id}
                    communications={[]}
                    tasks={[]}
                    notes={[]}
                  />
                </TabsContent>

                <TabsContent value="tasks" className="h-full m-0">
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