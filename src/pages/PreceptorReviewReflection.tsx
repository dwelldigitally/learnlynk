import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  User, 
  CheckCircle, 
  MessageSquare,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const PreceptorReviewReflection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<'satisfactory' | 'needs_improvement' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock reflection data
  const reflection = {
    id: id || '1',
    studentName: 'Sarah Johnson',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    studentId: 'ST001',
    program: 'Nursing - RN',
    submissionDate: '2024-01-15T14:30:00Z',
    weekNumber: 3,
    weekPeriod: 'January 8-14, 2024',
    prompt: 'Reflect on a challenging patient interaction this week. Describe the situation, your initial response, what you learned, and how you would handle a similar situation in the future.',
    reflection: `This week, I encountered a particularly challenging situation with an elderly patient who was resistant to taking their medications. The patient, Mr. Thompson, had been admitted for pneumonia and was prescribed multiple medications including antibiotics and respiratory treatments.

Initially, I felt frustrated when Mr. Thompson refused his medications and became agitated when I tried to explain their importance. My first instinct was to be more assertive and explain the medical necessity more forcefully. However, I realized this approach was making the situation worse.

I took a step back and decided to try a different approach. I sat down with Mr. Thompson and asked him about his concerns. I discovered that he was worried about the side effects of the medications because he had a bad experience with antibiotics in the past that made him very nauseous. He was also feeling overwhelmed by the number of different pills.

Once I understood his perspective, I was able to address his specific concerns. I explained each medication individually, discussed potential side effects and what we could do to minimize them, and arranged for anti-nausea medication to be given prophylactically. I also worked with the pharmacist to see if we could reduce the number of pills by using combination medications where possible.

This experience taught me several important lessons:

1. **Listen first, explain second**: Before trying to convince a patient, it's crucial to understand their concerns and perspective.

2. **Patience is key**: Taking time to build rapport and trust is more effective than rushing through tasks.

3. **Collaborate with the healthcare team**: Working with other professionals like pharmacists can lead to better solutions for patients.

4. **Individualized care**: What works for one patient may not work for another, and we need to adapt our approach.

5. **Validation matters**: Acknowledging the patient's concerns and showing that I understood why he was worried helped build trust.

In the future, when facing resistance from patients, I will:
- Start by asking open-ended questions about their concerns
- Listen actively without judgment
- Validate their feelings and experiences
- Collaborate with other team members to find solutions
- Take time to build rapport before moving to education
- Follow up to ensure the patient feels heard and supported

This experience has made me a more empathetic and effective healthcare provider. I've learned that sometimes the most important skill is simply listening and showing genuine care for the patient's experience.`,
    learningObjectives: [
      'Demonstrate therapeutic communication skills',
      'Show empathy and understanding with patients',
      'Collaborate effectively with healthcare team members',
      'Adapt care approaches based on individual patient needs'
    ],
    hoursLogged: 38,
    status: 'pending_review'
  };

  const handleApprove = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback before approving the reflection.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Reflection Approved",
        description: "The reflection has been approved and feedback sent to the student.",
      });
      setIsSubmitting(false);
      navigate('/preceptor/dashboard');
    }, 1000);
  };

  const handleRequestRevision = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide specific feedback for revision requests.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Revision Requested",
        description: "The student has been notified and will receive your feedback.",
      });
      setIsSubmitting(false);
      navigate('/preceptor/dashboard');
    }, 1000);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your feedback has been saved as a draft.",
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
                    <FileText className="h-6 w-6 mr-2 text-indigo-600" />
                    Review Reflection
                  </h1>
                  <p className="text-gray-600">Week {reflection.weekNumber} - {reflection.weekPeriod}</p>
                </div>
              </div>
              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                <Clock className="h-3 w-3 mr-1" />
                Pending Review
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student Information */}
            <div className="lg:col-span-1">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={reflection.studentAvatar}
                      alt={reflection.studentName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
                    />
                    <div>
                      <p className="font-medium">{reflection.studentName}</p>
                      <p className="text-sm text-gray-600">{reflection.studentId}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Program</p>
                    <p className="text-sm text-gray-600">{reflection.program}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Submission Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(reflection.submissionDate).toLocaleDateString()} at {new Date(reflection.submissionDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Hours This Week</p>
                    <p className="text-sm text-gray-600">{reflection.hoursLogged} hours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Objectives */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Learning Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reflection.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Reflection Content */}
            <div className="lg:col-span-2">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Reflection Prompt & Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Prompt */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Reflection Prompt:</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">{reflection.prompt}</p>
                  </div>

                  {/* Student Response */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Student Response:</h4>
                    <div className="prose prose-sm max-w-none">
                      {reflection.reflection.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Section */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Your Review & Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Feedback Text Area */}
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback for Student
                    </label>
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide detailed feedback on the student's reflection. Consider their self-awareness, critical thinking, professional growth, and learning demonstrated..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white/50"
                      rows={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your feedback will be sent directly to the student and their academic advisor.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Processing...' : 'Approve Reflection'}
                    </Button>
                    
                    <Button
                      onClick={handleRequestRevision}
                      disabled={isSubmitting}
                      variant="outline"
                      className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Request Revision
                    </Button>
                    
                    <Button
                      onClick={handleSaveDraft}
                      variant="ghost"
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>

                  {/* Guidelines */}
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Review Guidelines:</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Assess depth of reflection and self-awareness</li>
                      <li>• Evaluate critical thinking and learning insights</li>
                      <li>• Consider professional growth and development</li>
                      <li>• Provide constructive, specific feedback</li>
                      <li>• Highlight strengths and areas for improvement</li>
                    </ul>
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

export default PreceptorReviewReflection;