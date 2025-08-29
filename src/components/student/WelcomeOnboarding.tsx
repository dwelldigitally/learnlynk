import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  ChevronRight,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WelcomeOnboardingProps {
  open: boolean;
  onComplete: () => void;
  studentName?: string;
}

const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({ 
  open, 
  onComplete, 
  studentName = "Student" 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: `Welcome to your Student Portal, ${studentName}!`,
      subtitle: "Let's get you oriented with everything you need to succeed",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              🎉 Congratulations on taking the first step!
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your application has been received and you now have access to your personal student portal. 
              This is your central hub for managing your journey at Western Community College.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "What you can do in your portal",
      subtitle: "Everything you need is organized and easy to find",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Document Management</h4>
                  <p className="text-sm text-gray-600 mt-1">Upload and track your application documents</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-2 border-green-100 hover:border-green-200 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Academic Planning</h4>
                  <p className="text-sm text-gray-600 mt-1">Plan your course schedule and academic pathway</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Financial Services</h4>
                  <p className="text-sm text-gray-600 mt-1">Pay fees and track payment history</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-2 border-orange-100 hover:border-orange-200 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Communication</h4>
                  <p className="text-sm text-gray-600 mt-1">Stay in touch with advisors and staff</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Your next steps",
      subtitle: "Here's what to focus on first",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Upload Required Documents</h4>
                <p className="text-sm text-gray-600">Start with your essential application documents</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Priority</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Review Academic Plan</h4>
                <p className="text-sm text-gray-600">Confirm your course selections and intake date</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Important</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Complete Fee Payment</h4>
                <p className="text-sm text-gray-600">Secure your seat with the enrollment fee</p>
              </div>
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Pro Tip</h4>
                <p className="text-sm text-gray-600">Use the sidebar navigation to easily access any section. Your progress is automatically saved!</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      onComplete();
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl p-0 bg-white border-0 shadow-2xl">
        <div className="relative overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className={`p-8 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600">
                  {steps[currentStep].subtitle}
                </p>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px] flex items-center justify-center">
                {steps[currentStep].content}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex space-x-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} of {steps.length}
                  </span>
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>{isLastStep ? "Get Started" : "Continue"}</span>
                    {isLastStep ? <ArrowRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeOnboarding;