import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  FileCheck, 
  FileText, 
  GraduationCap, 
  Settings, 
  Users, 
  Target, 
  Clock, 
  Shield,
  Zap,
  Filter,
  Play,
  Pause,
  Plus,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Activity,
  BarChart3,
  Calendar,
  Brain,
  RefreshCw,
  Search,
  ClipboardCheck,
  FileSearch,
  TrendingUp,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import { useRegistrarAIAgent } from "@/hooks/useRegistrarAIAgent";
import { RegistrarAIAgentWizard } from "./wizard/RegistrarAIAgentWizard";

export function RegistrarAIFeatures() {
  const { toast } = useToast();
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  
  const {
    agents,
    activeAgent,
    filterRules,
    tasks,
    agentApplications,
    performanceMetrics,
    isLoading,
    createAgent,
    updateAgent,
    toggleAgent,
    reassignApplicationsToHumans,
    loadAgents
  } = useRegistrarAIAgent();

  // Filter for registrar-specific agents (assuming all agents for now)
  const registrarAgents = agents;
  const registrarActiveAgent = registrarAgents.find(agent => agent.is_active);

  const handleSaveAgent = async (agentData: any) => {
    if (agentData?.reload) {
      await loadAgents();
    }
    setShowCreateAgent(false);
  };

  const handleToggleAgent = async (agentId: string, isActive: boolean) => {
    await toggleAgent(agentId, isActive);
  };

  const handleUpdateAgentConfig = async (field: string, value: any) => {
    if (!registrarActiveAgent) return;
    await updateAgent(registrarActiveAgent.id, { [field]: value });
  };

  if (isLoading) {
    return (
      <div className="p-6 pt-8 w-full max-w-none space-y-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-8">
      {/* Header with AI Agent Profile */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <div className={`relative p-4 rounded-2xl ${registrarActiveAgent?.is_active ? 'bg-primary/10' : 'bg-muted'}`}>
            <Bot className={`h-12 w-12 ${registrarActiveAgent?.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
            {registrarActiveAgent?.is_active && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{registrarActiveAgent?.name || "No Active Registrar Agent"}</h1>
              <Badge variant={registrarActiveAgent?.is_active ? "default" : "secondary"}>
                {registrarActiveAgent?.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {registrarActiveAgent?.description || "No registrar agent is currently active"}
            </p>
            {registrarActiveAgent && performanceMetrics && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{performanceMetrics.active_leads_count || 0} applications assigned</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>{performanceMetrics.success_rate || 85}% processing efficiency</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{performanceMetrics.average_response_time || 2.4}h avg processing time</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {registrarActiveAgent ? (
            <Button 
              onClick={() => handleToggleAgent(registrarActiveAgent.id, !registrarActiveAgent.is_active)} 
              variant="outline"
            >
              {registrarActiveAgent.is_active ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Turn Off AI
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Activate AI
                </>
              )}
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              No Agent Available
            </Button>
          )}
          
          <Button onClick={() => setShowCreateAgent(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Registrar Agent
          </Button>
        </div>
      </div>

      {/* Current Operations Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Applications</p>
                <p className="text-2xl font-bold">{performanceMetrics?.active_leads_count || 0}</p>
                <p className="text-xs text-muted-foreground">of {registrarActiveAgent?.configuration?.max_concurrent_applications || registrarActiveAgent?.max_concurrent_leads || 50} max capacity</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Progress 
              value={registrarActiveAgent ? ((performanceMetrics?.active_leads_count || 0) / (registrarActiveAgent.configuration?.max_concurrent_applications || registrarActiveAgent.max_concurrent_leads || 50)) * 100 : 0} 
              className="mt-3" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics?.success_rate || 85}%</p>
                <p className="text-xs text-green-600">Applications processed: {performanceMetrics?.total_leads_handled || 12}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents Pending</p>
                <p className="text-2xl font-bold">{performanceMetrics?.handoffs_count || 8}</p>
                <p className="text-xs text-orange-600">Requires verification</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enrollment Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics?.conversion_rate || 78}%</p>
                <p className="text-xs text-blue-600">This semester</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrar AI Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Document Processing AI
            </CardTitle>
            <CardDescription>
              Automated document verification and processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">OCR Accuracy</span>
                  <Badge variant="secondary">98.5%</Badge>
                </div>
                <Progress value={98.5} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto Classification</span>
                  <Badge variant="secondary">95.2%</Badge>
                </div>
                <Progress value={95.2} className="h-2" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Document Types Supported</p>
                <p className="text-xs text-muted-foreground">Transcripts, IDs, Certificates, Letters</p>
              </div>
              <Button size="sm" variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Application Review AI
            </CardTitle>
            <CardDescription>
              Intelligent application scoring and eligibility checks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Eligibility Check</span>
                  <Badge variant="secondary">99.1%</Badge>
                </div>
                <Progress value={99.1} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Assessment</span>
                  <Badge variant="secondary">92.8%</Badge>
                </div>
                <Progress value={92.8} className="h-2" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Automated Scoring</p>
                <p className="text-xs text-muted-foreground">GPA, Test Scores, Requirements</p>
              </div>
              <Button size="sm" variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Enrollment Prediction
            </CardTitle>
            <CardDescription>
              AI-powered enrollment likelihood analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Prediction Accuracy</span>
                  <Badge variant="secondary">87.3%</Badge>
                </div>
                <Progress value={87.3} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Early Indicators</span>
                  <Badge variant="secondary">91.6%</Badge>
                </div>
                <Progress value={91.6} className="h-2" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Factors Analyzed</p>
                <p className="text-xs text-muted-foreground">Demographics, Timeline, Engagement</p>
              </div>
              <Button size="sm" variant="outline">View Model</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Monitoring
            </CardTitle>
            <CardDescription>
              Automated policy compliance checking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Policy Adherence</span>
                  <Badge variant="secondary">99.7%</Badge>
                </div>
                <Progress value={99.7} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Audit Readiness</span>
                  <Badge variant="secondary">100%</Badge>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Compliance Areas</p>
                <p className="text-xs text-muted-foreground">FERPA, Accreditation, State Regulations</p>
              </div>
              <Button size="sm" variant="outline">Audit Trail</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Registrar Agent Configuration
          </CardTitle>
          <CardDescription>
            Configure your registrar AI agent settings and behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {registrarActiveAgent ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={registrarActiveAgent.name}
                    onChange={(e) => handleUpdateAgentConfig('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="processingStyle">Processing Style</Label>
                  <Select 
                    value={registrarActiveAgent.configuration?.processing_style || registrarActiveAgent.response_style || 'thorough'} 
                    onValueChange={(value) => handleUpdateAgentConfig('processing_style', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thorough">Thorough Review</SelectItem>
                      <SelectItem value="efficient">Efficient Processing</SelectItem>
                      <SelectItem value="strict">Strict Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxApplications">Max Applications</Label>
                    <Input
                      id="maxApplications"
                      type="number"
                      value={registrarActiveAgent.configuration?.max_concurrent_applications || registrarActiveAgent.max_concurrent_leads || 50}
                      onChange={(e) => handleUpdateAgentConfig('max_concurrent_applications', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reviewThreshold">Review Threshold (%)</Label>
                    <Input
                      id="reviewThreshold"
                      type="number"
                      value={registrarActiveAgent.configuration?.review_threshold || registrarActiveAgent.handoff_threshold || 85}
                      onChange={(e) => handleUpdateAgentConfig('review_threshold', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Automation Features</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Auto Document Verification</p>
                        <p className="text-xs text-muted-foreground">Automatically verify uploaded documents</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Eligibility Pre-screening</p>
                        <p className="text-xs text-muted-foreground">Pre-screen applications for basic eligibility</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Compliance Monitoring</p>
                        <p className="text-xs text-muted-foreground">Monitor for policy compliance violations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active registrar agent</p>
              <p className="text-sm">Create a registrar agent to configure settings</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
          <CardDescription>
            Track your registrar AI performance and efficiency metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Application Processing Time</span>
                <span className="text-lg font-bold">2.4h</span>
              </div>
              <Progress value={76} className="h-2" />
              <p className="text-xs text-muted-foreground">24% faster than manual</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Document Accuracy</span>
                <span className="text-lg font-bold">98.5%</span>
              </div>
              <Progress value={98.5} className="h-2" />
              <p className="text-xs text-muted-foreground">2.1% improvement from last month</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Student Satisfaction</span>
                <span className="text-lg font-bold">94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
              <p className="text-xs text-muted-foreground">Based on application experience surveys</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrar AI Agent Wizard */}
      <RegistrarAIAgentWizard 
        open={showCreateAgent}
        onOpenChange={setShowCreateAgent}
        onSave={handleSaveAgent}
      />
    </div>
  );
}