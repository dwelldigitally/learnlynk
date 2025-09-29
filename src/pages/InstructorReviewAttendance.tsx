import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  MapPin,
  CheckCircle,
  XCircle,
  Edit3,
  AlertTriangle
} from 'lucide-react';

const InstructorReviewAttendance = () => {
  const [adjustedStartTime, setAdjustedStartTime] = useState('');
  const [adjustedEndTime, setAdjustedEndTime] = useState('');
  const [adjustedHours, setAdjustedHours] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAdjusted, setIsAdjusted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { attendanceId } = useParams();

  // Mock attendance data
  const attendanceData = {
    student: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      program: 'Nursing Practicum',
      batch: 'Spring 2024 - Cohort A'
    },
    attendance: {
      date: '2024-03-20',
      submittedStartTime: '08:00',
      submittedEndTime: '17:00',
      submittedHours: 8,
      actualBreakTime: 1,
      netHours: 8,
      site: 'City General Hospital',
      department: 'Emergency Department',
      preceptor: 'Dr. Michael Smith',
      activities: [
        'Patient intake and assessment',
        'Medication administration supervision',
        'Wound care assistance',
        'Patient education',
        'Documentation practice'
      ],
      studentNotes: 'Had a very busy day in the ED. Worked with 12 different patients throughout the shift. Gained valuable experience with emergency protocols and triage procedures. Dr. Smith provided excellent guidance during medication administration.',
      submittedAt: '2024-03-20T18:30:00Z'
    }
  };

  const calculateAdjustedHours = () => {
    if (adjustedStartTime && adjustedEndTime) {
      const start = new Date(`2024-03-20T${adjustedStartTime}`);
      const end = new Date(`2024-03-20T${adjustedEndTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const netHours = diffHours - attendanceData.attendance.actualBreakTime;
      setAdjustedHours(netHours.toString());
    }
  };

  React.useEffect(() => {
    calculateAdjustedHours();
  }, [adjustedStartTime, adjustedEndTime]);

  const handleAdjustTimes = () => {
    setIsAdjusted(true);
    setAdjustedStartTime(attendanceData.attendance.submittedStartTime);
    setAdjustedEndTime(attendanceData.attendance.submittedEndTime);
    setAdjustedHours(attendanceData.attendance.netHours.toString());
  };

  const handleApprove = () => {
    const finalHours = isAdjusted ? adjustedHours : attendanceData.attendance.netHours;
    toast({
      title: "Attendance Approved",
      description: `${attendanceData.student.name}'s attendance for ${attendanceData.attendance.date} has been approved (${finalHours} hours).`,
    });
    navigate('/instructor/dashboard');
  };

  const handleReject = () => {
    if (!feedback) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback when rejecting attendance.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Attendance Rejected",
      description: `${attendanceData.student.name} has been notified and must resubmit.`,
      variant: "destructive"
    });
    navigate('/instructor/dashboard');
  };

  const handleAdjustAndApprove = () => {
    if (!adjustedHours) {
      toast({
        title: "Hours Required",
        description: "Please specify the adjusted hours.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Attendance Adjusted & Approved",
      description: `Hours adjusted to ${adjustedHours} and approved with instructor signature.`,
    });
    navigate('/instructor/dashboard');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/instructor/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Review Attendance</h1>
              <p className="text-muted-foreground">{formatDate(attendanceData.attendance.date)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Student Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{attendanceData.student.name}</h2>
                  <p className="text-muted-foreground">{attendanceData.student.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{attendanceData.student.program}</span>
                    <span>•</span>
                    <span>{attendanceData.student.batch}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-yellow-100 text-yellow-800">
                  Pending Review
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">
                  Submitted: {new Date(attendanceData.attendance.submittedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date:</span>
                <span>{formatDate(attendanceData.attendance.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Site:</span>
                <span>{attendanceData.attendance.site}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Start Time</div>
                <div className="text-lg font-semibold">
                  {formatTime(attendanceData.attendance.submittedStartTime)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">End Time</div>
                <div className="text-lg font-semibold">
                  {formatTime(attendanceData.attendance.submittedEndTime)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Hours</div>
                <div className="text-lg font-semibold text-primary">
                  {attendanceData.attendance.netHours} hours
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Department:</span>
                <span className="ml-2">{attendanceData.attendance.department}</span>
              </div>
              <div>
                <span className="font-medium">Preceptor:</span>
                <span className="ml-2">{attendanceData.attendance.preceptor}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Clinical Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {attendanceData.attendance.activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Student Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{attendanceData.attendance.studentNotes}</p>
          </CardContent>
        </Card>

        {/* Time Adjustment */}
        {isAdjusted && (
          <Card className="mb-6 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Edit3 className="h-5 w-5" />
                Adjust Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4 text-sm text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Adjusting times will override the student's submitted hours.</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="adjusted-start">Corrected Start Time</Label>
                  <Input
                    id="adjusted-start"
                    type="time"
                    value={adjustedStartTime}
                    onChange={(e) => setAdjustedStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="adjusted-end">Corrected End Time</Label>
                  <Input
                    id="adjusted-end"
                    type="time"
                    value={adjustedEndTime}
                    onChange={(e) => setAdjustedEndTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="adjusted-hours">Net Hours</Label>
                  <Input
                    id="adjusted-hours"
                    type="number"
                    step="0.5"
                    value={adjustedHours}
                    onChange={(e) => setAdjustedHours(e.target.value)}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructor Feedback */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructor Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add feedback for the student (optional for approval, required for rejection)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div>
            {!isAdjusted && (
              <Button 
                variant="outline"
                onClick={handleAdjustTimes}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Adjust Times
              </Button>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => navigate('/instructor/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            {isAdjusted ? (
              <Button 
                onClick={handleAdjustAndApprove}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve Adjusted Hours
              </Button>
            ) : (
              <Button 
                onClick={handleApprove}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve As Submitted
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorReviewAttendance;