import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Mail, 
  Phone, 
  FileText, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target,
  Users,
  GraduationCap,
  AlertTriangle,
  Zap,
  BookOpen,
  Award,
  FileCheck
} from 'lucide-react';

interface AIRecommendation {
  id: string;
  type: 'action' | 'automation' | 'alert' | 'insight';
  priority: 'high' | 'medium' | 'low';
  icon: any;
  title: string;
  description: string;
  actionLabel?: string;
  automated?: boolean;
  timeframe?: string;
}

interface AIRecommendationsProps {
  currentStage: string;
  leadData?: any;
  onActionClick?: (recommendationId: string) => void;
}

const getRecommendationsForStage = (stage: string): AIRecommendation[] => {
  const recommendations: Record<string, AIRecommendation[]> = {
    'Inquiry': [
      {
        id: 'auto-welcome-email',
        type: 'automation',
        priority: 'high',
        icon: Mail,
        title: 'Auto-send welcome email',
        description: 'Send personalized welcome email with counselor intro and clear next steps',
        actionLabel: 'Configure Email',
        automated: true,
        timeframe: 'Immediate'
      },
      {
        id: 'assign-counselor',
        type: 'action',
        priority: 'high',
        icon: Users,
        title: 'Assign counselor + schedule call',
        description: 'Recommend counselor assignment and schedule call within 24h',
        actionLabel: 'Assign Now',
        timeframe: '24h'
      },
      {
        id: 'activity-check-sms',
        type: 'automation',
        priority: 'medium',
        icon: MessageSquare,
        title: 'Inactivity SMS reminder',
        description: 'Auto-send interest check SMS if no activity in 48h',
        actionLabel: 'Setup Automation',
        automated: true,
        timeframe: '48h delay'
      }
    ],
    'Qualification': [
      {
        id: 'screening-call-script',
        type: 'insight',
        priority: 'high',
        icon: FileText,
        title: 'Screening call script',
        description: 'Personalized call script based on program interest and background',
        actionLabel: 'View Script'
      },
      {
        id: 'pre-qualification-checklist',
        type: 'action',
        priority: 'high',
        icon: CheckCircle,
        title: 'Pre-qualification checklist',
        description: 'Send customized checklist for documents, GPA, and requirements',
        actionLabel: 'Send Checklist'
      },
      {
        id: 'high-potential-flag',
        type: 'alert',
        priority: 'medium',
        icon: Target,
        title: 'High-potential lead detected',
        description: 'AI flagged this lead as high-potential based on behavioral patterns',
        actionLabel: 'View Analysis'
      },
      {
        id: 'personalized-followup',
        type: 'action',
        priority: 'medium',
        icon: Mail,
        title: 'Personalized follow-up',
        description: 'Send program-specific FAQs and additional information',
        actionLabel: 'Send Email'
      }
    ],
    'Nurturing': [
      {
        id: 'drip-campaign',
        type: 'automation',
        priority: 'high',
        icon: Zap,
        title: 'Assign to drip campaign',
        description: 'Enroll in "Why Study With Us" and "Top Careers" email series',
        actionLabel: 'Enroll Now',
        automated: true
      },
      {
        id: 'video-content',
        type: 'action',
        priority: 'medium',
        icon: FileText,
        title: 'Send program video',
        description: 'Share video from program lead or alumni success story',
        actionLabel: 'Select Video'
      },
      {
        id: 'inactivity-reminder',
        type: 'automation',
        priority: 'low',
        icon: Clock,
        title: 'Inactivity reminder',
        description: 'Auto-remind after 3 days of no engagement',
        actionLabel: 'Configure',
        automated: true,
        timeframe: '3 days'
      },
      {
        id: 'replicate-success',
        type: 'insight',
        priority: 'medium',
        icon: Brain,
        title: 'Similar profile analysis',
        description: 'Found similar profiles that converted - replicate best content',
        actionLabel: 'View Strategy'
      }
    ],
    'Application Initiated': [
      {
        id: 'app-completion-nudge',
        type: 'automation',
        priority: 'high',
        icon: AlertTriangle,
        title: 'Application completion reminder',
        description: 'Auto-nudge after 24h: "Need help finishing your application?"',
        actionLabel: 'Send Now',
        automated: true,
        timeframe: '24h delay'
      },
      {
        id: 'live-support-offer',
        type: 'action',
        priority: 'high',
        icon: MessageSquare,
        title: 'Offer live support',
        description: 'Provide chatbot assistance or real-time counselor booking',
        actionLabel: 'Enable Support'
      },
      {
        id: 'incomplete-fields-check',
        type: 'insight',
        priority: 'medium',
        icon: FileCheck,
        title: 'Incomplete fields analysis',
        description: 'Identify incomplete sections and send targeted micro-reminders',
        actionLabel: 'Check Status'
      },
      {
        id: 'document-checklist',
        type: 'action',
        priority: 'medium',
        icon: FileText,
        title: 'Document checklist',
        description: 'Send program-specific document requirements and details',
        actionLabel: 'Send Checklist'
      }
    ],
    'Application Submitted': [
      {
        id: 'missing-docs-request',
        type: 'action',
        priority: 'high',
        icon: FileText,
        title: 'Request missing documents',
        description: 'Auto-detected document gaps - request specific missing items',
        actionLabel: 'Send Request'
      },
      {
        id: 'counselor-followup-tasks',
        type: 'automation',
        priority: 'high',
        icon: Calendar,
        title: 'Auto-set follow-up tasks',
        description: 'Create tasks for counselors to review and process application',
        actionLabel: 'Create Tasks',
        automated: true
      },
      {
        id: 'document-delay-prediction',
        type: 'alert',
        priority: 'medium',
        icon: Brain,
        title: 'Document delay risk',
        description: 'AI predicts potential document delays - send priority nudge',
        actionLabel: 'Send Priority Nudge'
      },
      {
        id: 'doc-checklist-summary',
        type: 'automation',
        priority: 'low',
        icon: Mail,
        title: 'Document checklist summary',
        description: 'AI-generated summary email of required documents',
        actionLabel: 'Send Summary',
        automated: true
      }
    ],
    'Documents Pending / Submitted': [
      {
        id: 'ready-for-review-tag',
        type: 'automation',
        priority: 'high',
        icon: CheckCircle,
        title: 'Auto-tag ready for review',
        description: 'Automatically mark complete applications for review',
        actionLabel: 'Enable Auto-tag',
        automated: true
      },
      {
        id: 'document-verification-task',
        type: 'action',
        priority: 'high',
        icon: FileCheck,
        title: 'Document verification task',
        description: 'Assign internal task to verify document authenticity',
        actionLabel: 'Assign Task'
      },
      {
        id: 'missing-document-nudge',
        type: 'automation',
        priority: 'medium',
        icon: MessageSquare,
        title: 'Missing document reminder',
        description: 'Nudge inactive students: "We\'re waiting for your transcript"',
        actionLabel: 'Configure Nudge',
        automated: true
      },
      {
        id: 'advance-to-interview',
        type: 'action',
        priority: 'medium',
        icon: Calendar,
        title: 'Advance to interview',
        description: 'All documents complete - suggest advancing to interview stage',
        actionLabel: 'Schedule Interview'
      }
    ],
    'Interview / Counseling': [
      {
        id: 'call-prep-sheet',
        type: 'automation',
        priority: 'high',
        icon: FileText,
        title: 'Auto-generate call prep sheet',
        description: 'Create prep sheet with student interests, behavior, and gaps',
        actionLabel: 'Generate Sheet',
        automated: true
      },
      {
        id: 'interview-reminders',
        type: 'automation',
        priority: 'high',
        icon: Calendar,
        title: 'Schedule reminders',
        description: 'Auto-reminders for both counselor and student',
        actionLabel: 'Setup Reminders',
        automated: true
      },
      {
        id: 'post-call-notes',
        type: 'automation',
        priority: 'medium',
        icon: FileText,
        title: 'Auto-draft call notes',
        description: 'Generate counselor notes and recommended next actions',
        actionLabel: 'Enable Auto-notes',
        automated: true
      },
      {
        id: 'offer-recommendation',
        type: 'insight',
        priority: 'medium',
        icon: Award,
        title: 'Offer recommendation',
        description: 'Update status to "Offer Recommended" if call was positive',
        actionLabel: 'Update Status'
      }
    ],
    'Offer Sent': [
      {
        id: 'auto-send-offer',
        type: 'automation',
        priority: 'high',
        icon: Mail,
        title: 'Auto-send offer with deadline',
        description: 'Send formal offer letter with acceptance deadline',
        actionLabel: 'Send Offer',
        automated: true
      },
      {
        id: 'financial-aid-support',
        type: 'action',
        priority: 'high',
        icon: Brain,
        title: 'Financial aid information',
        description: 'Send location-based financial aid and visa support info',
        actionLabel: 'Send Info'
      },
      {
        id: 'offer-qa-chatbot',
        type: 'automation',
        priority: 'medium',
        icon: MessageSquare,
        title: 'Trigger Q&A chatbot',
        description: 'Activate chatbot: "What does my offer mean?"',
        actionLabel: 'Enable Chatbot',
        automated: true
      },
      {
        id: 'acceptance-prediction',
        type: 'insight',
        priority: 'medium',
        icon: Target,
        title: 'Acceptance likelihood',
        description: 'AI predicts acceptance probability and recommends counselor action',
        actionLabel: 'View Analysis'
      }
    ],
    'Offer Accepted': [
      {
        id: 'tuition-payment-followup',
        type: 'action',
        priority: 'high',
        icon: AlertTriangle,
        title: 'Tuition payment follow-up',
        description: 'Send payment instructions and deadline reminders',
        actionLabel: 'Send Instructions'
      },
      {
        id: 'welcome-onboarding',
        type: 'automation',
        priority: 'high',
        icon: GraduationCap,
        title: 'Welcome onboarding materials',
        description: 'Send "Welcome to Program" onboarding package',
        actionLabel: 'Send Welcome',
        automated: true
      },
      {
        id: 'payment-dropoff-prediction',
        type: 'alert',
        priority: 'medium',
        icon: Brain,
        title: 'Payment drop-off risk',
        description: 'AI predicts payment/document drop-off risk',
        actionLabel: 'Send Reminder'
      },
      {
        id: 'orientation-invite',
        type: 'action',
        priority: 'medium',
        icon: Calendar,
        title: 'Orientation event invite',
        description: 'Send invitation to upcoming orientation events',
        actionLabel: 'Send Invite'
      }
    ],
    'Enrollment Confirmed': [
      {
        id: 'congratulations-portal',
        type: 'automation',
        priority: 'high',
        icon: Award,
        title: 'Congratulations & portal access',
        description: 'Send congratulations email with student portal login',
        actionLabel: 'Send Welcome',
        automated: true
      },
      {
        id: 'program-onboarding-checklist',
        type: 'action',
        priority: 'high',
        icon: CheckCircle,
        title: 'Program onboarding checklist',
        description: 'Provide program-specific onboarding tasks and requirements',
        actionLabel: 'Send Checklist'
      },
      {
        id: 'counselor-handoff',
        type: 'action',
        priority: 'medium',
        icon: Users,
        title: 'Counselor to advisor handoff',
        description: 'Transfer from recruitment counselor to academic advisor',
        actionLabel: 'Initiate Handoff'
      },
      {
        id: 'system-integration',
        type: 'automation',
        priority: 'medium',
        icon: BookOpen,
        title: 'LMS & system integration',
        description: 'Sync with LMS, ID card, and class schedule systems',
        actionLabel: 'Sync Systems',
        automated: true
      }
    ],
    'Orientation & Onboarding': [
      {
        id: 'onboarding-reminders',
        type: 'automation',
        priority: 'high',
        icon: Calendar,
        title: 'Onboarding reminders',
        description: 'Send reminders for housing, textbooks, and other essentials',
        actionLabel: 'Setup Reminders',
        automated: true
      },
      {
        id: 'engagement-tracking',
        type: 'insight',
        priority: 'medium',
        icon: Brain,
        title: 'Early engagement patterns',
        description: 'Track engagement and flag at-risk students for check-ins',
        actionLabel: 'View Patterns'
      },
      {
        id: 'two-week-checkin',
        type: 'automation',
        priority: 'low',
        icon: Phone,
        title: 'Auto-schedule 2-week check-in',
        description: 'Automatically schedule follow-up call in 2 weeks',
        actionLabel: 'Schedule Call',
        automated: true,
        timeframe: '2 weeks'
      }
    ],
    'Enrolled / Active': [
      {
        id: 'academic-monitoring',
        type: 'insight',
        priority: 'medium',
        icon: Brain,
        title: 'Academic performance monitoring',
        description: 'Track academic progress and flag intervention needs',
        actionLabel: 'View Dashboard'
      },
      {
        id: 'retention-support',
        type: 'action',
        priority: 'medium',
        icon: Users,
        title: 'Retention support resources',
        description: 'Provide academic and personal support resources',
        actionLabel: 'Access Resources'
      }
    ]
  };

  return recommendations[stage] || [];
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-destructive text-destructive-foreground';
    case 'medium': return 'bg-secondary text-secondary-foreground';
    case 'low': return 'bg-muted text-muted-foreground';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'automation': return <Zap className="h-3 w-3" />;
    case 'alert': return <AlertTriangle className="h-3 w-3" />;
    case 'insight': return <Brain className="h-3 w-3" />;
    default: return <Target className="h-3 w-3" />;
  }
};

export function AIRecommendations({ currentStage, leadData, onActionClick }: AIRecommendationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const recommendations = getRecommendationsForStage(currentStage);
  
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recommendations available for this stage.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Recommendations for {currentStage}
          <Badge variant="outline" className="ml-auto">
            {recommendations.length} suggestions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon;
          const isExpanded = expandedId === rec.id;
          
          return (
            <div key={rec.id} className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="mt-1">
                  <IconComponent className="h-4 w-4 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getPriorityColor(rec.priority)}`}
                    >
                      {rec.priority}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(rec.type)}
                      <span className="text-xs text-muted-foreground capitalize">{rec.type}</span>
                    </div>
                    {rec.automated && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {rec.timeframe && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rec.timeframe}
                        </span>
                      )}
                    </div>
                    
                    {rec.actionLabel && (
                      <Button 
                        size="sm" 
                        variant={rec.priority === 'high' ? 'default' : 'outline'}
                        onClick={() => onActionClick?.(rec.id)}
                        className="text-xs"
                      >
                        {rec.actionLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {index < recommendations.length - 1 && <Separator />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}