import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Clock, 
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Stethoscope,
  Edit3
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const PreceptorReviewAttendance = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [adjustedHours, setAdjustedHours] = useState("8.5");
  const [feedback, setFeedback] = useState("");
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);

  const attendanceRecord = {
    id: 1,
    student: {
      name: "Sarah Chen",
      id: "SC-2024-001",
      program: "Nursing - RN Program",
      avatar: "/placeholder-avatar.jpg"
    },
    date: "March 15, 2024",
    timeIn: "07:00 AM",
    timeOut: "04:00 PM",
    totalHours: "8.5",
    location: "Cardiac ICU - Ward 3B",
    supervisor: "Dr. Patricia Johnson",
    activities: [
      "Patient vital signs monitoring",
      "Medication administration",
      "Patient education",
      "Documentation review"
    ],
    notes: "Student demonstrated excellent bedside manner and completed all assigned tasks efficiently. Showed initiative in patient care.",
    status: "pending"
  };

  const handleApprove = () => {
    setDecision("approve");
    toast.success("Attendance record approved with digital signature");
    setTimeout(() => navigate("/preceptor/dashboard"), 1500);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      toast.error("Please provide feedback before rejecting");
      return;
    }
    setDecision("reject");
    toast.error("Attendance record rejected - student will be notified");
    setTimeout(() => navigate("/preceptor/dashboard"), 1500);
  };

  const handleAdjustAndApprove = () => {
    setDecision("approve");
    toast.success(`Hours adjusted to ${adjustedHours} and approved`);
    setTimeout(() => navigate("/preceptor/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/preceptor/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full p-2">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Review Attendance</h1>
                <p className="text-sm text-muted-foreground">Verify student hours and activities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Student Info */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{attendanceRecord.student.name}</h2>
              <p className="text-muted-foreground">ID: {attendanceRecord.student.id}</p>
              <p className="text-sm text-muted-foreground">{attendanceRecord.student.program}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Pending Review
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Time & Location */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{attendanceRecord.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Clock className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Time In</p>
                      <p className="text-sm text-muted-foreground">{attendanceRecord.timeIn}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{attendanceRecord.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Clock className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Time Out</p>
                      <p className="text-sm text-muted-foreground">{attendanceRecord.timeOut}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Hours */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Hours Logged</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{attendanceRecord.totalHours} hours</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600 dark:text-blue-400">Supervised by</p>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{attendanceRecord.supervisor}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Activities */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Activities Performed</h3>
              <div className="space-y-2">
                {attendanceRecord.activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{activity}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Student Notes */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Student Notes</h3>
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm">{attendanceRecord.notes}</p>
              </div>
            </Card>
          </div>

          {/* Review Actions */}
          <div className="space-y-6">
            {/* Adjust Hours */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Adjust Hours
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adjustedHours">Corrected Hours</Label>
                  <Input
                    id="adjustedHours"
                    type="number"
                    step="0.5"
                    value={adjustedHours}
                    onChange={(e) => setAdjustedHours(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Original: {attendanceRecord.totalHours} hours
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleAdjustAndApprove}
                  disabled={adjustedHours === attendanceRecord.totalHours}
                >
                  Adjust & Approve
                </Button>
              </div>
            </Card>

            {/* Feedback */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Preceptor Feedback</h3>
              <Textarea
                placeholder="Add any notes or feedback about this attendance record..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </Card>

            {/* Digital Signature */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <div className="text-center space-y-3">
                <Stethoscope className="h-8 w-8 text-green-600 mx-auto" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Digital Signature</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Dr. Patricia Johnson, RN</p>
                  <p className="text-xs text-green-500 dark:text-green-500">Cardiac ICU Preceptor</p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApprove}
                disabled={decision !== null}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {decision === "approve" ? "Approved!" : "Approve with Signature"}
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleReject}
                disabled={decision !== null}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {decision === "reject" ? "Rejected!" : "Reject & Request Changes"}
              </Button>
            </div>

            {decision && (
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Student will be notified automatically
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreceptorReviewAttendance;