import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Brain, Zap, MessageSquare, Target, TrendingUp, Users, Activity, RefreshCw, Settings, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { AIUnifiedAssistant } from "./AIUnifiedAssistant";
import { AISmartCommunication } from "./AISmartCommunication";
import { AIIntelligentManagement } from "./AIIntelligentManagement";

// Mock lead data for demonstration
const mockLead = {
  id: "lead-1",
  first_name: "John",
  last_name: "Doe", 
  email: "john.doe@example.com",
  phone: "+1234567890",
  country: "United States",
  program_interest: ["MBA", "Executive Education"],
  source: "web" as const,
  priority: "high" as const,
  status: "new" as const,
  lead_score: 85,
  tags: ["high-priority", "international"],
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  updated_at: new Date().toISOString()
};

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: 'assistant' | 'communication' | 'management' | 'insights';
  impact: 'high' | 'medium' | 'low';
  usage: number;
}

export function LeadAIFeatures() {
  const { toast } = useToast();
  const [aiFeatures, setAIFeatures] = useState<AIFeature[]>([
    {
      id: 'unified-assistant',
      name: 'AI Lead Assistant',
      description: 'Real-time insights, scoring, and action recommendations',
      icon: Brain,
      enabled: true,
      category: 'assistant',
      impact: 'high',
      usage: 94
    },
    {
      id: 'smart-communication',
      name: 'AI Communication Hub',
      description: 'Automated email/SMS generation and personalization',
      icon: MessageSquare,
      enabled: true,
      category: 'communication',
      impact: 'high',
      usage: 87
    },
    {
      id: 'intelligent-management',
      name: 'Intelligent Management',
      description: 'Auto-categorization, routing, and priority adjustment',
      icon: Target,
      enabled: true,
      category: 'management',
      impact: 'medium',
      usage: 78
    },
    {
      id: 'smart-insights',
      name: 'Smart Insights Engine',
      description: 'Behavioral analysis and conversion predictions',
      icon: TrendingUp,
      enabled: true,
      category: 'insights',
      impact: 'high',
      usage: 91
    }
  ]);

  const toggleFeature = (featureId: string) => {
    setAIFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
    
    const feature = aiFeatures.find(f => f.id === featureId);
    toast({
      title: `AI Feature ${feature?.enabled ? 'Disabled' : 'Enabled'}`,
      description: `${feature?.name} has been ${feature?.enabled ? 'disabled' : 'enabled'}.`
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'assistant': return 'bg-blue-100 text-blue-800';
      case 'communication': return 'bg-green-100 text-green-800';
      case 'management': return 'bg-purple-100 text-purple-800';
      case 'insights': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Lead Intelligence</h1>
          <p className="text-muted-foreground">
            Complete AI-powered lead management and optimization suite
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Activity className="h-3 w-3 mr-1" />
            {aiFeatures.filter(f => f.enabled).length} Active
          </Badge>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* AI Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              AI Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">95%</div>
            <p className="text-xs text-muted-foreground">System accuracy</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Conversion Boost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+34%</div>
            <p className="text-xs text-muted-foreground">vs manual process</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              Time Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">18.5h</div>
            <p className="text-xs text-muted-foreground">per week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              Leads Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2,847</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiFeatures.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card key={feature.id} className={`transition-all ${feature.enabled ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-transparent' : 'border-border'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                      <IconComponent className={`h-5 w-5 ${feature.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(feature.category)}>
                      {feature.category}
                    </Badge>
                    <span className={`text-sm font-medium ${getImpactColor(feature.impact)}`}>
                      {feature.impact} impact
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {feature.usage}% usage
                  </div>
                </div>
                
                {feature.enabled && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Star className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Live AI Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Assistant Demo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Lead Assistant</h3>
          <AIUnifiedAssistant lead={mockLead} />
        </div>

        {/* Smart Insights Demo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Smart Insights</h3>
          <AIInsightsPanel lead={mockLead} expanded={true} />
        </div>
      </div>

      {/* Communication Hub */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI Communication Hub</h3>
        <AISmartCommunication lead={mockLead} />
      </div>

      {/* Intelligent Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Intelligent Management</h3>
        <AIIntelligentManagement />
      </div>
    </div>
  );
}