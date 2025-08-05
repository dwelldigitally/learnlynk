import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, MessageSquare, FileText, Calendar, TrendingUp, Zap, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  category: 'automation' | 'analysis' | 'prediction';
}

const AILeadEnhancement: React.FC = () => {
  const { toast } = useToast();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(null);
  const [aiFeatures, setAIFeatures] = useState<AIFeature[]>([
    {
      id: 'auto-follow-up',
      name: 'Automated Follow-ups',
      description: 'AI generates and sends personalized follow-up messages',
      icon: MessageSquare,
      enabled: true,
      category: 'automation'
    },
    {
      id: 'smart-scoring',
      name: 'AI-Enhanced Scoring',
      description: 'Advanced lead scoring using behavioral patterns',
      icon: Brain,
      enabled: true,
      category: 'analysis'
    },
    {
      id: 'document-processing',
      name: 'Document Intelligence',
      description: 'Automatically process and classify uploaded documents',
      icon: FileText,
      enabled: false,
      category: 'automation'
    },
    {
      id: 'meeting-scheduler',
      name: 'Smart Scheduling',
      description: 'AI schedules meetings based on availability and priority',
      icon: Calendar,
      enabled: false,
      category: 'automation'
    },
    {
      id: 'conversion-prediction',
      name: 'Conversion Prediction',
      description: 'Predict likelihood of lead conversion',
      icon: TrendingUp,
      enabled: true,
      category: 'prediction'
    },
    {
      id: 'workflow-optimization',
      name: 'Workflow Optimization',
      description: 'AI suggests improvements to lead management workflows',
      icon: Zap,
      enabled: false,
      category: 'analysis'
    }
  ]);

  const handleToggleFeature = (featureId: string) => {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation': return 'bg-primary text-primary-foreground';
      case 'analysis': return 'bg-secondary text-secondary-foreground';
      case 'prediction': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const groupedFeatures = aiFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, AIFeature[]>);

  const handleConfigureFeature = (feature: AIFeature) => {
    setSelectedFeature(feature);
    setConfigModalOpen(true);
  };

  const handleSaveConfiguration = (config: any) => {
    toast({
      title: "Configuration Saved",
      description: `${selectedFeature?.name} has been configured successfully.`,
    });
    setConfigModalOpen(false);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">AI Enhancement Features</CardTitle>
            <CardDescription>
              Boost your lead management with optional AI-powered capabilities
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Active Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {aiFeatures.filter(f => f.enabled).length}
                  </div>
                  <p className="text-xs text-muted-foreground">of {aiFeatures.length} available</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Automation Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round((aiFeatures.filter(f => f.enabled && f.category === 'automation').length / 
                      aiFeatures.filter(f => f.category === 'automation').length) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">processes automated</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">AI Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">High</div>
                  <p className="text-xs text-muted-foreground">efficiency improvement</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-3">
              {aiFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{feature.name}</h4>
                          <Badge className={getCategoryColor(feature.category)}>
                            {feature.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={feature.id} className="text-sm">
                        {feature.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                      <Switch
                        id={feature.id}
                        checked={feature.enabled}
                        onCheckedChange={() => handleToggleFeature(feature.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {Object.entries(groupedFeatures).map(([category, features]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-3">
                {features.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={feature.id} className={feature.enabled ? 'border-primary/30' : ''}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <div>
                              <CardTitle className="text-lg">{feature.name}</CardTitle>
                              <CardDescription>{feature.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={feature.enabled}
                              onCheckedChange={() => handleToggleFeature(feature.id)}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      {feature.enabled && (
                        <CardContent>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleConfigureFeature(feature)}>
                              <Settings className="h-3 w-3 mr-1" />
                              Configure
                            </Button>
                            <Button size="sm" variant="outline">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Analytics
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      {selectedFeature && (
        <AIFeatureConfigModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          featureId={selectedFeature.id}
          featureName={selectedFeature.name}
          onSave={handleSaveConfiguration}
        />
      )}
    </Card>
  );
};

export default AILeadEnhancement;