
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-md border-b border-indigo-100 sticky top-0 z-10">
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
              <h1 className="text-xl font-semibold text-indigo-900">Manager Dashboard</h1>
              <p className="text-xs text-indigo-500">Optimize your team's performance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="User profile" 
                className="w-10 h-10 rounded-full border-2 border-indigo-300 hover:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">Manager Dashboard</h1>
            <p className="text-sm text-indigo-600">Tuesday, April 7, 2025</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/student">
              <Button variant="outline" className="flex items-center gap-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Student Portal
              </Button>
            </Link>
            <Button onClick={() => navigate('/dashboard')} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-blue-100">Total Team</p>
                  <h3 className="text-3xl font-bold">24</h3>
                  <p className="text-sm text-blue-100 mt-1">Active members</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-green-100">Conversion Rate</p>
                  <h3 className="text-3xl font-bold">32%</h3>
                  <p className="text-sm text-green-100 mt-1">
                    <span className="flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" /> 4.2% vs last month
                    </span>
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Activity className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-amber-100">Avg. Response Time</p>
                  <h3 className="text-3xl font-bold">3.2h</h3>
                  <p className="text-sm text-amber-100 mt-1">Within threshold</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-purple-100">Team Capacity</p>
                  <h3 className="text-3xl font-bold">68%</h3>
                  <p className="text-sm text-purple-100 mt-1">20 open positions</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <PieChart className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="settings" className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 pt-6 border-b border-gray-200">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2">
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900">
                <Settings className="w-4 h-4" /> AI Settings
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900">
                <Users className="w-4 h-4" /> Team Management
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900">
                <Calendar className="w-4 h-4" /> Pipeline Planner
              </TabsTrigger>
              <TabsTrigger value="unengaged" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900">
                <RefreshCw className="w-4 h-4" /> Unengaged Leads
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900">
                <InfoIcon className="w-4 h-4" /> Assignment Audit
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900">
                <BarChart2 className="w-4 h-4" /> Performance Analysis
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-sm hover:shadow-md transition-shadow border-indigo-100">
                    <CardHeader className="border-b border-indigo-50 bg-indigo-50/50">
                      <CardTitle className="text-xl text-indigo-900">AI Distribution Mode</CardTitle>
                      <CardDescription className="text-indigo-700">
                        Select how leads should be distributed to your team
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Button 
                          variant={aiMode === "performance" ? "default" : "outline"} 
                          className={`w-full flex flex-col items-center py-6 ${
                            aiMode === "performance"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "hover:bg-blue-50 border-blue-200 text-blue-800"
                          }`}
                          onClick={() => handleModeChange("performance")}
                        >
                          <BarChart3 className={`w-6 h-6 mb-2 ${aiMode === "performance" ? "" : "text-blue-600"}`} />
                          <span className="font-semibold">Performance Mode</span>
                          <span className="text-xs mt-1">Prioritize win rates</span>
                        </Button>
                        
                        <Button 
                          variant={aiMode === "balanced" ? "default" : "outline"} 
                          className={`w-full flex flex-col items-center py-6 ${
                            aiMode === "balanced"
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "hover:bg-green-50 border-green-200 text-green-800"
                          }`}
                          onClick={() => handleModeChange("balanced")}
                        >
                          <Users className={`w-6 h-6 mb-2 ${aiMode === "balanced" ? "" : "text-green-600"}`} />
                          <span className="font-semibold">Balanced Mode</span>
                          <span className="text-xs mt-1">Mix fairness + performance</span>
                        </Button>
                        
                        <Button 
                          variant={aiMode === "custom" ? "default" : "outline"} 
                          className={`w-full flex flex-col items-center py-6 ${
                            aiMode === "custom"
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "hover:bg-purple-50 border-purple-200 text-purple-800"
                          }`}
                          onClick={() => handleModeChange("custom")}
                        >
                          <Settings className={`w-6 h-6 mb-2 ${aiMode === "custom" ? "" : "text-purple-600"}`} />
                          <span className="font-semibold">Custom Mode</span>
                          <span className="text-xs mt-1">Set custom weights</span>
                        </Button>
                      </div>
                      
                      {aiMode === "custom" && <AIWeightSettings />}
                      
                      <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <h3 className="text-md font-medium mb-4 text-gray-800">Response Time Threshold</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="response-time" className="text-gray-700">Expected response time</Label>
                            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">{responseTimeThreshold} hours</Badge>
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
                          <p className="text-sm text-muted-foreground mt-2 flex items-center text-amber-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Leads will be flagged for re-engagement after {responseTimeThreshold} hours without response
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="shadow-sm hover:shadow-md transition-shadow border-indigo-100">
                    <CardHeader className="border-b border-indigo-50 bg-indigo-50/50">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl text-indigo-900">Current AI Performance</CardTitle>
                        <HelpCircle className="h-5 w-5 text-indigo-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-800">Conversion rate</span>
                          <span className="font-medium flex items-center text-green-600">
                            +17.3% <ArrowUp className="h-4 w-4 ml-1" />
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-800">Time saved</span>
                          <span className="font-medium text-blue-600">8.2 hrs/week</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm font-medium text-purple-800">Assignment accuracy</span>
                          <span className="font-medium text-purple-600">93%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm hover:shadow-md transition-shadow border-indigo-100">
                    <CardHeader className="border-b border-indigo-50 bg-indigo-50/50">
                      <CardTitle className="text-xl text-indigo-900">Top Success Factors</CardTitle>
                      <CardDescription className="text-indigo-700">Variables driving success</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-blue-600 mr-3 h-6 w-6 flex items-center justify-center p-0">1</Badge>
                            <span className="font-medium text-blue-800">Response time</span>
                          </div>
                          <span className="text-sm font-bold text-blue-700">38%</span>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-green-600 mr-3 h-6 w-6 flex items-center justify-center p-0">2</Badge>
                            <span className="font-medium text-green-800">Prior success</span>
                          </div>
                          <span className="text-sm font-bold text-green-700">27%</span>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-amber-500 mr-3 h-6 w-6 flex items-center justify-center p-0">3</Badge>
                            <span className="font-medium text-amber-800">Lead source</span>
                          </div>
                          <span className="text-sm font-bold text-amber-700">18%</span>
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
                  <Card className="shadow-sm border-indigo-100">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-indigo-50 bg-indigo-50/50">
                      <div>
                        <CardTitle className="text-xl text-indigo-900">Team Members</CardTitle>
                        <CardDescription className="text-indigo-700">Manage your team and their access</CardDescription>
                      </div>
                      <Button 
                        onClick={() => setShowTeamInvite(!showTeamInvite)} 
                        className={`flex items-center gap-2 ${showTeamInvite ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                      >
                        <UserPlus className="h-4 w-4" />
                        {showTeamInvite ? "Cancel" : "Invite Member"}
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {showTeamInvite && (
                        <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                          <UserInviteForm />
                        </div>
                      )}
                      
                      <div className="rounded-lg overflow-hidden border border-indigo-100">
                        <Table>
                          <TableHeader className="bg-indigo-50">
                            <TableRow>
                              <TableHead className="text-indigo-900">Name</TableHead>
                              <TableHead className="text-indigo-900">Email</TableHead>
                              <TableHead className="text-indigo-900">Role</TableHead>
                              <TableHead className="text-indigo-900">Status</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="hover:bg-indigo-50/50">
                              <TableCell className="font-medium">John Smith</TableCell>
                              <TableCell>john.smith@example.com</TableCell>
                              <TableCell>Admin</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">Edit</Button>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-indigo-50/50">
                              <TableCell className="font-medium">Sarah Johnson</TableCell>
                              <TableCell>sarah.j@example.com</TableCell>
                              <TableCell>Manager</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">Edit</Button>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-indigo-50/50">
                              <TableCell className="font-medium">Robert Chen</TableCell>
                              <TableCell>robert.c@example.com</TableCell>
                              <TableCell>Member</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">Resend</Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="shadow-sm border-indigo-100">
                    <CardHeader className="border-b border-indigo-50 bg-indigo-50/50">
                      <CardTitle className="text-xl text-indigo-900">Team Performance</CardTitle>
                      <CardDescription className="text-indigo-700">Overall team metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-indigo-800">Average response time</span>
                            <span className="font-medium text-indigo-900">3.2 hours</span>
                          </div>
                          <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <div className="mt-1 text-xs text-green-600 text-right">Excellent</div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-indigo-800">Conversion rate</span>
                            <span className="font-medium text-indigo-900">32%</span>
                          </div>
                          <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '32%' }}></div>
                          </div>
                          <div className="mt-1 text-xs text-blue-600 text-right">Good</div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-indigo-800">Team capacity</span>
                            <span className="font-medium text-indigo-900">68%</span>
                          </div>
                          <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
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
