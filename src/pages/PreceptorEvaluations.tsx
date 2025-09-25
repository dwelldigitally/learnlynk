import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Calendar, 
  User, 
  Star, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const PreceptorEvaluations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);

  // Mock evaluation data
  const evaluations = [
    {
      id: '1',
      studentName: 'Sarah Johnson',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      program: 'Nursing - RN',
      type: 'Midterm Evaluation',
      dueDate: '2024-01-15',
      status: 'pending',
      submittedDate: '2024-01-10',
      studentSelfEvaluation: {
        clinicalSkills: 4,
        professionalism: 5,
        communication: 4,
        criticalThinking: 3,
        overallComments: 'I feel confident in most areas but need to work on critical thinking skills in complex situations.'
      },
      preceptorEvaluation: null
    },
    {
      id: '2',
      studentName: 'Michael Chen',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      program: 'Medical Assistant',
      type: 'Final Evaluation',
      dueDate: '2024-01-20',
      status: 'overdue',
      submittedDate: '2024-01-08',
      studentSelfEvaluation: {
        clinicalSkills: 5,
        professionalism: 5,
        communication: 4,
        criticalThinking: 4,
        overallComments: 'I have grown significantly during this practicum and feel ready for independent practice.'
      },
      preceptorEvaluation: null
    },
    {
      id: '3',
      studentName: 'Emily Rodriguez',
      studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      program: 'Nursing - LPN',
      type: 'Midterm Evaluation',
      dueDate: '2024-01-25',
      status: 'completed',
      submittedDate: '2024-01-12',
      studentSelfEvaluation: {
        clinicalSkills: 3,
        professionalism: 4,
        communication: 3,
        criticalThinking: 3,
        overallComments: 'I am learning a lot but still need more practice with certain procedures.'
      },
      preceptorEvaluation: {
        clinicalSkills: 3,
        professionalism: 4,
        communication: 4,
        criticalThinking: 3,
        overallComments: 'Emily is making good progress. She needs to continue practicing clinical skills and building confidence.',
        strengths: 'Good attitude, willing to learn, follows directions well',
        areasForImprovement: 'Clinical skills confidence, speed of task completion',
        completedDate: '2024-01-13'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'overdue': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'overdue': return <AlertTriangle className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleStartEvaluation = (evaluationId: string) => {
    navigate(`/preceptor/review-evaluation/${evaluationId}`);
  };

  const handleMarkComplete = (evaluationId: string) => {
    toast({
      title: "Evaluation Completed",
      description: "The evaluation has been submitted successfully.",
    });
  };

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
                  onClick={() => navigate('/preceptor/dashboard')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ClipboardCheck className="h-6 w-6 mr-2 text-indigo-600" />
                    Student Evaluations
                  </h1>
                  <p className="text-gray-600">Review and complete student evaluations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {evaluations.filter(e => e.status === 'pending').length}
                    </p>
                    <p className="text-gray-600">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {evaluations.filter(e => e.status === 'overdue').length}
                    </p>
                    <p className="text-gray-600">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {evaluations.filter(e => e.status === 'completed').length}
                    </p>
                    <p className="text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Evaluations List */}
          <div className="space-y-6">
            {evaluations.map((evaluation) => (
              <Card key={evaluation.id} className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={evaluation.studentAvatar}
                        alt={evaluation.studentName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
                      />
                      <div>
                        <CardTitle className="text-lg">{evaluation.studentName}</CardTitle>
                        <p className="text-gray-600">{evaluation.program}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(evaluation.status)}>
                        {getStatusIcon(evaluation.status)}
                        <span className="ml-1 capitalize">{evaluation.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Evaluation Details */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{evaluation.type}</span>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {new Date(evaluation.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-1" />
                        Submitted: {new Date(evaluation.submittedDate).toLocaleDateString()}
                      </div>

                      {evaluation.status !== 'completed' && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Student Self-Evaluation Summary</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span>Clinical Skills:</span>
                              <div className="flex">{renderStars(evaluation.studentSelfEvaluation.clinicalSkills)}</div>
                            </div>
                            <div className="flex justify-between">
                              <span>Professionalism:</span>
                              <div className="flex">{renderStars(evaluation.studentSelfEvaluation.professionalism)}</div>
                            </div>
                            <div className="flex justify-between">
                              <span>Communication:</span>
                              <div className="flex">{renderStars(evaluation.studentSelfEvaluation.communication)}</div>
                            </div>
                            <div className="flex justify-between">
                              <span>Critical Thinking:</span>
                              <div className="flex">{renderStars(evaluation.studentSelfEvaluation.criticalThinking)}</div>
                            </div>
                          </div>
                          <div className="mt-3 text-sm text-gray-700">
                            <strong>Student Comments:</strong> {evaluation.studentSelfEvaluation.overallComments}
                          </div>
                        </div>
                      )}

                      {evaluation.status === 'completed' && evaluation.preceptorEvaluation && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">Your Evaluation (Completed)</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="flex justify-between">
                              <span>Clinical Skills:</span>
                              <div className="flex">{renderStars(evaluation.preceptorEvaluation.clinicalSkills)}</div>
                            </div>
                            <div className="flex justify-between">
                              <span>Professionalism:</span>
                              <div className="flex">{renderStars(evaluation.preceptorEvaluation.professionalism)}</div>
                            </div>
                            <div className="flex justify-between">
                              <span>Communication:</span>
                              <div className="flex">{renderStars(evaluation.preceptorEvaluation.communication)}</div>
                            </div>
                            <div className="flex justify-between">
                              <span>Critical Thinking:</span>
                              <div className="flex">{renderStars(evaluation.preceptorEvaluation.criticalThinking)}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 space-y-2">
                            <div><strong>Strengths:</strong> {evaluation.preceptorEvaluation.strengths}</div>
                            <div><strong>Areas for Improvement:</strong> {evaluation.preceptorEvaluation.areasForImprovement}</div>
                            <div><strong>Overall Comments:</strong> {evaluation.preceptorEvaluation.overallComments}</div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Completed on: {new Date(evaluation.preceptorEvaluation.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-center space-y-3">
                      {evaluation.status === 'pending' && (
                        <Button
                          onClick={() => handleStartEvaluation(evaluation.id)}
                          className="w-full"
                        >
                          <ClipboardCheck className="h-4 w-4 mr-2" />
                          Start Evaluation
                        </Button>
                      )}
                      
                      {evaluation.status === 'overdue' && (
                        <Button
                          onClick={() => handleStartEvaluation(evaluation.id)}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Complete Overdue Evaluation
                        </Button>
                      )}

                      {evaluation.status === 'completed' && (
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/preceptor/review-evaluation/${evaluation.id}`)}
                          className="w-full"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Completed Evaluation
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => navigate(`/preceptor/students`)}
                        className="w-full"
                      >
                        <User className="h-4 w-4 mr-2" />
                        View Student Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {evaluations.length === 0 && (
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="text-center py-12">
                <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No evaluations found</h3>
                <p className="text-gray-600">You have no pending evaluations at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreceptorEvaluations;