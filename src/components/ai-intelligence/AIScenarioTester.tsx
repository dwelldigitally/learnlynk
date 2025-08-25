import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TestTube, 
  Play, 
  Plus, 
  Eye, 
  BarChart3, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { AIDecisionService } from '@/services/aiDecisionService';
import { AIScenarioTest } from '@/types/aiDecisionIntelligence';
import { useToast } from '@/components/ui/use-toast';

export function AIScenarioTester() {
  const [scenarios, setScenarios] = useState<AIScenarioTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<AIScenarioTest | null>(null);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    scenario_data: '',
    expected_outcome: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setIsLoading(true);
      const data = await AIDecisionService.getScenarioTests();
      setScenarios(data);
    } catch (error) {
      console.error('Error loading scenarios:', error);
      toast({
        title: "Error",
        description: "Failed to load scenario tests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateScenario = async () => {
    if (!newScenario.name.trim() || !newScenario.scenario_data.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a name and scenario data",
        variant: "destructive",
      });
      return;
    }

    try {
      let scenarioData, expectedOutcome;
      
      try {
        scenarioData = JSON.parse(newScenario.scenario_data);
      } catch {
        scenarioData = { description: newScenario.scenario_data };
      }

      try {
        expectedOutcome = newScenario.expected_outcome ? JSON.parse(newScenario.expected_outcome) : null;
      } catch {
        expectedOutcome = newScenario.expected_outcome ? { description: newScenario.expected_outcome } : null;
      }

      await AIDecisionService.createScenarioTest({
        name: newScenario.name,
        description: newScenario.description,
        scenario_data: scenarioData,
        expected_outcome: expectedOutcome,
        test_status: 'pending'
      });

      toast({
        title: "Scenario Created",
        description: "Test scenario has been created successfully",
      });

      setNewScenario({ name: '', description: '', scenario_data: '', expected_outcome: '' });
      loadScenarios();
    } catch (error) {
      console.error('Error creating scenario:', error);
      toast({
        title: "Creation Error",
        description: "Failed to create the test scenario",
        variant: "destructive",
      });
    }
  };

  const handleRunScenario = async (scenarioId: string) => {
    try {
      setIsLoading(true);
      const result = await AIDecisionService.runScenarioTest(scenarioId);
      
      toast({
        title: "Test Completed",
        description: `Scenario test completed in ${result.execution_time_ms}ms`,
      });

      loadScenarios();
    } catch (error) {
      console.error('Error running scenario:', error);
      toast({
        title: "Execution Error",
        description: "Failed to run the scenario test",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      case 'running': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const predefinedScenarios = [
    {
      name: "High Engagement Student",
      description: "Student with high engagement score and strong program match",
      scenario_data: JSON.stringify({
        student: {
          engagement_score: 0.9,
          program_match: 0.85,
          application_completeness: 0.8,
          last_interaction: "2024-01-15T10:00:00Z",
          program_interest: ["Computer Science", "Data Science"],
          source: "website"
        }
      }, null, 2),
      expected_outcome: JSON.stringify({
        recommended_action: "Call Student",
        confidence_score: 0.8,
        urgency: "high"
      }, null, 2)
    },
    {
      name: "Low Engagement International Student",
      description: "International student with low engagement but high program value",
      scenario_data: JSON.stringify({
        student: {
          engagement_score: 0.3,
          program_match: 0.7,
          application_completeness: 0.4,
          country: "India",
          timezone_offset: "+5:30",
          program_interest: ["Business Administration"],
          source: "social_media"
        }
      }, null, 2),
      expected_outcome: JSON.stringify({
        recommended_action: "Send Email",
        confidence_score: 0.6,
        cultural_considerations: true
      }, null, 2)
    },
    {
      name: "Near Deadline Application",
      description: "Student close to application deadline with moderate engagement",
      scenario_data: JSON.stringify({
        student: {
          engagement_score: 0.6,
          program_match: 0.75,
          application_completeness: 0.9,
          deadline_proximity: "3 days",
          program_interest: ["Engineering"],
          source: "referral"
        }
      }, null, 2),
      expected_outcome: JSON.stringify({
        recommended_action: "Send SMS",
        confidence_score: 0.75,
        urgency: "very_high"
      }, null, 2)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TestTube className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">AI Scenario Tester</h2>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Scenario</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Scenario Test</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Scenario Name</label>
                <Input
                  placeholder="e.g., High Engagement Student Test"
                  value={newScenario.name}
                  onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe what this scenario tests..."
                  value={newScenario.description}
                  onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Scenario Data (JSON)</label>
                <Textarea
                  placeholder="Enter student data and context as JSON..."
                  value={newScenario.scenario_data}
                  onChange={(e) => setNewScenario({ ...newScenario, scenario_data: e.target.value })}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Expected Outcome (JSON, optional)</label>
                <Textarea
                  placeholder="Expected AI decision outcome..."
                  value={newScenario.expected_outcome}
                  onChange={(e) => setNewScenario({ ...newScenario, expected_outcome: e.target.value })}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-medium mb-2">Quick Start Templates:</div>
                <div className="space-y-2">
                  {predefinedScenarios.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setNewScenario({
                        name: template.name,
                        description: template.description,
                        scenario_data: template.scenario_data,
                        expected_outcome: template.expected_outcome
                      })}
                      className="text-left h-auto py-2 px-3 whitespace-normal w-full"
                    >
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">{template.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewScenario({ name: '', description: '', scenario_data: '', expected_outcome: '' })}>
                  Clear
                </Button>
                <Button onClick={handleCreateScenario}>
                  Create Scenario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{scenarios.length}</div>
              <div className="text-sm text-muted-foreground">Total Scenarios</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {scenarios.filter(s => s.test_status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed Tests</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {scenarios.filter(s => s.test_status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Tests</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Scenario Test Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(scenario.test_status)}
                      <span className="font-medium">{scenario.name}</span>
                      <Badge className={getStatusColor(scenario.test_status)}>
                        {scenario.test_status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {scenario.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Created: {new Date(scenario.created_at).toLocaleDateString()}</span>
                      {scenario.execution_time_ms && (
                        <span>Runtime: {scenario.execution_time_ms}ms</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedScenario(scenario)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Scenario Test Details</DialogTitle>
                        </DialogHeader>
                        {selectedScenario && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-semibold mb-2">Scenario Data:</h3>
                              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                                {JSON.stringify(selectedScenario.scenario_data, null, 2)}
                              </pre>
                            </div>
                            
                            {selectedScenario.expected_outcome && (
                              <div>
                                <h3 className="font-semibold mb-2">Expected Outcome:</h3>
                                <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(selectedScenario.expected_outcome, null, 2)}
                                </pre>
                              </div>
                            )}
                            
                            {selectedScenario.actual_outcome && (
                              <div>
                                <h3 className="font-semibold mb-2">Actual Outcome:</h3>
                                <pre className="bg-green-50 p-4 rounded text-xs overflow-x-auto border border-green-200">
                                  {JSON.stringify(selectedScenario.actual_outcome, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      size="sm"
                      onClick={() => handleRunScenario(scenario.id)}
                      disabled={scenario.test_status === 'running' || isLoading}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {scenario.test_status === 'running' ? 'Running...' : 'Run Test'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {scenarios.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No scenario tests found. Create your first scenario to start testing AI decision logic.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}