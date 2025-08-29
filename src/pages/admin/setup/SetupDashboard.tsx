import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, ArrowRight, Clock, Settings, Users, Building2, FileText, CreditCard, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isEssential: boolean;
  isComplete: boolean;
  estimatedMinutes: number;
}

export const SetupDashboard = () => {
  const navigate = useNavigate();
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: 'institution',
      title: 'Institution Setup',
      description: 'Configure your institution details, website analysis, and programs',
      href: '/admin/setup/institution',
      icon: Building2,
      isEssential: true,
      isComplete: false,
      estimatedMinutes: 10
    },
    {
      id: 'applications',
      title: 'Application Setup',
      description: 'Set up requirements, forms, and lead capture',
      href: '/admin/setup/applications',
      icon: FileText,
      isEssential: true,
      isComplete: false,
      estimatedMinutes: 15
    },
    {
      id: 'business',
      title: 'Business Setup',
      description: 'Configure payments, integrations, and events',
      href: '/admin/setup/business',
      icon: CreditCard,
      isEssential: false,
      isComplete: false,
      estimatedMinutes: 12
    },
    {
      id: 'team',
      title: 'Team & Training',
      description: 'Set up team members and system training',
      href: '/admin/setup/team',
      icon: Users,
      isEssential: false,
      isComplete: false,
      estimatedMinutes: 8
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Import initial data and advanced configuration',
      href: '/admin/setup/data',
      icon: Zap,
      isEssential: false,
      isComplete: false,
      estimatedMinutes: 20
    }
  ]);

  // Load completion status from localStorage and refresh when returning to dashboard
  useEffect(() => {
    const loadSetupProgress = () => {
      const savedData = localStorage.getItem('onboarding_data');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setSetupSteps(prevSteps => 
            prevSteps.map(step => {
              // Check if this setup area has been completed
              const isComplete = checkStepCompletion(step.id, data);
              return { ...step, isComplete };
            })
          );
        } catch (error) {
          console.error('Error loading setup progress:', error);
        }
      }
    };

    // Load initially
    loadSetupProgress();

    // Listen for storage changes (when other tabs/components update localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'onboarding_data') {
        loadSetupProgress();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also refresh when returning to this page (in case localStorage was updated)
    const handleFocus = () => {
      loadSetupProgress();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const checkStepCompletion = (stepId: string, data: any): boolean => {
    switch (stepId) {
      case 'institution':
        return !!(data.institution?.name && data.programs?.length > 0);
      case 'applications':
        return !!(data.requirements?.length > 0 || data.forms?.length > 0);
      case 'business':
        return !!(data.payment?.configured || data.integrations?.length > 0);
      case 'team':
        return !!(data.team?.members?.length > 0 || data.training?.completed);
      case 'data':
        return !!(data.initialData?.imported || data.advancedConfig?.configured);
      default:
        return false;
    }
  };

  const essentialSteps = setupSteps.filter(step => step.isEssential);
  const optionalSteps = setupSteps.filter(step => !step.isEssential);
  
  const completedEssential = essentialSteps.filter(step => step.isComplete).length;
  const completedOptional = optionalSteps.filter(step => step.isComplete).length;
  const totalCompleted = completedEssential + completedOptional;
  
  const essentialProgress = (completedEssential / essentialSteps.length) * 100;
  const overallProgress = (totalCompleted / setupSteps.length) * 100;

  const handleStepClick = (href: string) => {
    navigate(href);
  };

  const renderStepCard = (step: SetupStep) => (
    <Card 
      key={step.id}
      className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
      onClick={() => handleStepClick(step.href)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`p-3 rounded-lg ${step.isComplete ? 'bg-primary/10' : 'bg-muted'}`}>
            <step.icon className={`w-6 h-6 ${step.isComplete ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg">{step.title}</h3>
              {step.isEssential && (
                <Badge variant="secondary" className="text-xs">Essential</Badge>
              )}
              {step.isComplete ? (
                <CheckCircle className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            <p className="text-muted-foreground mb-3">{step.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>~{step.estimatedMinutes} min</span>
              </div>
              {step.isComplete && (
                <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                  Complete
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <ArrowRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Setup & Configuration</h1>
        <p className="text-muted-foreground">
          Complete these setup steps to get the most out of your institution management system.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Essential Setup</h3>
              <p className="text-sm text-muted-foreground">Required to get started</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {completedEssential} of {essentialSteps.length} completed
              </span>
              <span className="text-sm font-medium">{Math.round(essentialProgress)}%</span>
            </div>
            <Progress value={essentialProgress} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-muted rounded-lg">
              <Zap className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Overall Progress</h3>
              <p className="text-sm text-muted-foreground">All setup areas</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {totalCompleted} of {setupSteps.length} completed
              </span>
              <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </Card>
      </div>

      {/* Essential Setup Steps */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-xl font-semibold">Essential Setup</h2>
          <Badge variant="outline">Required</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {essentialSteps.map(renderStepCard)}
        </div>
      </div>

      {/* Optional Setup Steps */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Additional Setup</h2>
        <div className="grid grid-cols-1 gap-4">
          {optionalSteps.map(renderStepCard)}
        </div>
      </div>

      {/* Quick Actions */}
      {completedEssential < essentialSteps.length && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary mb-1">Get Started Quickly</h3>
              <p className="text-sm text-muted-foreground">
                Complete the essential setup to unlock core functionality
              </p>
            </div>
            <Button 
              onClick={() => {
                const nextStep = essentialSteps.find(step => !step.isComplete);
                if (nextStep) navigate(nextStep.href);
              }}
              className="shrink-0"
            >
              Continue Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};