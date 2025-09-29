import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  FileText, 
  TrendingUp,
  CheckCircle,
  Eye,
  Star,
  AlertCircle
} from 'lucide-react';

const InstructorReviewEvaluation = () => {
  const [instructorRatings, setInstructorRatings] = useState<{[key: string]: number}>({});
  const [overallFeedback, setOverallFeedback] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [strengths, setStrengths] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { evaluationId } = useParams();

  // Mock evaluation data
  const evaluationData = {
    student: {
      name: 'James Wilson',
      email: 'james.w@email.com',
      program: 'Nursing Practicum',
      batch: 'Spring 2024 - Cohort A'
    },
    evaluation: {
      type: 'Midterm',
      submittedAt: '2024-03-18T14:30:00Z',
      studentSelfRatings: {
        'clinical-skills': 7,
        'communication': 8,
        'professionalism': 9,
        'critical-thinking': 6,
        'time-management': 7,
        'documentation': 8,
        'teamwork': 9,
        'patient-safety': 8
      },
      studentComments: {
        strengths: "I feel confident in my communication with patients and colleagues. I've developed good relationships with the nursing team and consistently maintain professional behavior. My documentation has improved significantly since the beginning of the practicum.",
        improvements: "I need to work on my critical thinking skills, especially in emergency situations. Sometimes I feel overwhelmed when multiple patients need attention simultaneously. I also want to become more proficient with advanced clinical procedures.",
        goals: "For the second half of the practicum, I want to focus on developing leadership skills and becoming more confident in making clinical decisions. I'd also like to get more experience in the ICU setting."
      }
    }
  };

  const evaluationCriteria = [
    {
      id: 'clinical-skills',
      name: 'Clinical Skills & Competency',
      description: 'Technical skills, procedure proficiency, clinical judgment'
    },
    {
      id: 'communication',
      name: 'Communication Skills',
      description: 'Patient interaction, family communication, team collaboration'
    },
    {
      id: 'professionalism',
      name: 'Professional Behavior',
      description: 'Ethics, appearance, punctuality, responsibility'
    },
    {
      id: 'critical-thinking',
      name: 'Critical Thinking',
      description: 'Problem-solving, decision-making, analytical skills'
    },
    {
      id: 'time-management',
      name: 'Time Management',
      description: 'Prioritization, efficiency, organization'
    },
    {
      id: 'documentation',
      name: 'Documentation Skills',
      description: 'Accuracy, completeness, timeliness of records'
    },
    {
      id: 'teamwork',
      name: 'Teamwork & Collaboration',
      description: 'Working with multidisciplinary team, support of colleagues'
    },
    {
      id: 'patient-safety',
      name: 'Patient Safety & Care',
      description: 'Safety protocols, infection control, patient advocacy'
    }
  ];

  const handleRatingChange = (criteriaId: string, value: number[]) => {
    setInstructorRatings(prev => ({
      ...prev,
      [criteriaId]: value[0]
    }));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 9) return 'Excellent';
    if (rating >= 8) return 'Very Good';
    if (rating >= 7) return 'Good';
    if (rating >= 6) return 'Satisfactory';
    if (rating >= 5) return 'Needs Improvement';
    return 'Unsatisfactory';
  };

  const getDiscrepancyIcon = (studentRating: number, instructorRating: number) => {
    const diff = Math.abs(studentRating - instructorRating);
    if (diff >= 3) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (diff >= 2) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return null;
  };

  const handleSubmit = () => {
    if (Object.keys(instructorRatings).length < evaluationCriteria.length) {
      toast({
        title: "Incomplete Evaluation",
        description: "Please rate all criteria before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!overallFeedback) {
      toast({
        title: "Feedback Required",
        description: "Please provide overall feedback.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Evaluation Completed",
      description: `${evaluationData.evaluation.type} evaluation for ${evaluationData.student.name} has been submitted.`,
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
              <h1 className="text-2xl font-bold">Student Evaluation</h1>
              <p className="text-muted-foreground">{evaluationData.evaluation.type} Assessment</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Student Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{evaluationData.student.name}</h2>
                  <p className="text-muted-foreground">{evaluationData.student.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{evaluationData.student.program}</span>
                    <span>•</span>
                    <span>{evaluationData.student.batch}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted: {formatDate(evaluationData.evaluation.submittedAt)}</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  {evaluationData.evaluation.type} Evaluation
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Self-Assessment */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Student Self-Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {evaluationCriteria.map((criteria) => {
                  const studentRating = evaluationData.evaluation.studentSelfRatings[criteria.id];
                  return (
                    <div key={criteria.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{criteria.name}</p>
                          <p className="text-xs text-muted-foreground">{criteria.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getRatingColor(studentRating)}`}>
                            {studentRating}/10
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getRatingLabel(studentRating)}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${studentRating * 10}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Strengths:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {evaluationData.evaluation.studentComments.strengths}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm mb-2">Areas for Improvement:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {evaluationData.evaluation.studentComments.improvements}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm mb-2">Future Goals:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {evaluationData.evaluation.studentComments.goals}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructor Assessment */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Instructor Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {evaluationCriteria.map((criteria) => {
                  const studentRating = evaluationData.evaluation.studentSelfRatings[criteria.id];
                  const instructorRating = instructorRatings[criteria.id] || 5;
                  return (
                    <div key={criteria.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{criteria.name}</p>
                            {getDiscrepancyIcon(studentRating, instructorRating)}
                          </div>
                          <p className="text-xs text-muted-foreground">{criteria.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`font-bold ${getRatingColor(instructorRating)}`}>
                            {instructorRating}/10
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getRatingLabel(instructorRating)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Slider
                          value={[instructorRating]}
                          onValueChange={(value) => handleRatingChange(criteria.id, value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Student: {studentRating}</span>
                          <span>Your Rating: {instructorRating}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructor Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Student Strengths</label>
                  <Textarea
                    placeholder="Highlight the student's key strengths and positive observations..."
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Areas for Improvement</label>
                  <Textarea
                    placeholder="Identify specific areas where the student can improve..."
                    value={areasForImprovement}
                    onChange={(e) => setAreasForImprovement(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Overall Feedback</label>
                  <Textarea
                    placeholder="Provide comprehensive feedback on the student's overall performance..."
                    value={overallFeedback}
                    onChange={(e) => setOverallFeedback(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button 
            variant="outline"
            onClick={() => navigate('/instructor/dashboard')}
          >
            Save as Draft
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Submit Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstructorReviewEvaluation;