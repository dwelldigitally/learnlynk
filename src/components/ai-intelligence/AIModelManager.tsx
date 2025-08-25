import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  GitBranch, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Zap,
  Target,
  Upload
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface AIModel {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'testing' | 'deprecated';
  accuracy: number;
  speed: number;
  confidence: number;
  lastTrained: string;
  deploymentsCount: number;
  description: string;
  testResults?: {
    accuracy: number;
    speed: number;
    scenarios: number;
    passed: number;
  };
}

export function AIModelManager() {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 'model_v3_2',
      name: 'Enrollment Optimizer Pro',
      version: '3.2.1',
      status: 'active',
      accuracy: 87.5,
      speed: 1.2,
      confidence: 0.89,
      lastTrained: '2024-03-15',
      deploymentsCount: 156,
      description: 'Advanced model for enrollment predictions with enhanced bias detection and real-time learning capabilities.',
      testResults: {
        accuracy: 89.2,
        speed: 1.1,
        scenarios: 250,
        passed: 247
      }
    },
    {
      id: 'model_v3_1',
      name: 'Enrollment Optimizer',
      version: '3.1.8',
      status: 'inactive',
      accuracy: 82.1,
      speed: 1.8,
      confidence: 0.84,
      lastTrained: '2024-02-28',
      deploymentsCount: 89,
      description: 'Previous stable version with proven track record in student enrollment predictions.',
      testResults: {
        accuracy: 82.5,
        speed: 1.7,
        scenarios: 200,
        passed: 195
      }
    },
    {
      id: 'model_experimental',
      name: 'Neural Decision Engine',
      version: '4.0.0-beta',
      status: 'testing',
      accuracy: 91.3,
      speed: 0.9,
      confidence: 0.92,
      lastTrained: '2024-03-20',
      deploymentsCount: 12,
      description: 'Experimental model using advanced neural networks with attention mechanisms.',
      testResults: {
        accuracy: 91.8,
        speed: 0.8,
        scenarios: 150,
        passed: 148
      }
    }
  ]);

  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'testing':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'deprecated':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'testing':
        return <Clock className="h-4 w-4" />;
      case 'deprecated':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Pause className="h-4 w-4" />;
    }
  };

  const handleActivateModel = async (modelId: string) => {
    setIsDeploying(true);
    
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setModels(prev => prev.map(model => ({
      ...model,
      status: model.id === modelId ? 'active' : 
              model.status === 'active' ? 'inactive' : model.status
    })));
    
    setIsDeploying(false);
  };

  const handleRollback = async (modelId: string) => {
    setIsDeploying(true);
    
    // Simulate rollback process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setModels(prev => prev.map(model => ({
      ...model,
      status: model.id === modelId ? 'active' : 
              model.status === 'active' ? 'inactive' : model.status
    })));
    
    setIsDeploying(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Model Management</h2>
          <p className="text-muted-foreground">
            Deploy, test, and manage AI decision models with version control
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Model
          </Button>
          <Button>
            <GitBranch className="h-4 w-4 mr-2" />
            Create Branch
          </Button>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className={`transition-all duration-200 hover:shadow-lg ${
            model.status === 'active' ? 'ring-2 ring-primary/20 bg-primary/5' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">v{model.version}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(model.status)}>
                  {getStatusIcon(model.status)}
                  <span className="ml-1 capitalize">{model.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{model.description}</p>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{model.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{model.speed}s</div>
                  <div className="text-xs text-muted-foreground">Speed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{(model.confidence * 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
              </div>

              {/* Test Results Progress */}
              {model.testResults && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Test Coverage</span>
                    <span>{model.testResults.passed}/{model.testResults.scenarios}</span>
                  </div>
                  <Progress value={(model.testResults.passed / model.testResults.scenarios) * 100} />
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Last trained: {new Date(model.lastTrained).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                {model.status !== 'active' ? (
                  <Button 
                    size="sm" 
                    onClick={() => handleActivateModel(model.id)}
                    disabled={isDeploying}
                    className="flex-1"
                  >
                    {isDeploying ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isDeploying ? 'Deploying...' : 'Activate'}
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRollback(model.id)}
                    disabled={isDeploying}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Rollback
                  </Button>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedModel(model)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{model.name} - Configuration</DialogTitle>
                    </DialogHeader>
                    
                    <Tabs defaultValue="details" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="testing">Testing</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Model Name</Label>
                            <p className="text-sm mt-1">{model.name}</p>
                          </div>
                          <div>
                            <Label>Version</Label>
                            <p className="text-sm mt-1">v{model.version}</p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <Badge variant="outline" className={getStatusColor(model.status)}>
                              {getStatusIcon(model.status)}
                              <span className="ml-1 capitalize">{model.status}</span>
                            </Badge>
                          </div>
                          <div>
                            <Label>Deployments</Label>
                            <p className="text-sm mt-1">{model.deploymentsCount}</p>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Description</Label>
                          <Textarea 
                            value={model.description} 
                            readOnly 
                            className="mt-1"
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="performance" className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <Target className="h-8 w-8 mx-auto text-primary mb-2" />
                                <div className="text-2xl font-bold">{model.accuracy}%</div>
                                <div className="text-sm text-muted-foreground">Accuracy</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <Zap className="h-8 w-8 mx-auto text-accent mb-2" />
                                <div className="text-2xl font-bold">{model.speed}s</div>
                                <div className="text-sm text-muted-foreground">Avg Response</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <CheckCircle className="h-8 w-8 mx-auto text-success mb-2" />
                                <div className="text-2xl font-bold">{(model.confidence * 100).toFixed(0)}%</div>
                                <div className="text-sm text-muted-foreground">Confidence</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="testing" className="space-y-4">
                        {model.testResults && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Test Accuracy</Label>
                                <div className="text-2xl font-bold text-primary">
                                  {model.testResults.accuracy}%
                                </div>
                              </div>
                              <div>
                                <Label>Test Speed</Label>
                                <div className="text-2xl font-bold text-accent">
                                  {model.testResults.speed}s
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Scenario Coverage</Label>
                              <div className="flex justify-between text-sm mt-1">
                                <span>Passed: {model.testResults.passed}</span>
                                <span>Total: {model.testResults.scenarios}</span>
                              </div>
                              <Progress 
                                value={(model.testResults.passed / model.testResults.scenarios) * 100} 
                                className="mt-2"
                              />
                            </div>
                            
                            <Button variant="outline" className="w-full">
                              <Play className="h-4 w-4 mr-2" />
                              Run Full Test Suite
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="settings" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Auto-scaling</Label>
                              <p className="text-sm text-muted-foreground">
                                Automatically scale based on load
                              </p>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Real-time Learning</Label>
                              <p className="text-sm text-muted-foreground">
                                Continuously improve from new data
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Bias Detection</Label>
                              <p className="text-sm text-muted-foreground">
                                Monitor for bias in decisions
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}