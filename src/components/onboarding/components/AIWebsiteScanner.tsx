import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Search, 
  Brain, 
  Zap, 
  BookOpen, 
  DollarSign, 
  Calendar,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface ScanningStage {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface AIWebsiteScannerProps {
  url: string;
  stages: ScanningStage[];
  currentStage: number;
  isActive: boolean;
}

const AIWebsiteScanner: React.FC<AIWebsiteScannerProps> = ({
  url,
  stages,
  currentStage,
  isActive
}) => {
  const [progress, setProgress] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (isActive) {
      const progressValue = ((currentStage + 1) / stages.length) * 100;
      setProgress(progressValue);
    }
  }, [currentStage, stages.length, isActive]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 4);
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getStageStatus = (stageIndex: number) => {
    if (stageIndex < currentStage) return 'completed';
    if (stageIndex === currentStage) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      {/* Browser Window Mockup */}
      <div className="border border-border rounded-lg overflow-hidden bg-background shadow-lg">
        {/* Browser Header */}
        <div className="bg-muted px-4 py-2 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 bg-background rounded px-3 py-1 text-sm text-muted-foreground">
              {url}
            </div>
          </div>
        </div>

        {/* Website Content with Scanning Overlay */}
        <div className="relative bg-muted/30 p-6 min-h-[300px]">
          {/* Mock Website Content */}
          <div className="grid grid-cols-12 gap-4 opacity-50">
            <div className="col-span-12 h-12 bg-primary/20 rounded"></div>
            <div className="col-span-8 space-y-4">
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-24 bg-muted rounded"></div>
              </div>
            </div>
            <div className="col-span-4 space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>

          {/* Scanning Animation Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 rounded-full">
                  <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin">
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Scanning Dots */}
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      animationStep === i ? 'bg-primary scale-125' : 'bg-primary/30'
                    }`}
                  />
                ))}
              </div>

              <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-sm">
                <div className="flex items-center space-x-2 mb-2">
                  {React.createElement(stages[currentStage]?.icon || Loader2, {
                    className: "w-4 h-4 text-primary"
                  })}
                  <span className="text-sm font-medium text-foreground">
                    {stages[currentStage]?.label || 'Processing...'}
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(progress)}% complete
                </div>
              </div>
            </div>
          </div>

          {/* Floating Detection Elements */}
          <div className="absolute top-4 right-4 space-y-2">
            {['Programs Found: 3', 'Fees Detected', 'Requirements Mapped'].map((item, index) => (
              <div
                key={index}
                className={`bg-primary/10 border border-primary/20 rounded-lg px-3 py-1 text-xs font-medium text-primary transition-all duration-500 ${
                  currentStage > index + 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
              >
                <CheckCircle className="w-3 h-3 inline mr-1" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage List */}
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const status = getStageStatus(index);
          const StageIcon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                status === 'active'
                  ? 'bg-primary/10 border border-primary/20'
                  : status === 'completed'
                  ? 'bg-success/10 border border-success/20'
                  : 'bg-muted/30'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  status === 'active'
                    ? 'bg-primary text-primary-foreground'
                    : status === 'completed'
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {status === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : status === 'active' ? (
                  <StageIcon className="w-4 h-4 animate-pulse" />
                ) : (
                  <StageIcon className="w-4 h-4" />
                )}
              </div>
              
              <div className="flex-1">
                <div
                  className={`font-medium transition-colors ${
                    status === 'active'
                      ? 'text-primary'
                      : status === 'completed'
                      ? 'text-success'
                      : 'text-muted-foreground'
                  }`}
                >
                  {stage.label}
                </div>
              </div>

              {status === 'active' && (
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full bg-primary transition-opacity duration-300 ${
                        animationStep >= i ? 'opacity-100' : 'opacity-30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIWebsiteScanner;