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
  InfoIcon, BarChart2, UserPlus, Calendar,
  ChevronRight, Activity, Bell, PieChart, HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UnengagedLeadsList from "@/components/manager/UnengagedLeadsList";
import AIAuditTrail from "@/components/manager/AIAuditTrail";
import AIWeightSettings from "@/components/manager/AIWeightSettings";
import PerformanceComparison from "@/components/manager/PerformanceComparison";
import UserInviteForm from "@/components/dashboard/UserInviteForm";
import PipelinePlanner from "@/components/manager/PipelinePlanner";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-[#f0f6ff]">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/b3f2384b-be58-4f06-8c20-a1cbc24a6ab2.png" 
              alt="Learnlynk Logo" 
              className="h-10 mr-4"
              onClick={() => navigate('/dashboard')}
              style={{ cursor: 'pointer' }}
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Manager Dashboard</h1>
              <p className="text-xs text-gray-500">Optimize your team's performance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="User profile" 
                className="w-10 h-10 rounded-full border-2 border-blue-100 hover:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
            <p className="text-sm text-gray-500">Tuesday, April 7, 2025</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/student">
              <Button variant="outline" className="flex items-center gap-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Student Portal
              </Button>
            </Link>
            <Button onClick={() => navigate('/dashboard')} 
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Total Team</p>
                  <h3 className="text-3xl font-bold text-gray-800">24</h3>
                  <p className="text-sm text-gray-500 mt-1">Active members</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Conversion Rate</p>
                  <h3 className="text-3xl font-bold text-gray-800">32%</h3>
                  <p className="text-sm text-blue-500 mt-1">
                    <span className="flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" /> 4.2% vs last month
                    </span>
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Avg. Response Time</p>
                  <h3 className="text-3xl font-bold text-gray-800">3.2h</h3>
                  <p className="text-sm text-gray-500 mt-1">Within threshold</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Team Capacity</p>
                  <h3 className="text-3xl font-bold text-gray-800">68%</h3>
                  <p className="text-sm text-gray-500 mt-1">20 open positions</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <PieChart className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="settings" className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100">
          <div className="px-6 pt-6 border-b border-blue-100">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 bg-blue-50">
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Settings className="w-4 h-4" /> AI Settings
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Users className="w-4 h-4" /> Team Management
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Calendar className="w-4 h-4" /> Pipeline Planner
              </TabsTrigger>
              <TabsTrigger value="unengaged" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <RefreshCw className="w-4 h-4" /> Unengaged Leads
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <InfoIcon className="w-4 h-4" /> Assignment Audit
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <BarChart2 className="w-4 h-4" /> Performance Analysis
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-sm hover:shadow-md transition-shadow border-blue-100">
                    <CardHeader className="border-b border-blue-50 bg-blue-50/50">
                      <CardTitle className="text-xl text-gray-800">AI Distribution Mode</CardTitle>
                      <CardDescription className="text-gray-500">
                        Select how leads should be distributed to your team
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Button 
                          variant={aiMode === "performance" ? "default" : "outline"} 
                          className={`w-full flex flex-col items-center py-6 ${
                            aiMode === "performance"
                              ? "bg-blue-500 hover:bg-blue-600 text-white"
                              : "hover:bg-blue-50 border-blue-100 text-gray-700"
                          }`}
                          onClick={() => handleModeChange("performance")}
                        >
                          <BarChart3 className={`w-6 h-6 mb-2 ${aiMode === "performance" ? "text-white" : "text-blue-500"}`} />
                          <span className="font-semibold">Performance Mode</span>
                          <span className="text-xs mt-1">Prioritize win rates</span>
                        </Button>
                        
                        <Button 
                          variant={aiMode === "balanced" ? "default" : "outline"} 
                          className={`w-full flex flex-col items-center py-6 ${
                            aiMode === "balanced"
                              ? "bg-blue-500 hover:bg-blue-600 text-white"
                              : "hover:bg-blue-50 border-blue-100 text-gray-700"
                          }`}
                          onClick={() => handleModeChange("balanced")}
                        >
                          <Users className={`w-6 h-6 mb-2 ${aiMode === "balanced" ? "text-white" : "text-blue-500"}`} />
                          <span className="font-semibold">Balanced Mode</span>
                          <span className="text-xs mt-1">Mix fairness + performance</span>
                        </Button>
                        
                        <Button 
                          variant={aiMode === "custom" ? "default" : "outline"} 
                          className={`w-full flex flex-col items-center py-6 ${
                            aiMode === "custom"
                              ? "bg-blue-500 hover:bg-blue-600 text-white"
                              : "hover:bg-blue-50 border-blue-100 text-gray-700"
                          }`}
                          onClick={() => handleModeChange("custom")}
                        >
                          <Settings className={`w-6 h-6 mb-2 ${aiMode === "custom" ? "text-white" : "text-blue-500"}`} />
                          <span className="font-semibold">Custom Mode</span>
                          <span className="text-xs mt-1">Set custom weights</span>
                        </Button>
                      </div>
                      
                      {aiMode === "custom" && <AIWeightSettings />}
                      
                      <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="text-md font-medium mb-4 text-gray-800">Response Time Threshold</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="response-time" className="text-gray-700">Expected response time</Label>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{responseTimeThreshold} hours</Badge>
                          </div>
                          <Slider 
                            id="response-time"
                            min={1} 
                            max={24} 
                            step={1} 
                            value={[responseTimeThreshold]} 
                            onValueChange={handleResponseTimeChange}
                            className="py-4"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Fast (1h)</span>
                            <span>Medium (12h)</span>
                            <span>Slow (24h)</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 flex items-center text-amber-500">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Leads will be flagged for re-engagement after {responseTimeThreshold} hours without response
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="shadow-sm hover:shadow-md transition-shadow border-blue-100">
                    <CardHeader className="border-b border-blue-50 bg-blue-50/50">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl text-gray-800">Current AI Performance</CardTitle>
                        <HelpCircle className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Conversion rate</span>
                          <span className="font-medium flex items-center text-blue-700">
                            +17.3% <ArrowUp className="h-4 w-4 ml-1" />
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Time saved</span>
                          <span className="font-medium text-blue-700">8.2 hrs/week</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Assignment accuracy</span>
                          <span className="font-medium text-blue-700">93%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm hover:shadow-md transition-shadow border-blue-100">
                    <CardHeader className="border-b border-blue-50 bg-blue-50/50">
                      <CardTitle className="text-xl text-gray-800">Top Success Factors</CardTitle>
                      <CardDescription className="text-gray-500">Variables driving success</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-blue-500 mr-3 h-6 w-6 flex items-center justify-center p-0 text-white">1</Badge>
                            <span className="font-medium text-gray-700">Response time</span>
                          </div>
                          <span className="text-sm font-bold text-blue-700">38%</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-blue-500 mr-3 h-6 w-6 flex items-center justify-center p-0 text-white">2</Badge>
                            <span className="font-medium text-gray-700">Prior success</span>
                          </div>
                          <span className="text-sm font-bold text-blue-700">27%</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-blue-500 mr-3 h-6 w-6 flex items-center justify-center p-0 text-white">3</Badge>
                            <span className="font-medium text-gray-700">Lead source</span>
                          </div>
                          <span className="text-sm font-bold text-blue-700">18%</span>
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
                  <Card className="shadow-sm border-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-blue-50 bg-blue-50/50">
                      <div>
                        <CardTitle className="text-xl text-gray-800">Team Members</CardTitle>
                        <CardDescription className="text-gray-500">Manage your team and their access</CardDescription>
                      </div>
                      <Button 
                        onClick={() => setShowTeamInvite(!showTeamInvite)} 
                        className={`flex items-center gap-2 ${showTeamInvite ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                      >
                        <UserPlus className="h-4 w-4" />
                        {showTeamInvite ? "Cancel" : "Invite Member"}
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {showTeamInvite && (
                        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <UserInviteForm />
                        </div>
                      )}
                      
                      <div className="rounded-lg overflow-hidden border border-blue-100">
                        <Table>
                          <TableHeader className="bg-blue-50">
                            <TableRow>
                              <TableHead className="text-gray-700">Name</TableHead>
                              <TableHead className="text-gray-700">Email</TableHead>
                              <TableHead className="text-gray-700">Role</TableHead>
                              <TableHead className="text-gray-700">Status</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="hover:bg-blue-50/50">
                              <TableCell className="font-medium">John Smith</TableCell>
                              <TableCell>john.smith@example.com</TableCell>
                              <TableCell>Admin</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">Edit</Button>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-blue-50/50">
                              <TableCell className="font-medium">Sarah Johnson</TableCell>
                              <TableCell>sarah.j@example.com</TableCell>
                              <TableCell>Manager</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">Edit</Button>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-blue-50/50">
                              <TableCell className="font-medium">Robert Chen</TableCell>
                              <TableCell>robert.c@example.com</TableCell>
                              <TableCell>Member</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">Resend</Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="shadow-sm border-blue-100">
                    <CardHeader className="border-b border-blue-50 bg-blue-50/50">
                      <CardTitle className="text-xl text-gray-800">Team Performance</CardTitle>
                      <CardDescription className="text-gray-500">Overall team metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">Average response time</span>
                            <span className="font-medium text-gray-800">3.2 hours</span>
                          </div>
                          <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <div className="mt-1 text-xs text-green-600 text-right">Excellent</div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">Conversion rate</span>
                            <span className="font-medium text-gray-800">32%</span>
                          </div>
                          <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '32%' }}></div>
                          </div>
                          <div className="mt-1 text-xs text-blue-600 text-right">Good</div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">Team capacity</span>
                            <span className="font-medium text-gray-800">68%</span>
                          </div>
                          <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: '68%' }}></div>
                          </div>
                          <div className="mt-1 text-xs text-amber-600 text-right">Moderate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pipeline">
              <PipelinePlanner />
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
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerDashboard;
