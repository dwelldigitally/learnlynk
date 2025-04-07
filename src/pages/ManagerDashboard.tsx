
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
    <div className="min-h-screen bg-[#F1F0FB]">
      <header className="bg-white shadow-sm border-b border-[#E5DEFF]/40 sticky top-0 z-10">
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
            <button className="relative p-2 text-gray-600 hover:text-[#9F86F3] hover:bg-[#F5F3FF] rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FEC6A1] rounded-full"></span>
            </button>
            <button className="p-2 text-gray-600 hover:text-[#9F86F3] hover:bg-[#F5F3FF] rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="User profile" 
                className="w-10 h-10 rounded-full border-2 border-[#E5DEFF] hover:border-[#9F86F3] transition-all"
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
              <Button variant="outline" className="flex items-center gap-2 border-[#E5DEFF] hover:border-[#9F86F3] hover:bg-[#F5F3FF] text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Student Portal
              </Button>
            </Link>
            <Button onClick={() => navigate('/dashboard')} 
              className="bg-[#9F86F3] hover:bg-[#8B73E0] text-white flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-[#D3E4FD] border-[#D3E4FD]/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Total Team</p>
                  <h3 className="text-3xl font-bold text-gray-800">24</h3>
                  <p className="text-sm text-gray-500 mt-1">Active members</p>
                </div>
                <div className="bg-white/60 p-3 rounded-full">
                  <Users className="h-8 w-8 text-[#6B98D3]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#F2FCE2] border-[#F2FCE2]/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Conversion Rate</p>
                  <h3 className="text-3xl font-bold text-gray-800">32%</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1 text-[#8BC34A]" /> 4.2% vs last month
                    </span>
                  </p>
                </div>
                <div className="bg-white/60 p-3 rounded-full">
                  <Activity className="h-8 w-8 text-[#8BC34A]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#FEF7CD] border-[#FEF7CD]/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Avg. Response Time</p>
                  <h3 className="text-3xl font-bold text-gray-800">3.2h</h3>
                  <p className="text-sm text-gray-500 mt-1">Within threshold</p>
                </div>
                <div className="bg-white/60 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-[#DBB634]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#FFDEE2] border-[#FFDEE2]/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Team Capacity</p>
                  <h3 className="text-3xl font-bold text-gray-800">68%</h3>
                  <p className="text-sm text-gray-500 mt-1">20 open positions</p>
                </div>
                <div className="bg-white/60 p-3 rounded-full">
                  <PieChart className="h-8 w-8 text-[#E57E94]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="settings" className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 pt-6 border-b border-gray-100">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 bg-[#F5F3FF]">
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-[#E5DEFF] data-[state=active]:text-[#6D4AFF]">
                <Settings className="w-4 h-4" /> AI Settings
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2 data-[state=active]:bg-[#E5DEFF] data-[state=active]:text-[#6D4AFF]">
                <Users className="w-4 h-4" /> Team Management
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="flex items-center gap-2 data-[state=active]:bg-[#E5DEFF] data-[state=active]:text-[#6D4AFF]">
                <Calendar className="w-4 h-4" /> Pipeline Planner
              </TabsTrigger>
              <TabsTrigger value="unengaged" className="flex items-center gap-2 data-[state=active]:bg-[#E5DEFF] data-[state=active]:text-[#6D4AFF]">
                <RefreshCw className="w-4 h-4" /> Unengaged Leads
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2 data-[state=active]:bg-[#E5DEFF] data-[state=active]:text-[#6D4AFF]">
                <InfoIcon className="w-4 h-4" /> Assignment Audit
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-[#E5DEFF] data-[state=active]:text-[#6D4AFF]">
                <BarChart2 className="w-4 h-4" /> Performance Analysis
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="shadow-sm hover:shadow-md transition-shadow border-gray-100">
                    <CardHeader className="border-b border-gray-50 bg-[#F5F3FF]/50">
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
                              ? "bg-[#D3E4FD] hover:bg-[#C2D6F3] text-[#2E6BBF]"
                              : "hover:bg-[#F0F5FE] border-[#D3E4FD] text-gray-700"
                          }`}
                          onClick={() => handleModeChange("performance")}
                        >
                          <BarChart3 className={`w-6 h-6 mb-2 ${aiMode === "performance" ? "text-[#2E6BBF]" : "text-[#6B98D3]"}`} />
                          <span className="font-semibold">Performance Mode</span>
                          <span className="text-xs mt-1">Prioritize win rates</span>
                        </Button>
                        
                        <Button 
                          variant={aiMode === "balanced" ? "default" : "outline"} 
                          className={`w-full flex flex-col items-center py-6 ${
                            aiMode === "balanced"
                              ? "bg-[#F2FCE2] hover:bg-[#E5F4CB] text-[#608B2C]"
                              : "hover:bg-[#F9FCF5] border-[#F2FCE2] text-gray-700"
                          }`}
                          onClick={() => handleModeChange("balanced")}
                        >
                          <Users className={`w-6 h-6 mb-2 ${aiMode === "balanced" ? "text-[#608B2C]" : "text-[#8BC34A]"}`} />
                          <span className="font-semibold">Balanced Mode</span>
                          <span className="text-xs mt-1">Mix fairness + performance</span>
                        </Button>
                        
                        <Button 
                          variant={aiMode === "custom" ? "default" : "outline"} 
                          className={`w-full flex flex-col items-center py-6 ${
                            aiMode === "custom"
                              ? "bg-[#E5DEFF] hover:bg-[#D1C4FF] text-[#6D4AFF]"
                              : "hover:bg-[#F5F3FF] border-[#E5DEFF] text-gray-700"
                          }`}
                          onClick={() => handleModeChange("custom")}
                        >
                          <Settings className={`w-6 h-6 mb-2 ${aiMode === "custom" ? "text-[#6D4AFF]" : "text-[#9F86F3]"}`} />
                          <span className="font-semibold">Custom Mode</span>
                          <span className="text-xs mt-1">Set custom weights</span>
                        </Button>
                      </div>
                      
                      {aiMode === "custom" && <AIWeightSettings />}
                      
                      <div className="mt-6 bg-[#F1F0FB] p-6 rounded-lg border border-gray-100">
                        <h3 className="text-md font-medium mb-4 text-gray-800">Response Time Threshold</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="response-time" className="text-gray-700">Expected response time</Label>
                            <Badge className="bg-[#E5DEFF] text-[#6D4AFF] hover:bg-[#D1C4FF]">{responseTimeThreshold} hours</Badge>
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
                          <p className="text-sm text-muted-foreground mt-2 flex items-center text-[#DBB634]">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Leads will be flagged for re-engagement after {responseTimeThreshold} hours without response
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="shadow-sm hover:shadow-md transition-shadow border-gray-100">
                    <CardHeader className="border-b border-gray-50 bg-[#F5F3FF]/50">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl text-gray-800">Current AI Performance</CardTitle>
                        <HelpCircle className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-[#F2FCE2] rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Conversion rate</span>
                          <span className="font-medium flex items-center text-[#608B2C]">
                            +17.3% <ArrowUp className="h-4 w-4 ml-1" />
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#D3E4FD] rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Time saved</span>
                          <span className="font-medium text-[#2E6BBF]">8.2 hrs/week</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#E5DEFF] rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Assignment accuracy</span>
                          <span className="font-medium text-[#6D4AFF]">93%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm hover:shadow-md transition-shadow border-gray-100">
                    <CardHeader className="border-b border-gray-50 bg-[#F5F3FF]/50">
                      <CardTitle className="text-xl text-gray-800">Top Success Factors</CardTitle>
                      <CardDescription className="text-gray-500">Variables driving success</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="bg-[#D3E4FD] p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-[#2E6BBF] mr-3 h-6 w-6 flex items-center justify-center p-0">1</Badge>
                            <span className="font-medium text-gray-700">Response time</span>
                          </div>
                          <span className="text-sm font-bold text-[#2E6BBF]">38%</span>
                        </div>
                        <div className="bg-[#F2FCE2] p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-[#608B2C] mr-3 h-6 w-6 flex items-center justify-center p-0">2</Badge>
                            <span className="font-medium text-gray-700">Prior success</span>
                          </div>
                          <span className="text-sm font-bold text-[#608B2C]">27%</span>
                        </div>
                        <div className="bg-[#FEF7CD] p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-[#DBB634] mr-3 h-6 w-6 flex items-center justify-center p-0">3</Badge>
                            <span className="font-medium text-gray-700">Lead source</span>
                          </div>
                          <span className="text-sm font-bold text-[#DBB634]">18%</span>
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
                  <Card className="shadow-sm border-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 bg-[#F5F3FF]/50">
                      <div>
                        <CardTitle className="text-xl text-gray-800">Team Members</CardTitle>
                        <CardDescription className="text-gray-500">Manage your team and their access</CardDescription>
                      </div>
                      <Button 
                        onClick={() => setShowTeamInvite(!showTeamInvite)} 
                        className={`flex items-center gap-2 ${showTeamInvite ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-[#9F86F3] hover:bg-[#8B73E0] text-white'}`}
                      >
                        <UserPlus className="h-4 w-4" />
                        {showTeamInvite ? "Cancel" : "Invite Member"}
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {showTeamInvite && (
                        <div className="mb-6 bg-[#F5F3FF] p-4 rounded-lg border border-[#E5DEFF]">
                          <UserInviteForm />
                        </div>
                      )}
                      
                      <div className="rounded-lg overflow-hidden border border-gray-100">
                        <Table>
                          <TableHeader className="bg-[#F5F3FF]">
                            <TableRow>
                              <TableHead className="text-gray-700">Name</TableHead>
                              <TableHead className="text-gray-700">Email</TableHead>
                              <TableHead className="text-gray-700">Role</TableHead>
                              <TableHead className="text-gray-700">Status</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="hover:bg-[#F5F3FF]/50">
                              <TableCell className="font-medium">John Smith</TableCell>
                              <TableCell>john.smith@example.com</TableCell>
                              <TableCell>Admin</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-[#F2FCE2] text-[#608B2C] border-[#E5F4CB]">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-[#6D4AFF] hover:text-[#5739DF] hover:bg-[#F5F3FF]">Edit</Button>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-[#F5F3FF]/50">
                              <TableCell className="font-medium">Sarah Johnson</TableCell>
                              <TableCell>sarah.j@example.com</TableCell>
                              <TableCell>Manager</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-[#F2FCE2] text-[#608B2C] border-[#E5F4CB]">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-[#6D4AFF] hover:text-[#5739DF] hover:bg-[#F5F3FF]">Edit</Button>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-[#F5F3FF]/50">
                              <TableCell className="font-medium">Robert Chen</TableCell>
                              <TableCell>robert.c@example.com</TableCell>
                              <TableCell>Member</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-[#FEF7CD] text-[#DBB634] border-[#F3EBB2]">Pending</Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-[#6D4AFF] hover:text-[#5739DF] hover:bg-[#F5F3FF]">Resend</Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="shadow-sm border-gray-100">
                    <CardHeader className="border-b border-gray-50 bg-[#F5F3FF]/50">
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
                          <div className="h-2 bg-[#F1F0FB] rounded-full overflow-hidden">
                            <div className="bg-[#8BC34A] h-full rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <div className="mt-1 text-xs text-[#608B2C] text-right">Excellent</div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">Conversion rate</span>
                            <span className="font-medium text-gray-800">32%</span>
                          </div>
                          <div className="h-2 bg-[#F1F0FB] rounded-full overflow-hidden">
                            <div className="bg-[#6B98D3] h-full rounded-full" style={{ width: '32%' }}></div>
                          </div>
                          <div className="mt-1 text-xs text-[#2E6BBF] text-right">Good</div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">Team capacity</span>
                            <span className="font-medium text-gray-800">68%</span>
                          </div>
                          <div className="h-2 bg-[#F1F0FB] rounded-full overflow-hidden">
                            <div className="bg-[#DBB634] h-full rounded-full" style={{ width: '68%' }}></div>
                          </div>
                          <div className="mt-1 text-xs text-[#DBB634] text-right">Moderate</div>
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
