import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  BookOpen, 
  Target,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';

const InstructorReviewJournal = () => {
  const [feedback, setFeedback] = useState('');
  const [grade, setGrade] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { journalId } = useParams();

  // Mock journal data
  const journalData = {
    student: {
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      program: 'Nursing Practicum',
      batch: 'Spring 2024 - Cohort B'
    },
    journal: {
      weekNumber: 3,
      submittedAt: '2024-03-15T10:30:00Z',
      learningObjectives: [
        'Demonstrate proper medication administration techniques',
        'Practice effective patient communication',
        'Apply infection control protocols'
      ],
      reflection: `This week has been particularly challenging and rewarding. I had the opportunity to work with a diverse patient population in the medical-surgical unit. 

My most significant learning experience occurred when I was assisting with medication administration. Initially, I felt nervous about the responsibility, but my preceptor guided me through the five rights of medication administration. I realized the importance of double-checking patient identification and being meticulous with dosage calculations.

I also improved my communication skills when working with Mrs. Rodriguez, an elderly patient who spoke limited English. I learned to use simple language, visual cues, and patience to ensure she understood her care plan. This experience taught me the value of cultural sensitivity in healthcare.

The infection control protocols became second nature by the end of the week. I consistently followed hand hygiene protocols and proper PPE usage, especially when caring for patients in isolation.

One challenge I faced was time management during busy shifts. I observed how experienced nurses prioritize tasks and learned to organize my patient care more efficiently.

For next week, I want to focus on developing my assessment skills and becoming more confident in documenting patient observations. I also hope to practice IV insertion under supervision.

Overall, this week reinforced my passion for nursing and helped me understand the complexity and responsibility of patient care.`,
      hoursLogged: 40,
      clinicalActivities: [
        'Medication administration supervision',
        'Patient vital signs monitoring',
        'Wound care assistance',
        'Patient education sessions',
        'Documentation practice'
      ]
    }
  };

  const gradeOptions = [
    { value: 'excellent', label: 'Excellent (A)', description: 'Exceeds expectations' },
    { value: 'good', label: 'Good (B)', description: 'Meets expectations' },
    { value: 'satisfactory', label: 'Satisfactory (C)', description: 'Approaches expectations' },
    { value: 'needs-improvement', label: 'Needs Improvement (D)', description: 'Below expectations' },
    { value: 'unsatisfactory', label: 'Unsatisfactory (F)', description: 'Does not meet expectations' }
  ];

  const feedbackTemplates = [
    "Excellent reflection showing deep understanding of learning objectives.",
    "Good analysis of clinical experiences with room for more detail.",
    "Demonstrates growth and self-awareness in professional development.",
    "Shows understanding of patient care principles and safety protocols.",
    "Reflection could benefit from more specific examples and deeper analysis."
  ];

  const handleApprove = () => {
    if (!grade) {
      toast({
        title: "Grade Required",
        description: "Please select a grade before approving.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Journal Approved",
      description: `Emily's Week ${journalData.journal.weekNumber} journal has been approved with grade: ${grade}.`,
    });
    navigate('/instructor/dashboard');
  };

  const handleReject = () => {
    if (!feedback) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback when rejecting a journal.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Journal Rejected",
      description: "Emily has been notified and will need to revise and resubmit.",
      variant: "destructive"
    });
    navigate('/instructor/dashboard');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
              <h1 className="text-2xl font-bold">Review Journal Entry</h1>
              <p className="text-muted-foreground">Week {journalData.journal.weekNumber} Reflection</p>
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
                  <h2 className="text-xl font-semibold">{journalData.student.name}</h2>
                  <p className="text-muted-foreground">{journalData.student.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{journalData.student.program}</span>
                    <span>•</span>
                    <span>{journalData.student.batch}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted: {formatDate(journalData.journal.submittedAt)}</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Week {journalData.journal.weekNumber}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {journalData.journal.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Journal Reflection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Student Reflection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {journalData.journal.reflection}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Activities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Clinical Activities ({journalData.journal.hoursLogged} hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {journalData.journal.clinicalActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grading and Feedback */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Grade</label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Instructor Feedback</label>
              <Textarea
                placeholder="Provide feedback on the student's reflection..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-2">Quick feedback templates:</p>
                <div className="flex flex-wrap gap-2">
                  {feedbackTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setFeedback(template)}
                      className="text-xs h-auto py-1 px-2"
                    >
                      {template.substring(0, 30)}...
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
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
            Reject & Request Revision
          </Button>
          <Button 
            onClick={handleApprove}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Approve & Grade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstructorReviewJournal;