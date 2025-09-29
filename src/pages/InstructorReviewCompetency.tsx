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
  Award, 
  Target,
  CheckCircle,
  XCircle,
  Star,
  AlertCircle,
  FileText
} from 'lucide-react';

const InstructorReviewCompetency = () => {
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { competencyId } = useParams();

  // Mock competency data
  const competencyData = {
    student: {
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      program: 'Nursing Practicum',
      batch: 'Spring 2024 - Cohort A'
    },
    competency: {
      name: 'IV Insertion and Medication Administration',
      category: 'Clinical Skills',
      submittedAt: '2024-03-19T14:30:00Z',
      attemptNumber: 1,
      description: 'Demonstrate safe and effective intravenous catheter insertion and medication administration following institutional protocols.',
      learningObjectives: [
        'Select appropriate IV insertion site and equipment',
        'Perform aseptic technique throughout procedure',
        'Successfully insert IV catheter on first attempt',
        'Calculate medication dosages accurately',
        'Administer medications safely following five rights',
        'Document procedure and patient response appropriately'
      ],
      evaluationCriteria: [
        { criteria: 'Site Selection', weight: 15 },
        { criteria: 'Aseptic Technique', weight: 25 },
        { criteria: 'Technical Skill', weight: 20 },
        { criteria: 'Safety Protocols', weight: 25 },
        { criteria: 'Documentation', weight: 15 }
      ],
      studentSelfAssessment: {
        rating: 'Satisfactory',
        reflection: 'I felt confident during the IV insertion procedure. I successfully selected an appropriate antecubital vein and maintained sterile technique throughout. The insertion was successful on the first attempt with minimal patient discomfort. I double-checked all medication calculations with my preceptor and followed the five rights of medication administration. I documented everything accurately in the patient record. Areas for improvement include becoming faster with the procedure while maintaining accuracy.',
        challenges: 'Initially nervous about patient comfort, but gained confidence with preceptor support.',
        strengths: 'Good technique, careful attention to safety protocols, thorough documentation'
      },
      preceptorObservations: 'Student demonstrated excellent preparation and knowledge of procedure. Showed appropriate nervousness which indicates respect for the skill. Technical execution was smooth and patient-centered. Documentation was complete and timely.'
    }
  };

  const ratingOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Exceeds expectations, ready for independent practice' },
    { value: 'satisfactory', label: 'Satisfactory', description: 'Meets expectations, competent performance' },
    { value: 'needs-improvement', label: 'Needs Improvement', description: 'Below expectations, requires additional practice' },
    { value: 'unsatisfactory', label: 'Unsatisfactory', description: 'Does not meet minimum standards, significant remediation needed' }
  ];

  const feedbackTemplates = [
    "Excellent demonstration of clinical competency with strong attention to safety.",
    "Satisfactory performance meeting all required standards.",
    "Good technical skills with room for improvement in efficiency.",
    "Demonstrates understanding but needs more practice for confidence.",
    "Requires additional instruction and practice before retry."
  ];

  const handleApprove = () => {
    if (!rating) {
      toast({
        title: "Rating Required",
        description: "Please select a performance rating before approving.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Competency Approved",
      description: `${competencyData.student.name}'s ${competencyData.competency.name} has been approved with rating: ${rating}.`,
    });
    navigate('/instructor/dashboard');
  };

  const handleReject = () => {
    if (!feedback) {
      toast({
        title: "Feedback Required",
        description: "Please provide detailed feedback when rejecting a competency.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Competency Rejected",
      description: `${competencyData.student.name} will need to retry this competency with additional practice.`,
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

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-green-600';
      case 'satisfactory': return 'text-blue-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'unsatisfactory': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
              <h1 className="text-2xl font-bold">Review Competency</h1>
              <p className="text-muted-foreground">{competencyData.competency.name}</p>
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
                  <h2 className="text-xl font-semibold">{competencyData.student.name}</h2>
                  <p className="text-muted-foreground">{competencyData.student.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{competencyData.student.program}</span>
                    <span>•</span>
                    <span>{competencyData.student.batch}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted: {formatDate(competencyData.competency.submittedAt)}</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  Attempt #{competencyData.competency.attemptNumber}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competency Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Competency Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Category:</span>
                <Badge variant="outline">{competencyData.competency.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {competencyData.competency.description}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Target className="h-4 w-4" />
                Learning Objectives
              </h4>
              <ul className="space-y-2">
                {competencyData.competency.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Evaluation Criteria</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {competencyData.competency.evaluationCriteria.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{item.criteria}</span>
                    <span className="text-muted-foreground">{item.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Self-Assessment */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Student Self-Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Self-Rating:</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {competencyData.competency.studentSelfAssessment.rating}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Reflection:</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {competencyData.competency.studentSelfAssessment.reflection}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Challenges:</h4>
                <p className="text-sm text-muted-foreground">
                  {competencyData.competency.studentSelfAssessment.challenges}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Strengths:</h4>
                <p className="text-sm text-muted-foreground">
                  {competencyData.competency.studentSelfAssessment.strengths}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preceptor Observations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preceptor Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {competencyData.competency.preceptorObservations}
            </p>
          </CardContent>
        </Card>

        {/* Instructor Evaluation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Instructor Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Performance Rating</label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select performance rating" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className={`font-medium ${getRatingColor(option.value)}`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Instructor Feedback</label>
              <Textarea
                placeholder="Provide detailed feedback on the student's performance..."
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
                      {template.substring(0, 25)}...
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
            Reject & Require Retry
          </Button>
          <Button 
            onClick={handleApprove}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Approve Competency
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstructorReviewCompetency;