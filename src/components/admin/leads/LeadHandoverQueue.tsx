import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, AlertTriangle, Users, TrendingUp } from "lucide-react";
import { HandoverService } from "@/services/handoverService";
import { useToast } from "@/hooks/use-toast";

interface QualifiedLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  lead_score: number;
  status: string;
  created_at: string;
  program_interest: string[];
  qualification: {
    isQualified: boolean;
    qualificationScore: number;
    missingRequirements: string[];
    recommendations: string[];
  };
}

export function LeadHandoverQueue() {
  const [qualifiedLeads, setQualifiedLeads] = useState<QualifiedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadHandoverQueue();
  }, []);

  const loadHandoverQueue = async () => {
    try {
      setLoading(true);
      const queue = await HandoverService.getHandoverQueue();
      setQualifiedLeads(queue);
    } catch (error) {
      console.error('Error loading handover queue:', error);
      toast({
        title: "Error",
        description: "Failed to load handover queue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToStudent = async (leadId: string) => {
    try {
      setProcessing(prev => [...prev, leadId]);
      const student = await HandoverService.createStudentFromLead(leadId);
      
      toast({
        title: "Success",
        description: `Lead converted to student ${student.student_id}`,
      });
      
      // Remove from queue
      setQualifiedLeads(prev => prev.filter(lead => lead.id !== leadId));
    } catch (error) {
      console.error('Error converting lead:', error);
      toast({
        title: "Error",
        description: "Failed to convert lead to student",
        variant: "destructive"
      });
    } finally {
      setProcessing(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleBulkConvert = async () => {
    try {
      const readyLeads = qualifiedLeads.filter(lead => lead.qualification.isQualified);
      const results = await HandoverService.processAutomaticConversions();
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      toast({
        title: "Bulk Conversion Complete",
        description: `${successful} leads converted successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      });
      
      await loadHandoverQueue();
    } catch (error) {
      console.error('Error in bulk conversion:', error);
      toast({
        title: "Error",
        description: "Failed to process bulk conversions",
        variant: "destructive"
      });
    }
  };

  const getQualificationBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Almost Ready</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Work</Badge>;
  };

  const readyLeads = qualifiedLeads.filter(lead => lead.qualification.isQualified);
  const almostReadyLeads = qualifiedLeads.filter(lead => !lead.qualification.isQualified && lead.qualification.qualificationScore >= 60);
  const needsWorkLeads = qualifiedLeads.filter(lead => lead.qualification.qualificationScore < 60);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="h-64 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lead Handover Queue</h2>
          <p className="text-sm text-muted-foreground">
            Manage lead-to-student transitions and qualification workflow
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadHandoverQueue} variant="outline">
            Refresh Queue
          </Button>
          {readyLeads.length > 0 && (
            <Button onClick={handleBulkConvert} className="bg-green-600 hover:bg-green-700">
              Convert All Ready ({readyLeads.length})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Ready for Conversion</p>
              <p className="text-2xl font-bold text-foreground">{readyLeads.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Almost Ready</p>
              <p className="text-2xl font-bold text-foreground">{almostReadyLeads.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Needs Work</p>
              <p className="text-2xl font-bold text-foreground">{needsWorkLeads.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total in Queue</p>
              <p className="text-2xl font-bold text-foreground">{qualifiedLeads.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Queue View */}
      <Tabs defaultValue="ready" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ready">Ready for Conversion ({readyLeads.length})</TabsTrigger>
          <TabsTrigger value="almost">Almost Ready ({almostReadyLeads.length})</TabsTrigger>
          <TabsTrigger value="needs-work">Needs Work ({needsWorkLeads.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ready" className="space-y-4">
          {readyLeads.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No leads ready for conversion</h3>
                  <p className="text-sm text-muted-foreground">Check back later or review leads in other categories</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {readyLeads.map((lead) => (
                <LeadQueueCard 
                  key={lead.id} 
                  lead={lead} 
                  onConvert={handleConvertToStudent}
                  isProcessing={processing.includes(lead.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="almost" className="space-y-4">
          {almostReadyLeads.map((lead) => (
            <LeadQueueCard 
              key={lead.id} 
              lead={lead} 
              onConvert={handleConvertToStudent}
              isProcessing={processing.includes(lead.id)}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="needs-work" className="space-y-4">
          {needsWorkLeads.map((lead) => (
            <LeadQueueCard 
              key={lead.id} 
              lead={lead} 
              onConvert={handleConvertToStudent}
              isProcessing={processing.includes(lead.id)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface LeadQueueCardProps {
  lead: QualifiedLead;
  onConvert: (leadId: string) => void;
  isProcessing: boolean;
}

function LeadQueueCard({ lead, onConvert, isProcessing }: LeadQueueCardProps) {
  const daysInPipeline = Math.floor(
    (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {lead.first_name} {lead.last_name}
            </CardTitle>
            <CardDescription>{lead.email}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getQualificationBadge(lead.qualification.qualificationScore)}
            <Badge variant="outline">{lead.status}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Qualification Score</span>
          <span className="font-medium">{lead.qualification.qualificationScore}%</span>
        </div>
        
        <Progress value={lead.qualification.qualificationScore} className="h-2" />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Lead Score:</span>
            <span className="ml-2 font-medium">{lead.lead_score}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Days in Pipeline:</span>
            <span className="ml-2 font-medium">{daysInPipeline}</span>
          </div>
        </div>
        
        {lead.program_interest && lead.program_interest.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Program Interest:</span>
            <div className="flex gap-1 mt-1">
              {lead.program_interest.map((program, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {program}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {lead.qualification.missingRequirements.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Missing Requirements:</span>
            <ul className="mt-1 space-y-1">
              {lead.qualification.missingRequirements.map((req, index) => (
                <li key={index} className="text-red-600 text-xs">• {req}</li>
              ))}
            </ul>
          </div>
        )}
        
        {lead.qualification.recommendations.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Recommendations:</span>
            <ul className="mt-1 space-y-1">
              {lead.qualification.recommendations.map((rec, index) => (
                <li key={index} className="text-blue-600 text-xs">• {rec}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`/admin/leads?id=${lead.id}`, '_blank')}
          >
            View Lead
          </Button>
          {lead.qualification.isQualified && (
            <Button 
              onClick={() => onConvert(lead.id)}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              {isProcessing ? 'Converting...' : 'Convert to Student'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getQualificationBadge(score: number) {
  if (score >= 80) return <Badge className="bg-green-100 text-green-800 border-green-200">Ready</Badge>;
  if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Almost Ready</Badge>;
  return <Badge className="bg-red-100 text-red-800 border-red-200">Needs Work</Badge>;
}