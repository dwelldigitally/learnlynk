
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const PerformanceComparison: React.FC = () => {
  // Mock data for the charts
  const conversionData = [
    { name: 'Week 1', AI: 42, Manual: 38 },
    { name: 'Week 2', AI: 44, Manual: 37 },
    { name: 'Week 3', AI: 47, Manual: 39 },
    { name: 'Week 4', AI: 51, Manual: 40 },
    { name: 'Week 5', AI: 53, Manual: 41 },
    { name: 'Week 6', AI: 56, Manual: 42 },
  ];
  
  const timeData = [
    { name: 'Week 1', AI: 5.2, Manual: 12.4 },
    { name: 'Week 2', AI: 4.8, Manual: 12.1 },
    { name: 'Week 3', AI: 4.5, Manual: 11.9 },
    { name: 'Week 4', AI: 4.1, Manual: 12.2 },
    { name: 'Week 5', AI: 3.8, Manual: 12.0 },
    { name: 'Week 6', AI: 3.5, Manual: 11.8 },
  ];
  
  const repPerformanceData = [
    { name: 'Amy Johnson', AIAssigned: 21, ManualAssigned: 15, AIConversion: 48, ManualConversion: 41 },
    { name: 'David Chen', AIAssigned: 18, ManualAssigned: 19, AIConversion: 42, ManualConversion: 37 },
    { name: 'Sarah Lee', AIAssigned: 16, ManualAssigned: 14, AIConversion: 39, ManualConversion: 33 },
    { name: 'Michael Kim', AIAssigned: 14, ManualAssigned: 16, AIConversion: 35, ManualConversion: 31 },
    { name: 'John Smith', AIAssigned: 19, ManualAssigned: 18, AIConversion: 44, ManualConversion: 38 },
  ];
  
  const driverData = [
    { name: 'Response Time', impact: 35 },
    { name: 'Prior Success', impact: 28 },
    { name: 'Lead Source', impact: 18 },
    { name: 'Industry Match', impact: 12 },
    { name: 'Geography', impact: 7 },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="conversion">
        <TabsList className="mb-4">
          <TabsTrigger value="conversion">Conversion Rates</TabsTrigger>
          <TabsTrigger value="time">Time Savings</TabsTrigger>
          <TabsTrigger value="reps">Rep Performance</TabsTrigger>
          <TabsTrigger value="drivers">Success Drivers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle>AI vs. Manual Assignment - Conversion Rates</CardTitle>
              <CardDescription>
                Compare conversion rates between AI-assigned leads and manually assigned leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Conversion %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="AI" 
                      stroke="#4f46e5" 
                      strokeWidth={2} 
                      name="AI Assignment" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Manual" 
                      stroke="#94a3b8" 
                      strokeWidth={2} 
                      name="Manual Assignment" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Analysis</h4>
                <p className="text-sm text-blue-700">
                  AI-assigned leads show a consistent 14-18% higher conversion rate compared to manually assigned leads. 
                  The gap has increased over time as the AI model continues to learn from successful outcomes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Time Saved in Lead Distribution</CardTitle>
              <CardDescription>
                Hours spent weekly on lead assignment process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Hours per Week', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} hours`, '']} />
                    <Legend />
                    <Bar dataKey="AI" fill="#4f46e5" name="AI Assignment" />
                    <Bar dataKey="Manual" fill="#94a3b8" name="Manual Assignment" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 mb-1">Analysis</h4>
                <p className="text-sm text-green-700">
                  The AI-powered lead distribution process saves approximately 8.3 hours per week compared to the manual process.
                  This represents a 70% reduction in time spent on assignment tasks, allowing sales managers to focus on strategy and coaching.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reps">
          <Card>
            <CardHeader>
              <CardTitle>Individual Rep Performance</CardTitle>
              <CardDescription>
                Comparing conversion rates by rep with AI vs. manual assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={repPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="AIConversion" fill="#4f46e5" name="AI Assignment Conversion %" />
                    <Bar dataKey="ManualConversion" fill="#94a3b8" name="Manual Assignment Conversion %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h4 className="font-medium text-purple-800 mb-1">Analysis</h4>
                <p className="text-sm text-purple-700">
                  Every team member shows improved performance with AI-assigned leads. The average improvement is 7.2 percentage points.
                  Amy Johnson shows the highest benefit from AI assignment with a 17% relative improvement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Success Driving Factors</CardTitle>
              <CardDescription>
                Variables that have the highest impact on successful conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={driverData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Impact %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Impact']} />
                    <Bar dataKey="impact" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h4 className="font-medium text-amber-800 mb-1">Recommendation</h4>
                <p className="text-sm text-amber-700">
                  Based on your data, response time and prior success history are the strongest indicators of 
                  successful lead conversion. Consider increasing the weighting for these factors in your AI settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceComparison;
