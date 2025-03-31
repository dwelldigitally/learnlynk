
import React from "react";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/b3f2384b-be58-4f06-8c20-a1cbc24a6ab2.png" 
              alt="Learnlynk Logo" 
              className="h-8 mr-4"
            />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/manager')}
            >
              <Users className="w-4 h-4" />
              Manager View
            </Button>
            <button className="text-gray-600 hover:text-saas-blue">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </button>
            <button className="text-gray-600 hover:text-saas-blue">
              <Settings className="w-6 h-6" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Leads</h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">1,248</p>
              <span className="text-green-600 text-sm flex items-center">
                +12% 
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Conversion Rate</h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">42.5%</p>
              <span className="text-green-600 text-sm flex items-center">
                +7.2% 
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-2">AI Impact</h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">+35%</p>
              <span className="text-blue-600 text-sm">vs. Round Robin</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4">Lead Distribution Overview</h2>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                <p className="text-gray-500">Chart Placeholder</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Lead Assignments</h2>
                <button className="text-saas-blue hover:underline text-sm">View All</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm">
                    <th className="pb-3 font-medium">Lead</th>
                    <th className="pb-3 font-medium">Assigned To</th>
                    <th className="pb-3 font-medium">Source</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "John Smith", rep: "Amy Johnson", source: "Website", date: "Today", confidence: "High" },
                    { name: "Maria Garcia", rep: "David Chen", source: "Email", date: "Today", confidence: "Medium" },
                    { name: "Robert Wilson", rep: "Sarah Lee", source: "Phone", date: "Yesterday", confidence: "High" },
                    { name: "Emma Brown", rep: "Michael Kim", source: "Referral", date: "Yesterday", confidence: "Very High" },
                    { name: "James Davis", rep: "Amy Johnson", source: "Website", date: "2 days ago", confidence: "Medium" },
                  ].map((lead, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-3">{lead.name}</td>
                      <td className="py-3">{lead.rep}</td>
                      <td className="py-3">{lead.source}</td>
                      <td className="py-3 text-gray-500 text-sm">{lead.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.confidence === "High" || lead.confidence === "Very High" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {lead.confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Team Performance</h2>
              <div className="space-y-4">
                {[
                  { name: "Amy Johnson", leads: 45, conversion: 48, tier: "A" },
                  { name: "David Chen", leads: 38, conversion: 42, tier: "A" },
                  { name: "Sarah Lee", leads: 32, conversion: 39, tier: "B" },
                  { name: "Michael Kim", leads: 27, conversion: 35, tier: "B" },
                ].map((rep, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {rep.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{rep.name}</p>
                        <p className="text-xs text-gray-500">Tier {rep.tier} • {rep.leads} leads</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{rep.conversion}%</p>
                      <p className="text-xs text-gray-500">Conversion</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-saas-blue hover:underline text-sm mt-4 w-full text-center">
                View All Team Members
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Team capacity:</span> Your reps are at 78% capacity. Consider adding more team members.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Opportunity:</span> Website leads have a 45% higher conversion rate. Consider increasing this channel.
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Warning:</span> Email lead response time has increased by 4 hours on average.
                  </p>
                </div>
              </div>
              
              <Button
                className="w-full mt-4"
                onClick={() => navigate('/manager')}
              >
                <Users className="w-4 h-4 mr-2" />
                Open Manager Dashboard
              </Button>
            </div>
            
            <div className="bg-saas-blue p-6 rounded-lg shadow-sm text-white">
              <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
              <p className="text-white/80 text-sm mb-4">
                Our support team is ready to assist you with any questions.
              </p>
              <button className="bg-white text-saas-blue py-2 px-4 rounded font-medium text-sm w-full">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot for dashboard */}
      <Chatbot mode="dashboard" />
    </div>
  );
};

export default Dashboard;
