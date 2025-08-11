import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Bot, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Target,
  Zap,
  Users,
  Calendar,
  Settings,
  BarChart3,
  Heart,
  Share2
} from "lucide-react";
import { AIAgentData } from "../AIAgentWizard";

interface CongratulationsStepProps {
  agentData: AIAgentData;
  agentId: string | null;
  onClose: () => void;
}

const CELEBRATION_STEPS = [
  "🎉 Agent Created Successfully!",
  "🤖 AI Personality Configured",
  "⚙️ Core Settings Applied",
  "🎯 Filters & Rules Set",
  "🚀 Ready to Handle Leads!"
];

export function CongratulationsStep({ agentData, agentId, onClose }: CongratulationsStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAllSteps, setShowAllSteps] = useState(false);

  useEffect(() => {
    if (currentStep < CELEBRATION_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowAllSteps(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const nextSteps = [
    {
      icon: Settings,
      title: "Customize Settings",
      description: "Fine-tune your agent's configuration anytime",
      action: "Go to Settings"
    },
    {
      icon: BarChart3,
      title: "Monitor Performance",
      description: "Track your agent's performance and metrics",
      action: "View Dashboard"
    },
    {
      icon: Users,
      title: "Train Your Team",
      description: "Help your team understand the new AI assistant",
      action: "Training Guide"
    },
    {
      icon: Share2,
      title: "Share Success",
      description: "Let your organization know about your new AI agent",
      action: "Share Update"
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Celebration Animation */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="p-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-full w-24 h-24 mx-auto flex items-center justify-center animate-bounce">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 animate-ping">
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="absolute -bottom-2 -left-2 animate-pulse">
            <Sparkles className="h-6 w-6 text-pink-500" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Congratulations! 🎉
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Your AI Agent "{agentData.name}" is Ready!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You've successfully created an intelligent AI assistant that will help you manage leads, 
            provide exceptional customer service, and grow your business 24/7.
          </p>
        </div>

        {/* Progress Animation */}
        <div className="space-y-2">
          {CELEBRATION_STEPS.map((step, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index <= currentStep
                  ? 'opacity-100 transform translate-x-0'
                  : 'opacity-0 transform translate-x-4'
              }`}
            >
              <div className="flex items-center justify-center gap-3 p-2">
                <CheckCircle 
                  className={`h-5 w-5 transition-colors duration-300 ${
                    index <= currentStep ? 'text-green-500' : 'text-gray-300'
                  }`} 
                />
                <span className={`font-medium ${
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAllSteps && (
        <div className="space-y-6 animate-fade-in">
          {/* Agent Summary */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                Your New AI Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-lg">{agentData.specializations?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Specializations</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-lg">{agentData.max_concurrent_leads}</div>
                  <div className="text-sm text-muted-foreground">Max Leads</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-lg">{agentData.response_time_target}h</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-lg">
                    {agentData.activation_mode === 'immediate' ? 'NOW' : 'SCHEDULED'}
                  </div>
                  <div className="text-sm text-muted-foreground">Activation</div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    {agentData.activation_mode === 'immediate' 
                      ? 'Your agent is now active and ready to handle leads!'
                      : 'Your agent will be activated according to your schedule.'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-6 w-6 text-primary" />
                What's Next?
              </CardTitle>
              <p className="text-muted-foreground">
                Here are some recommended next steps to get the most out of your new AI agent
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium group-hover:text-primary transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                          <Button variant="ghost" size="sm" className="p-0 h-auto mt-2">
                            {step.action}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">
                Welcome to the Future of Lead Management!
              </h3>
              <p className="text-green-700 max-w-2xl mx-auto">
                Your AI agent is equipped with advanced conversation flows, intelligent filtering, 
                and automated workflows. It will learn from every interaction and continuously 
                improve its performance to help you convert more leads into students.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  24/7 Availability
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Instant Responses
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Intelligent Filtering
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Automated Follow-ups
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="text-center pt-4">
            <Button onClick={onClose} size="lg" className="min-w-48">
              <CheckCircle className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              You can always modify your agent's settings later
            </p>
          </div>
        </div>
      )}
    </div>
  );
}