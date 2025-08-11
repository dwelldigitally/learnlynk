import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Play, CheckCircle } from 'lucide-react';

interface SystemTrainingScreenProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const SystemTrainingScreen: React.FC<SystemTrainingScreenProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [trainingComplete, setTrainingComplete] = useState(false);

  const handleComplete = () => {
    setTrainingComplete(true);
    onComplete({ trainingProgress: { completed: true } });
    
    setTimeout(() => {
      onNext();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">System Training</h3>
        <p className="text-muted-foreground">
          Learn how to use Learnlynk effectively for your institution.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Tutorial</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            A comprehensive training program will be available in your dashboard.
          </p>
          <Button onClick={handleComplete} className="bg-primary hover:bg-primary-hover">
            {trainingComplete ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Training Complete
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Mark as Complete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemTrainingScreen;