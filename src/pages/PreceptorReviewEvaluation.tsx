import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Calendar, 
  User, 
  Star, 
  FileText, 
  ArrowLeft,
  Save,
  Send,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const PreceptorReviewEvaluation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [preceptorRatings, setPreceptorRatings] = useState({
    clinicalSkills: 0,
    professionalism: 0,
    communication: 0,
    criticalThinking: 0,
    timeManagement: 0,
    teamwork: 0
  });
  
  const [strengths, setStrengths] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [overallComments, setOverallComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock evaluation data
  const evaluation = {
    id: id || '1',
    studentName: 'Sarah Johnson',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    studentId: 'ST001',
    program: 'Nursing - RN',
    type: 'Midterm Evaluation',
    submissionDate: '2024-01-10T14:30:00Z',
    dueDate: '2024-01-15T23:59:00Z',
    evaluationPeriod: 'Week 1-6 (Dec 4 - Jan 12, 2024)',
    totalHours: 240,
    studentSelfEvaluation: {
      clinicalSkills: 4,
      professionalism: 5,
      communication: 4,
      criticalThinking: 3,
      timeManagement: 4,
      teamwork: 5,
      strengths: 'I feel confident in my communication with patients and have developed strong relationships with my team members. My professionalism has grown significantly.',
      areasForImprovement: 'I need to work on my critical thinking skills, especially in complex situations. Sometimes I need more time to process information before making decisions.',
      overallComments: 'This practicum has been an incredible learning experience. I feel I have grown both personally and professionally.',
      goals: 'For the remainder of my practicum, I want to focus on developing my critical thinking skills and becoming more confident in emergency situations.'
    }
  };

  const competencyAreas = [
    {
      key: 'clinicalSkills',
      label: 'Clinical Skills & Procedures',
      description: 'Demonstrates competency in clinical skills, follows proper procedures'
    },
    {
      key: 'professionalism',
      label: 'Professionalism',
      description: 'Maintains professional behavior, dress, and communication'
    },
    {
      key: 'communication',
      label: 'Communication',
      description: 'Communicates effectively with patients, families, and team members'
    },
    {
      key: 'criticalThinking',
      label: 'Critical Thinking',
      description: 'Demonstrates analytical thinking and problem-solving abilities'
    },
    {
      key: 'timeManagement',
      label: 'Time Management',
      description: 'Manages time effectively, prioritizes tasks appropriately'
    },
    {
      key: 'teamwork',
      label: 'Teamwork & Collaboration',
      description: 'Works collaboratively with healthcare team members'
    }
  ];

  const ratingLabels = {
    1: 'Needs Significant Improvement',
    2: 'Needs Improvement',
    3: 'Satisfactory',
    4: 'Good',
    5: 'Excellent'
  };

  const renderStars = (rating: number, onChange?: (rating: number) => void, readOnly = false) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
            } ${readOnly ? 'cursor-default' : ''}`}
            onClick={() => !readOnly && onChange && onChange(i + 1)}
          />
        ))}
      </div>
    );
  };

  const handleRatingChange = (competency: keyof typeof preceptorRatings, rating: number) => {
    setPreceptorRatings(prev => ({
      ...prev,
      [competency]: rating
    }));
  };

  const handleSubmitEvaluation = async () => {
    // Validate required fields
    const hasAllRatings = Object.values(preceptorRatings).every(rating => rating > 0);
    
    if (!hasAllRatings) {
      toast({
        title: "Incomplete Evaluation",
        description: "Please provide ratings for all competency areas.",
        variant: "destructive"
      });
      return;
    }

    if (!overallComments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide overall comments for this evaluation.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Evaluation Submitted",
        description: "The evaluation has been submitted successfully.",
      });
      setIsSubmitting(false);
      navigate('/preceptor/evaluations');
    }, 1500);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your evaluation progress has been saved.",
    });
  };

  const averageStudentRating = Object.values(evaluation.studentSelfEvaluation).slice(0, 6).reduce((a, b) => a + b, 0) / 6;
  const averagePreceptorRating = Object.values(preceptorRatings).reduce((a, b) => a + b, 0) / Object.values(preceptorRatings).filter(r => r > 0).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 opacity-40" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/preceptor/evaluations')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Evaluations
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ClipboardCheck className="h-6 w-6 mr-2 text-indigo-600" />
                    {evaluation.type}
                  </h1>
                  <p className="text-gray-600">{evaluation.evaluationPeriod}</p>
                </div>
              </div>
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                Due: {new Date(evaluation.dueDate).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Student Information Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Student Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={evaluation.studentAvatar}
                      alt={evaluation.studentName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
                    />
                    <div>
                      <p className="font-medium">{evaluation.studentName}</p>
                      <p className="text-sm text-gray-600">{evaluation.studentId}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Program</p>
                    <p className="text-sm text-gray-600">{evaluation.program}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Hours</p>
                    <p className="text-sm text-gray-600">{evaluation.totalHours} hours</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Submitted</p>
                    <p className="text-sm text-gray-600">
                      {new Date(evaluation.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Comparison */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Rating Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Student Self-Rating</p>
                    <div className="flex justify-center mt-1">
                      {renderStars(Math.round(averageStudentRating), undefined, true)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{averageStudentRating.toFixed(1)} average</p>
                  </div>
                  
                  {averagePreceptorRating > 0 && (
                    <div className="text-center border-t pt-4">
                      <p className="text-sm text-gray-600">Your Rating</p>
                      <div className="flex justify-center mt-1">
                        {renderStars(Math.round(averagePreceptorRating), undefined, true)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{averagePreceptorRating.toFixed(1)} average</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Evaluation Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Student Self-Evaluation */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Student Self-Evaluation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {competencyAreas.map((area) => (
                      <div key={area.key} className="bg-blue-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-blue-900">{area.label}</h4>
                            <p className="text-xs text-blue-700">{area.description}</p>
                          </div>
                          <div className="text-right">
                            {renderStars(evaluation.studentSelfEvaluation[area.key as keyof typeof evaluation.studentSelfEvaluation] as number, undefined, true)}
                            <p className="text-xs text-blue-600 mt-1">
                              {ratingLabels[evaluation.studentSelfEvaluation[area.key as keyof typeof evaluation.studentSelfEvaluation] as keyof typeof ratingLabels]}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Student's Identified Strengths:</h4>
                      <p className="text-green-800">{evaluation.studentSelfEvaluation.strengths}</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-medium text-orange-900 mb-2">Student's Areas for Improvement:</h4>
                      <p className="text-orange-800">{evaluation.studentSelfEvaluation.areasForImprovement}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-medium text-purple-900 mb-2">Student's Overall Comments:</h4>
                      <p className="text-purple-800">{evaluation.studentSelfEvaluation.overallComments}</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Student's Goals:</h4>
                      <p className="text-blue-800">{evaluation.studentSelfEvaluation.goals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preceptor Evaluation */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardCheck className="h-5 w-5 mr-2" />
                    Your Evaluation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Competency Ratings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Competency Ratings</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {competencyAreas.map((area) => (
                        <div key={area.key} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{area.label}</h4>
                              <p className="text-sm text-gray-600">{area.description}</p>
                            </div>
                            <div className="text-right ml-4">
                              {renderStars(
                                preceptorRatings[area.key as keyof typeof preceptorRatings],
                                (rating) => handleRatingChange(area.key as keyof typeof preceptorRatings, rating)
                              )}
                              {preceptorRatings[area.key as keyof typeof preceptorRatings] > 0 && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {ratingLabels[preceptorRatings[area.key as keyof typeof preceptorRatings] as keyof typeof ratingLabels]}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Narrative Feedback */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="strengths" className="block text-sm font-medium text-gray-700 mb-2">
                        Strengths
                      </label>
                      <textarea
                        id="strengths"
                        value={strengths}
                        onChange={(e) => setStrengths(e.target.value)}
                        placeholder="Describe the student's key strengths and positive attributes..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white/50"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="improvements" className="block text-sm font-medium text-gray-700 mb-2">
                        Areas for Improvement
                      </label>
                      <textarea
                        id="improvements"
                        value={areasForImprovement}
                        onChange={(e) => setAreasForImprovement(e.target.value)}
                        placeholder="Identify specific areas where the student can improve..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white/50"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="overall-comments" className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Comments <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="overall-comments"
                      value={overallComments}
                      onChange={(e) => setOverallComments(e.target.value)}
                      placeholder="Provide comprehensive feedback on the student's overall performance, progress, and readiness for the next phase..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white/50"
                      rows={6}
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                    <Button
                      onClick={handleSubmitEvaluation}
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                    </Button>
                    
                    <Button
                      onClick={handleSaveDraft}
                      variant="outline"
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreceptorReviewEvaluation;