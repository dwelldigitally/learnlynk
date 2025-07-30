import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  MessageSquare,
  AlertTriangle,
  Download,
  Eye,
  MessageCircle,
  Send,
  ClipboardList
} from "lucide-react";
import StudentApplicationCard from "./StudentApplicationCard";
import StudentDocumentSection from "./StudentDocumentSection";
import StudentCommunication from "./StudentCommunication";
import { studentApplications } from "@/data/studentApplications";

const StudentDetail: React.FC = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock student data - in real app this would come from API
  const student = {
    id: studentId || "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    studentId: "WCC-2025-001",
    address: "123 Main St, Vancouver, BC V6A 1A1",
    emergencyContact: "John Johnson - +1 (555) 987-6543",
    advisor: "Nicole Adams",
    enrollmentDate: "2025-01-15",
    riskLevel: "low" as "low" | "medium" | "high",
    lastActivity: "2 hours ago",
    notes: "Highly motivated student with excellent communication skills.",
    applications: Object.values(studentApplications)
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "LEAD_FORM": return "outline";
      case "SEND_DOCUMENTS": return "secondary";
      case "DOCUMENT_APPROVAL": return "default";
      case "FEE_PAYMENT": return "default";
      case "ACCEPTED": return "secondary";
      default: return "outline";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/students')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">{student.name}</h1>
            <p className="text-muted-foreground">Student ID: {student.studentId}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Call Student
          </Button>
          <Button>
            <MessageCircle className="h-4 w-4 mr-2" />
            Quick Message
          </Button>
        </div>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span>{student.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Advisor:</span>
                <span>{student.advisor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Enrolled:</span>
                <span>{student.enrollmentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Active:</span>
                <span>{student.lastActivity}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${getRiskColor(student.riskLevel)}`}>
              <div className="flex items-center space-x-2 mb-2">
                {student.riskLevel === 'high' && <AlertTriangle className="h-5 w-5" />}
                {student.riskLevel === 'medium' && <Clock className="h-5 w-5" />}
                {student.riskLevel === 'low' && <CheckCircle className="h-5 w-5" />}
                <span className="font-medium capitalize">{student.riskLevel} Risk</span>
              </div>
              <p className="text-sm">
                {student.riskLevel === 'low' && "Student is progressing well with regular activity."}
                {student.riskLevel === 'medium' && "Some concerns - monitor progress closely."}
                {student.riskLevel === 'high' && "Immediate attention needed - contact student."}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Engagement Score:</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve All Documents
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <XCircle className="h-4 w-4 mr-2" />
              Request Revision
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Reassign Advisor
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Applications Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {student.applications.map((app) => (
                  <div key={app.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{app.programName}</h4>
                      <Badge variant={getStageColor(app.stage)}>
                        {app.stage.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span>{app.progress}%</span>
                      </div>
                      <Progress value={app.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Deadline: {app.applicationDeadline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "2 hours ago", action: "Uploaded Immunization Records", type: "document" },
                  { time: "1 day ago", action: "Replied to advisor message", type: "communication" },
                  { time: "3 days ago", action: "Started Health Care Assistant application", type: "application" },
                  { time: "1 week ago", action: "Profile created", type: "system" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="mt-1">
                      {activity.type === 'document' && <FileText className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'communication' && <MessageSquare className="h-4 w-4 text-green-500" />}
                      {activity.type === 'application' && <ClipboardList className="h-4 w-4 text-purple-500" />}
                      {activity.type === 'system' && <User className="h-4 w-4 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <div className="space-y-4">
            {student.applications.map((application) => (
              <StudentApplicationCard 
                key={application.id} 
                application={application} 
                studentId={student.id}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <StudentDocumentSection applications={student.applications} />
        </TabsContent>

        <TabsContent value="communications">
          <StudentCommunication studentId={student.id} studentName={student.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;