import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Phone, Mail, MessageSquare, Calendar, FileText, DollarSign, Settings, Brain, Target, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lead, LeadStatus } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { AIScoreCard } from '@/components/admin/leads/AIScoreCard';
import { SmartAdvisorMatch } from '@/components/admin/leads/SmartAdvisorMatch';
import { AIInsightsPanel } from '@/components/admin/leads/AIInsightsPanel';
import { UrgencyIndicator } from '@/components/admin/leads/UrgencyIndicator';
import { RecommendedActions } from '@/components/admin/leads/RecommendedActions';
import { BasicLeadInfo } from '@/components/admin/leads/BasicLeadInfo';
import { ProgramInterest } from '@/components/admin/leads/ProgramInterest';
import { DocumentsSection } from '@/components/admin/leads/DocumentsSection';
import { CommunicationHub } from '@/components/admin/leads/CommunicationHub';
import { ActivityTimeline } from '@/components/admin/leads/ActivityTimeline';
import { TasksAndNotes } from '@/components/admin/leads/TasksAndNotes';
import { PaymentsContracts } from '@/components/admin/leads/PaymentsContracts';
import { AdminPanel } from '@/components/admin/leads/AdminPanel';

export default function LeadDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    
    try {
      await LeadService.updateLeadStatus(lead.id, newStatus);
      setLead({ ...lead, status: newStatus });
      toast({
        title: 'Success',
        description: 'Lead status updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update lead status',
        variant: 'destructive'
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
          <Button onClick={() => navigate('/admin/leads')}>
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/leads')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leads
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{lead.first_name} {lead.last_name}</h1>
                <p className="text-muted-foreground">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <UrgencyIndicator lead={lead} />
              <Badge variant={lead.status === 'converted' ? 'default' : 'secondary'}>
                {lead.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Enhanced Features Section */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <AIScoreCard lead={lead} />
          <SmartAdvisorMatch lead={lead} />
          <AIInsightsPanel lead={lead} />
          <RecommendedActions lead={lead} onAction={loadLead} />
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="ai">AI Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BasicLeadInfo lead={lead} onUpdate={loadLead} />
              <ProgramInterest lead={lead} onUpdate={loadLead} />
            </div>
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationHub lead={lead} onUpdate={loadLead} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsSection lead={lead} onUpdate={loadLead} />
          </TabsContent>

          <TabsContent value="timeline">
            <ActivityTimeline lead={lead} />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksAndNotes lead={lead} onUpdate={loadLead} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsContracts lead={lead} onUpdate={loadLead} />
          </TabsContent>

          <TabsContent value="admin">
            <AdminPanel lead={lead} onUpdate={loadLead} onStatusChange={handleStatusChange} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIScoreCard lead={lead} expanded />
              <AIInsightsPanel lead={lead} expanded />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}