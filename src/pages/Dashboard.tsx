
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
 } from 'recharts';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  ArrowUpRight,
  BellRing,
  HelpCircle,
  Info,
  Settings,
  Users
} from "lucide-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [assignmentMode, setAssignmentMode] = useState<'ai' | 'round-robin'>('ai');
  
  const performanceData = [
    { name: 'Jan', ai: 65, roundRobin: 40 },
    { name: 'Feb', ai: 68, roundRobin: 43 },
    { name: 'Mar', ai: 73, roundRobin: 45 },
    { name: 'Apr', ai: 78, roundRobin: 42 },
    { name: 'May', ai: 82, roundRobin: 44 },
    { name: 'Jun', ai: 87, roundRobin: 45 },
  ];
  
  const teamPerformance = [
    { name: 'John Smith', conversion: 78, leads: 42, revenue: 385000 },
    { name: 'Amy Wilson', conversion: 69, leads: 35, revenue: 276000 },
    { name: 'Mike Lee', conversion: 82, leads: 39, revenue: 412000 },
  ];
  
  const pieData = [
    { name: 'Technology', value: 35 },
    { name: 'Healthcare', value: 25 },
    { name: 'Finance', value: 20 },
    { name: 'Manufacturing', value: 15 },
    { name: 'Other', value: 5 },
  ];
  
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  const recentLeads = [
    { id: "L-1028", name: "Quantum Solutions", advisor: "John Smith", score: 94 },
    { id: "L-1027", name: "Health Partners", advisor: "Amy Wilson", score: 91 },
    { id: "L-1026", name: "Metro Finance", advisor: "Mike Lee", score: 87 },
    { id: "L-1025", name: "Industrial Group", advisor: "John Smith", score: 89 },
    { id: "L-1024", name: "Digital Innovations", advisor: "Mike Lee", score: 92 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-saas-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">AI</span>
              </div>
              <span className="font-bold text-xl">adaptify</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700 relative">
                <BellRing className="w-5 h-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-saas-blue rounded-full flex items-center justify-center text-white">
                <span className="text-sm">JS</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">
              Monitor your lead assignment performance and team metrics
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="border-gray-300"
            >
              Restart Onboarding
            </Button>
            <Button className="bg-saas-blue hover:bg-blue-600">
              Contact Support
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">AI Impact</h2>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Last 30 days
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600 text-sm">Conversion Rate</span>
                  <div className="flex items-center text-green-600">
                    <span className="font-medium">+15.3%</span>
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600 text-sm">Revenue Growth</span>
                  <div className="flex items-center text-green-600">
                    <span className="font-medium">+23.8%</span>
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-saas-blue h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600 text-sm">Lead Response Time</span>
                  <div className="flex items-center text-green-600">
                    <span className="font-medium">-27.5%</span>
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">AI Accuracy</h2>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                97.6% confidence
              </span>
            </div>
            <div className="flex justify-center items-center h-32">
              <div className="relative">
                <svg className="w-32 h-32" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeDasharray="97.6, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold">97.6%</div>
                  <div className="text-xs text-gray-500">accuracy</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Lead Distribution</h2>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                By Industry
              </span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-4">
              <h2 className="font-semibold text-lg mb-2">Performance Comparison</h2>
              <div className="flex space-x-4">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    assignmentMode === 'ai' 
                      ? 'bg-saas-blue text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setAssignmentMode('ai')}
                >
                  AI Assignment
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    assignmentMode === 'round-robin' 
                      ? 'bg-saas-blue text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setAssignmentMode('round-robin')}
                >
                  Round Robin
                </button>
              </div>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                  <Legend />
                  <Bar 
                    dataKey="ai" 
                    name="AI Assignment" 
                    fill="#4f46e5" 
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                  <Bar 
                    dataKey="roundRobin" 
                    name="Round Robin" 
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Recent Assignments</h2>
              <Button variant="outline" size="sm" className="h-8 text-xs">View All</Button>
            </div>
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{lead.advisor}</div>
                    <div className="text-xs text-green-600">{lead.score}% match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <Tabs defaultValue="performance">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Team Analytics</h2>
              <TabsList>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leads Assigned
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue Generated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamPerformance.map((member) => (
                      <tr key={member.name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <Users className="w-4 h-4 text-saas-blue" />
                            </div>
                            <div className="font-medium">{member.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{member.conversion}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{member.leads}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">${member.revenue.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-saas-blue h-2 rounded-full" 
                              style={{ width: `${member.conversion}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="distribution">
              <div className="text-center py-12 text-gray-500">
                <div className="mb-4">
                  <Info className="w-12 h-12 mx-auto text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-2">Distribution Analytics</h3>
                <p className="max-w-md mx-auto">
                  Detailed lead distribution analytics are available in the full version.
                  Upgrade your plan to access these features.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="configuration">
              <div className="text-center py-12 text-gray-500">
                <div className="mb-4">
                  <Settings className="w-12 h-12 mx-auto text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-2">Team Configuration</h3>
                <p className="max-w-md mx-auto">
                  Manage your team settings, roles, and assignment rules.
                  Click below to access the configuration page.
                </p>
                <Button className="mt-4 bg-saas-blue hover:bg-blue-600">
                  Configure Team
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
