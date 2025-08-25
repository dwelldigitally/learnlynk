import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  Wand2,
  Settings,
  History,
  Play
} from 'lucide-react';
import { AIDecisionService } from '@/services/aiDecisionService';
import { AILogicConfiguration } from '@/types/aiDecisionIntelligence';
import { useToast } from '@/components/ui/use-toast';

export function AILogicModifier() {
  const [configurations, setConfigurations] = useState<AILogicConfiguration[]>([]);
  const [activeConfig, setActiveConfig] = useState<AILogicConfiguration | null>(null);
  const [naturalLanguageCommand, setNaturalLanguageCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandResult, setCommandResult] = useState<{
    understood: boolean;
    proposed_changes: Record<string, any>;
    preview: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConfigurations();
    loadActiveConfiguration();
  }, []);

  const loadConfigurations = async () => {
    try {
      const data = await AIDecisionService.getConfigurations();
      setConfigurations(data);
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load AI configurations",
        variant: "destructive",
      });
    }
  };

  const loadActiveConfiguration = async () => {
    try {
      const config = await AIDecisionService.getActiveConfiguration();
      setActiveConfig(config);
    } catch (error) {
      console.error('Error loading active configuration:', error);
    }
  };

  const handleProcessCommand = async () => {
    if (!naturalLanguageCommand.trim()) return;

    setIsProcessing(true);
    try {
      const result = await AIDecisionService.processNaturalLanguageCommand(naturalLanguageCommand);
      setCommandResult(result);
      
      if (result.understood) {
        toast({
          title: "Command Understood",
          description: result.preview,
        });
      } else {
        toast({
          title: "Command Not Understood",
          description: "Try rephrasing your request or use more specific terms",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing command:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process the natural language command",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!commandResult?.understood || !commandResult.proposed_changes) return;

    try {
      const newConfig = await AIDecisionService.createConfiguration({
        name: `Modified Configuration - ${new Date().toLocaleDateString()}`,
        description: `Applied change: ${naturalLanguageCommand}`,
        configuration_data: commandResult.proposed_changes,
        natural_language_prompt: naturalLanguageCommand,
        is_active: true
      });

      toast({
        title: "Configuration Applied",
        description: "AI logic has been updated successfully",
      });

      setActiveConfig(newConfig);
      setNaturalLanguageCommand('');
      setCommandResult(null);
      loadConfigurations();
    } catch (error) {
      console.error('Error applying changes:', error);
      toast({
        title: "Application Error",
        description: "Failed to apply the configuration changes",
        variant: "destructive",
      });
    }
  };

  const handleActivateConfiguration = async (configId: string) => {
    try {
      await AIDecisionService.activateConfiguration(configId);
      toast({
        title: "Configuration Activated",
        description: "AI logic configuration has been activated",
      });
      loadActiveConfiguration();
      loadConfigurations();
    } catch (error) {
      console.error('Error activating configuration:', error);
      toast({
        title: "Activation Error",
        description: "Failed to activate the configuration",
        variant: "destructive",
      });
    }
  };

  const exampleCommands = [
    "Prioritize students from high-yield programs more heavily",
    "Be more aggressive with follow-ups for students who haven't responded in 3 days",
    "Consider international students differently for yield calculations",
    "Reduce the weight of urgency factors and increase program alignment importance",
    "Make the AI more conservative with automated actions",
    "Increase the frequency of SMS outreach for high-engagement students"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Wand2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">AI Logic Modifier</h2>
      </div>

      <Tabs defaultValue="natural-language" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="natural-language">Natural Language</TabsTrigger>
          <TabsTrigger value="configurations">Configurations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="natural-language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Modify AI Logic with Natural Language</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe the change you want to make:</label>
                <Textarea
                  placeholder="e.g., Prioritize students from high-yield programs more heavily..."
                  value={naturalLanguageCommand}
                  onChange={(e) => setNaturalLanguageCommand(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleProcessCommand}
                  disabled={!naturalLanguageCommand.trim() || isProcessing}
                  className="flex items-center space-x-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>{isProcessing ? 'Processing...' : 'Process Command'}</span>
                </Button>

                {commandResult?.understood && (
                  <Button
                    onClick={handleApplyChanges}
                    variant="default"
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Apply Changes</span>
                  </Button>
                )}
              </div>

              {commandResult && (
                <Alert className={commandResult.understood ? 'border-green-200' : 'border-red-200'}>
                  <div className="flex items-center space-x-2">
                    {commandResult.understood ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">
                      {commandResult.understood ? 'Command Understood' : 'Command Not Understood'}
                    </span>
                  </div>
                  <AlertDescription className="mt-2">
                    {commandResult.preview || 'Please try rephrasing your request with more specific terms.'}
                  </AlertDescription>
                  
                  {commandResult.understood && (
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-2">Proposed Changes:</div>
                      <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(commandResult.proposed_changes, null, 2)}
                      </pre>
                    </div>
                  )}
                </Alert>
              )}

              <div className="border-t pt-4">
                <div className="text-sm font-medium mb-2">Example Commands:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {exampleCommands.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setNaturalLanguageCommand(example)}
                      className="text-left h-auto py-2 px-3 whitespace-normal"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configurations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Configuration History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {configurations.map((config) => (
                  <div
                    key={config.id}
                    className={`p-4 border rounded-lg ${
                      config.is_active ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{config.name}</span>
                          {config.is_active && (
                            <Badge variant="default" className="bg-green-600">Active</Badge>
                          )}
                          <Badge variant="outline">v{config.version}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {config.description}
                        </p>
                        {config.natural_language_prompt && (
                          <p className="text-xs text-blue-600 mt-1">
                            Command: "{config.natural_language_prompt}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(config.created_at).toLocaleString()}
                        </p>
                      </div>
                      
                      {!config.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivateConfiguration(config.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Advanced Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeConfig && (
                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="font-medium mb-2">Current Active Configuration:</div>
                    <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                      {JSON.stringify(activeConfig.configuration_data, null, 2)}
                    </pre>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Advanced configuration editing requires technical knowledge of the AI decision system.
                      Consider using the Natural Language interface for safer modifications.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}