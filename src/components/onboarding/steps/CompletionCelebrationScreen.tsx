import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface CompletionCelebrationScreenProps {
  data: any;
  onboardingData: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const CompletionCelebrationScreen: React.FC<CompletionCelebrationScreenProps> = ({
  onboardingData,
  onNext
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative mb-6">
          <CheckCircle className="w-20 h-20 text-success mx-auto" />
          <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          🎉 Congratulations!
        </h3>
        <p className="text-muted-foreground text-lg">
          Your institution is now fully configured and ready to use Learnlynk.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Institution Profile</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="flex items-center justify-between">
            <span>Programs ({onboardingData.programs?.length || 0})</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="flex items-center justify-between">
            <span>Payment Processing</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="flex items-center justify-between">
            <span>Lead Capture Forms</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onNext} size="lg" className="bg-primary hover:bg-primary-hover">
          Enter Your Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CompletionCelebrationScreen;