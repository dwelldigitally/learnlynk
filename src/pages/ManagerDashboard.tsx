
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, Workflow, Clock, Users, BarChart3, 
  ArrowUp, Check, AlertCircle, RefreshCw, Settings,
  InfoIcon, BarChart2, UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UnengagedLeadsList from "@/components/manager/UnengagedLeadsList";
import AIAuditTrail from "@/components/manager/AIAuditTrail";
import AIWeightSettings from "@/components/manager/AIWeightSettings";
import PerformanceComparison from "@/components/manager/PerformanceComparison";
import UserInviteForm from "@/components/dashboard/UserInviteForm";

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aiMode, setAiMode] = useState("balanced");
  const [responseTimeThreshold, setResponseTimeThreshold] = useState(4);
  const [showTeamInvite, setShowTeamInvite] = useState(false);

  const handleModeChange = (mode: string) => {
    setAiMode(mode);
    toast({
      title: "AI Mode Updated",
      description: `Distribution mode changed to ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
    });
  };

  const handleResponseTimeChange = (value: number[]) => {
    setResponseTimeThreshold(value[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/b3f2384b-be58-4f06-8c20-a1cbc24a6ab2.png" 
              alt="Learnlynk Logo" 
              className="h-8 mr-4"
              onClick={() => navigate('/dashboard')}
              style={{ cursor: 'pointer' }}
            />
            <h1 className="text-xl font-semibold">Manager Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-saas-blue">
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="User profile" 
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Lead Management Console</h2>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="settings">
          <TabsList className="mb-6">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> AI Settings
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Team Management
            </TabsTrigger>
            <TabsTrigger value="unengaged" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Unengaged Leads
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <InfoIcon className="w-4 h-4" /> Assignment Audit
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Performance Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Distribution Mode</CardTitle>
                    <CardDescription>
                      Select how leads should be distributed to your team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Button 
                        variant={aiMode === "performance" ? "default" : "outline"} 
                        className="w-full flex flex-col items-center py-6"
                        onClick={() => handleModeChange("performance")}
                      >
                        <BarChart3 className="w-6 h-6 mb-2" />
                        <span className="font-semibold">Performance Mode</span>
                        <span className="text-xs mt-1">Prioritize win rates</span>
                      </Button>
                      
                      <Button 
                        variant={aiMode === "balanced" ? "default" : "outline"} 
                        className="w-full flex flex-col items-center py-6"
                        onClick={() => handleModeChange("balanced")}
                      >
                        <Users className="w-6 h-6 mb-2" />
                        <span className="font-semibold">Balanced Mode</span>
                        <span className="text-xs mt-1">Mix fairness + performance</span>
                      </Button>
                      
                      <Button 
                        variant={aiMode === "custom" ? "default" : "outline"} 
                        className="w-full flex flex-col items-center py-6"
                        onClick={() => handleModeChange("custom")}
                      >
                        <Settings className="w-6 h-6 mb-2" />
                        <span className="font-semibold">Custom Mode</span>
                        <span className="text-xs mt-1">Set custom weights</span>
                      </Button>
                    </div>
                    
                    {aiMode === "custom" && <AIWeightSettings />}
                    
                    <div className="mt-6">
                      <h3 className="text-md font-medium mb-4">Response Time Threshold</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="response-time">Expected response time</Label>
                          <span className="text-sm font-medium">{responseTimeThreshold} hours</span>
                        </div>
                        <Slider 
                          id="response-time"
                          min={1} 
                          max={24} 
                          step={1} 
                          value={[responseTimeThreshold]} 
                          onValueChange={handleResponseTimeChange}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Leads will be flagged for re-engagement after {responseTimeThreshold} hours without response
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current AI Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Conversion rate</span>
                        <span className="font-medium flex items-center text-green-600">
                          +17.3% <ArrowUp className="h-4 w-4 ml-1" />
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Time saved</span>
                        <span className="font-medium">8.2 hrs/week</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Assignment accuracy</span>
                        <span className="font-medium">93%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Success Factors</CardTitle>
                    <CardDescription>Variables driving success</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="bg-blue-500 mr-2">1</Badge>
                          <span>Response time</span>
                        </div>
                        <span className="text-sm font-medium">38%</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="bg-blue-500 mr-2">2</Badge>
                          <span>Prior success</span>
                        </div>
                        <span className="text-sm font-medium">27%</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="bg-blue-500 mr-2">3</Badge>
                          <span>Lead source</span>
                        </div>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="team">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>Manage your team and their access</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowTeamInvite(!showTeamInvite)} 
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      {showTeamInvite ? "Cancel" : "Invite Member"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {showTeamInvite && (
                      <div className="mb-6">
                        <UserInviteForm />
                      </div>
                    )}
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">John Smith</TableCell>
                          <TableCell>john.smith@example.com</TableCell>
                          <TableCell>Admin</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Sarah Johnson</TableCell>
                          <TableCell>sarah.j@example.com</TableCell>
                          <TableCell>Manager</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Robert Chen</TableCell>
                          <TableCell>robert.c@example.com</TableCell>
                          <TableCell>Member</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Resend</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                    <CardDescription>Overall team metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Average response time</span>
                          <span className="font-medium">3.2 hours</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Conversion rate</span>
                          <span className="font-medium">32%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: '32%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Team capacity</span>
                          <span className="font-medium">68%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="unengaged">
            <UnengagedLeadsList responseTimeThreshold={responseTimeThreshold} />
          </TabsContent>
          
          <TabsContent value="audit">
            <AIAuditTrail />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceComparison />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerDashboard;
