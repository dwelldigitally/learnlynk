import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SetupOnboardingPage() {
  const navigate = useNavigate();

  const setupSteps = [
    { id: 1, title: 'Company Profile', description: 'Set up basic company information', completed: true },
    { id: 2, title: 'User Accounts', description: 'Add team members and assign roles', completed: true },
    { id: 3, title: 'Programs & Courses', description: 'Configure your academic programs', completed: false },
    { id: 4, title: 'Custom Fields', description: 'Define custom lead and student fields', completed: false },
    { id: 5, title: 'Email Templates', description: 'Set up communication templates', completed: false },
    { id: 6, title: 'Integrations', description: 'Connect external services', completed: false },
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/configuration/system')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Configuration
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Setup & Onboarding</h1>
          <p className="text-muted-foreground">
            Complete these steps to get your system up and running
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Setup Progress</CardTitle>
            <CardDescription>
              2 of 6 steps completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {setupSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{step.title}</h3>
                      {step.completed && (
                        <Badge variant="secondary" className="text-xs">Complete</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <Button variant={step.completed ? "outline" : "default"} size="sm">
                    {step.completed ? 'Review' : 'Start'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
