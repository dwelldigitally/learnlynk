import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageSquare, FileText, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lead, LeadStatus } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { LeadSidebar } from '@/components/admin/leads/LeadSidebar';
import { LeadRightSidebar } from '@/components/admin/leads/LeadRightSidebar';
import { CommunicationHub } from '@/components/admin/leads/CommunicationHub';
import { DocumentsSection } from '@/components/admin/leads/DocumentsSection';
import { ActivityTimeline } from '@/components/admin/leads/ActivityTimeline';
import { TasksAndNotes } from '@/components/admin/leads/TasksAndNotes';

export default function LeadDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('communication');

  // Extract leadId from pathname since we're not using proper route params
  const leadId = location.pathname.split('/').pop();
  console.log('🆔 Extracted leadId from pathname:', leadId);

  useEffect(() => {
    if (leadId) {
      loadLead();
    }
  }, [leadId]);

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
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Lead Details */}
      <LeadSidebar lead={lead} onUpdate={loadLead} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b bg-card px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/leads')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leads
              </Button>
              <div>
                <h1 className="text-xl font-bold">{lead.first_name} {lead.last_name}</h1>
                <p className="text-sm text-muted-foreground">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(lead.status)}>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Lead Score: <span className="font-semibold text-foreground">{lead.lead_score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
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
                  Timeline
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
                  <ActivityTimeline lead={lead} />
                </TabsContent>

                <TabsContent value="tasks" className="h-full m-0">
                  <TasksAndNotes lead={lead} onUpdate={loadLead} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - AI Insights */}
      <LeadRightSidebar lead={lead} />
    </div>
  );
}