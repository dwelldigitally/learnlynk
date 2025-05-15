import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Users, BarChart3, 
  ArrowUp, Clock, Calendar,
  ChevronRight, Activity, Bell, PieChart, HelpCircle,
  Settings, Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data for advisors
  const advisors = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      maxAssignments: 10,
      active: true,
      schedule: "Monday - Friday",
      performanceTier: "Top Performer",
      leadCount: 23,
      conversionRate: "32%"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      maxAssignments: 8,
      active: true,
      schedule: "Tuesday - Saturday",
      performanceTier: "Advanced",
      leadCount: 17,
      conversionRate: "28%"
    },
    {
      id: 3,
      name: "Michael Lee",
      email: "michael.l@example.com",
      maxAssignments: 6,
      active: false,
      schedule: "Monday - Friday",
      performanceTier: "Standard",
      leadCount: 12,
      conversionRate: "21%"
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.c@example.com",
      maxAssignments: 12,
      active: true,
      schedule: "Wednesday - Sunday",
      performanceTier: "Top Performer",
      leadCount: 26,
      conversionRate: "35%"
    },
    {
      id: 5,
      name: "Robert Williams",
      email: "robert.w@example.com",
      maxAssignments: 8,
      active: true,
      schedule: "Monday - Friday",
      performanceTier: "Advanced",
      leadCount: 14,
      conversionRate: "24%"
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  
  const handleToggleStatus = (advisorId: number, currentStatus: boolean) => {
    // In a real app, this would update the backend
    toast({
      title: "Advisor Status Updated",
      description: `Advisor's lead flow is now ${currentStatus ? 'inactive' : 'active'}`,
    });
  };
  
  const handleScheduleChange = (advisorId: number) => {
    // This would typically open a schedule editor modal
    toast({
      title: "Schedule Adjustment",
      description: "Schedule adjustment interface would open here",
    });
  };
  
  const handleTierChange = (advisorId: number, newTier: string) => {
    toast({
      title: "Performance Tier Changed",
      description: `Performance tier updated to ${newTier}`,
    });
  };
  
  const handleMaxAssignmentsChange = (advisorId: number, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      toast({
        title: "Max Assignments Updated",
        description: `Maximum assignments changed to ${numValue} per week`,
      });
    }
  };
  
  // Calculate capacity percentage
  const getCapacityPercentage = (leadCount: number, maxAssignments: number) => {
    return Math.min(Math.round((leadCount / maxAssignments) * 100), 100);
  };
  
  // Get color for the progress bar based on capacity
  const getCapacityColorClass = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-blue-500"; 
  };
  
  // Filter advisors based on search query
  const filteredAdvisors = advisors.filter(advisor => 
    advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    advisor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    advisor.performanceTier.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        
        {/* Advisor Management Tab - Now the only tab */}
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100">
          <CardHeader className="border-b border-blue-100 bg-blue-50/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-gray-800">Advisor Management</CardTitle>
                <CardDescription className="text-gray-500">
                  Manage your advisors' workload, status, and performance settings
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search advisors..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-blue-100 focus:border-blue-400 w-[300px]"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-blue-50/50">
                  <TableRow>
                    <TableHead className="text-gray-700 font-medium">Advisor</TableHead>
                    <TableHead className="text-gray-700 font-medium">Max Assignments</TableHead>
                    <TableHead className="text-gray-700 font-medium">Status</TableHead>
                    <TableHead className="text-gray-700 font-medium">Schedule</TableHead>
                    <TableHead className="text-gray-700 font-medium">Performance Tier</TableHead>
                    <TableHead className="text-gray-700 font-medium">Capacity</TableHead>
                    <TableHead className="text-gray-700 font-medium">Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvisors.map((advisor) => (
                    <TableRow key={advisor.id} className="hover:bg-blue-50/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-500 font-semibold">
                              {advisor.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{advisor.name}</div>
                            <div className="text-sm text-gray-500">{advisor.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          defaultValue={advisor.maxAssignments} 
                          className="w-16 h-9 text-center"
                          min={1}
                          max={20}
                          onChange={(e) => handleMaxAssignmentsChange(advisor.id, e.target.value)}
                        />
                        <div className="text-xs text-gray-500 mt-1">per week</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={advisor.active} 
                            onCheckedChange={() => handleToggleStatus(advisor.id, advisor.active)}
                          />
                          <span className={advisor.active ? "text-green-600 text-sm" : "text-gray-500 text-sm"}>
                            {advisor.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="mr-2 text-sm text-gray-600">{advisor.schedule}</div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => handleScheduleChange(advisor.id)}
                          >
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span className="text-xs">Adjust</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={advisor.performanceTier}
                          onValueChange={(value) => handleTierChange(advisor.id, value)}
                        >
                          <SelectTrigger className="w-32 border-blue-100">
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Top Performer">Top Performer</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="w-full">
                          {(() => {
                            const capacityPercentage = getCapacityPercentage(advisor.leadCount, advisor.maxAssignments);
                            const colorClass = getCapacityColorClass(capacityPercentage);
                            return (
                              <>
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-gray-600">{advisor.leadCount} of {advisor.maxAssignments}</span>
                                  <span className="text-xs font-medium">{capacityPercentage}%</span>
                                </div>
                                <Progress 
                                  value={capacityPercentage} 
                                  className="h-2 bg-gray-100"
                                  indicatorClassName={colorClass} 
                                />
                              </>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{advisor.conversionRate}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
