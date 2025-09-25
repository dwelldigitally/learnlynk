import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Calendar,
  FileText,
  PenTool,
  Bell,
  LogOut,
  User,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PreceptorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");

  const stats = [
    { label: "Active Students", value: "8", icon: Users, color: "text-blue-600" },
    { label: "Pending Reviews", value: "12", icon: Clock, color: "text-orange-600" },
    { label: "Completed Today", value: "5", icon: CheckCircle, color: "text-green-600" },
    { label: "Overdue Items", value: "2", icon: AlertCircle, color: "text-red-600" }
  ];

  const pendingReviews = [
    {
      id: 1,
      student: "Sarah Chen",
      type: "Attendance",
      submitted: "2 hours ago",
      priority: "high",
      details: "8.5 hours - Cardiac Unit",
      action: "review-attendance"
    },
    {
      id: 2,
      student: "Michael Torres",
      type: "Competency",
      submitted: "4 hours ago",
      priority: "medium",
      details: "IV Insertion Technique",
      action: "review-competency"
    },
    {
      id: 3,
      student: "Emily Davis",
      type: "Reflection",
      submitted: "1 day ago",
      priority: "medium",
      details: "Weekly Journal Entry",
      action: "review-reflection"
    },
    {
      id: 4,
      student: "James Wilson",
      type: "Evaluation",
      submitted: "6 hours ago",
      priority: "high",
      details: "Midterm Assessment",
      action: "review-evaluation"
    }
  ];

  const recentActivity = [
    { student: "Sarah Chen", action: "Completed competency review", time: "10 minutes ago" },
    { student: "Michael Torres", action: "Submitted attendance record", time: "2 hours ago" },
    { student: "Lisa Rodriguez", action: "Approved evaluation", time: "1 day ago" },
    { student: "David Kim", action: "Provided feedback", time: "2 days ago" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Attendance": return Clock;
      case "Competency": return CheckCircle;
      case "Reflection": return FileText;
      case "Evaluation": return PenTool;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full p-2">
                  <Stethoscope className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Preceptor Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Dr. Patricia Johnson • Cardiac ICU</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/preceptor/profile')}
              >
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/preceptor/login")}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Reviews */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Pending Reviews</h2>
                <Badge variant="secondary">{pendingReviews.length} items</Badge>
              </div>
              
              <div className="space-y-3">
                {pendingReviews.map((review) => {
                  const IconComponent = getTypeIcon(review.type);
                  return (
                    <div key={review.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.student}</span>
                            <Badge className={getPriorityColor(review.priority)} variant="secondary">
                              {review.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.type} • {review.details}</p>
                          <p className="text-xs text-muted-foreground">Submitted {review.submitted}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/preceptor/${review.action}/${review.id}`)}
                      >
                        Review
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.student}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 mt-4">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/preceptor/students")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View All Students
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/preceptor/evaluations")}
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Student Evaluations
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/preceptor/communications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Messages
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreceptorDashboard;