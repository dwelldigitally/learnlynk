import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Brain, 
  Users, 
  Database, 
  Settings, 
  Activity, 
  TrendingUp,
  FileText,
  MessageSquare,
  Target,
  Zap,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAIActions } from '@/hooks/useAIActions';
import { useToast } from '@/hooks/use-toast';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'active' | 'inactive' | 'configuring';
  category: 'sales' | 'application' | 'student' | 'database';
  metrics?: {
    label: string;
    value: string;
  }[];
  actions: {
    label: string;
    type: 'primary' | 'secondary';
    onClick: () => void;
  }[];
}

export function AIFeaturesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { isProcessing } = useAIActions();
  const { toast } = useToast();

  const aiFeatures: AIFeature[] = [
    // Sales Based Features
    {
      id: 'lead-scoring',
      name: 'AI Lead Scoring',
      description: 'Automatically score and prioritize leads based on behavior, demographics, and engagement patterns.',
      icon: Target,
      status: 'active',
      category: 'sales',
      metrics: [
        { label: 'Accuracy', value: '94%' },
        { label: 'Leads Scored', value: '1,247' }
      ],
      actions: [
        { label: 'Configure', type: 'primary', onClick: () => window.location.href = '/admin/configuration/scoring' },
        { label: 'Analytics', type: 'secondary', onClick: () => window.location.href = '/admin/leads/analytics' }
      ]
    },
    {
      id: 'smart-assignment',
      name: 'Smart Lead Assignment',
      description: 'Intelligently assign leads to the best-suited team members based on expertise and workload.',
      icon: Users,
      status: 'active',
      category: 'sales',
      metrics: [
        { label: 'Assignments', value: '892' },
        { label: 'Success Rate', value: '87%' }
      ],
      actions: [
        { label: 'Configure', type: 'primary', onClick: () => window.location.href = '/admin/configuration/routing' },
        { label: 'View Rules', type: 'secondary', onClick: () => window.location.href = '/admin/leads/routing' }
      ]
    },
    {
      id: 'follow-up-automation',
      name: 'AI Follow-up Automation',
      description: 'Generate personalized follow-up sequences and automate communication timing.',
      icon: Clock,
      status: 'active',
      category: 'sales',
      metrics: [
        { label: 'Messages Sent', value: '3,456' },
        { label: 'Response Rate', value: '42%' }
      ],
      actions: [
        { label: 'Manage', type: 'primary', onClick: () => window.location.href = '/admin/communication' },
        { label: 'Templates', type: 'secondary', onClick: () => window.location.href = '/admin/communication/templates' }
      ]
    },

    // Application Based Features
    {
      id: 'document-processing',
      name: 'Document Processing AI',
      description: 'Automatically extract, verify, and process application documents and forms.',
      icon: FileText,
      status: 'active',
      category: 'application',
      metrics: [
        { label: 'Documents Processed', value: '2,891' },
        { label: 'Accuracy', value: '96%' }
      ],
      actions: [
        { label: 'Configure', type: 'primary', onClick: () => window.location.href = '/admin/documents' },
        { label: 'View Queue', type: 'secondary', onClick: () => window.location.href = '/admin/documents/queue' }
      ]
    },
    {
      id: 'application-review',
      name: 'AI Application Review',
      description: 'Intelligent review and scoring of student applications with compliance checking.',
      icon: CheckCircle,
      status: 'configuring',
      category: 'application',
      metrics: [
        { label: 'Applications Reviewed', value: '567' },
        { label: 'Time Saved', value: '78 hrs' }
      ],
      actions: [
        { label: 'Setup', type: 'primary', onClick: () => toast({ title: 'Feature in development', description: 'This feature is currently being configured.' }) },
        { label: 'Preview', type: 'secondary', onClick: () => window.location.href = '/admin/students' }
      ]
    },
    {
      id: 'enrollment-prediction',
      name: 'Enrollment Prediction',
      description: 'Predict enrollment likelihood and optimize admission decisions with ML models.',
      icon: TrendingUp,
      status: 'active',
      category: 'application',
      metrics: [
        { label: 'Predictions Made', value: '1,234' },
        { label: 'Accuracy', value: '91%' }
      ],
      actions: [
        { label: 'View Model', type: 'primary', onClick: () => window.location.href = '/admin/analytics' },
        { label: 'Reports', type: 'secondary', onClick: () => window.location.href = '/admin/reports' }
      ]
    },

    // Student Based Features
    {
      id: 'ai-agents',
      name: 'AI Student Agents',
      description: 'Deploy intelligent agents to handle student inquiries and provide 24/7 support.',
      icon: Bot,
      status: 'active',
      category: 'student',
      metrics: [
        { label: 'Active Agents', value: '3' },
        { label: 'Conversations', value: '1,567' }
      ],
      actions: [
        { label: 'Manage Agents', type: 'primary', onClick: () => window.location.href = '/admin/configuration/ai-agents' },
        { label: 'Analytics', type: 'secondary', onClick: () => window.location.href = '/admin/communication' }
      ]
    },
    {
      id: 'communication-automation',
      name: 'Communication Automation',
      description: 'Automate routine communications and provide intelligent response suggestions.',
      icon: MessageSquare,
      status: 'active',
      category: 'student',
      metrics: [
        { label: 'Messages Automated', value: '4,321' },
        { label: 'Satisfaction', value: '4.7/5' }
      ],
      actions: [
        { label: 'Configure', type: 'primary', onClick: () => window.location.href = '/admin/communication' },
        { label: 'AI Emails', type: 'secondary', onClick: () => window.location.href = '/admin/communication/ai-emails' }
      ]
    },
    {
      id: 'lead-qualification',
      name: 'AI Lead Qualification',
      description: 'Automatically qualify and categorize leads based on interest and fit.',
      icon: Brain,
      status: 'active',
      category: 'student',
      metrics: [
        { label: 'Leads Qualified', value: '2,134' },
        { label: 'Conversion Rate', value: '23%' }
      ],
      actions: [
        { label: 'Manage', type: 'primary', onClick: () => window.location.href = '/admin/leads/ai' },
        { label: 'Rules', type: 'secondary', onClick: () => window.location.href = '/admin/leads/routing' }
      ]
    },

    // Database Based Features
    {
      id: 'template-generation',
      name: 'AI Template Generation',
      description: 'Generate personalized email templates and communication content automatically.',
      icon: Zap,
      status: 'active',
      category: 'database',
      metrics: [
        { label: 'Templates Generated', value: '789' },
        { label: 'Usage Rate', value: '84%' }
      ],
      actions: [
        { label: 'Generate', type: 'primary', onClick: () => window.location.href = '/admin/communication' },
        { label: 'Library', type: 'secondary', onClick: () => window.location.href = '/admin/document-templates' }
      ]
    },
    {
      id: 'reply-automation',
      name: 'AI Reply Generation',
      description: 'Generate contextual email replies and automate routine responses.',
      icon: MessageSquare,
      status: 'active',
      category: 'database',
      metrics: [
        { label: 'Replies Generated', value: '1,678' },
        { label: 'Time Saved', value: '156 hrs' }
      ],
      actions: [
        { label: 'Configure', type: 'primary', onClick: () => window.location.href = '/admin/communication/ai-emails' },
        { label: 'Analytics', type: 'secondary', onClick: () => window.location.href = '/admin/analytics' }
      ]
    },
    {
      id: 'data-analysis',
      name: 'AI Data Analysis',
      description: 'Advanced analytics and insights powered by machine learning algorithms.',
      icon: Activity,
      status: 'active',
      category: 'database',
      metrics: [
        { label: 'Reports Generated', value: '234' },
        { label: 'Insights Found', value: '67' }
      ],
      actions: [
        { label: 'View Analytics', type: 'primary', onClick: () => window.location.href = '/admin/analytics' },
        { label: 'Custom Reports', type: 'secondary', onClick: () => window.location.href = '/admin/reports' }
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Features', icon: Settings },
    { id: 'sales', label: 'Sales Based', icon: Target },
    { id: 'application', label: 'Application Based', icon: FileText },
    { id: 'student', label: 'Student Based', icon: Users },
    { id: 'database', label: 'Database Based', icon: Database }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? aiFeatures 
    : aiFeatures.filter(feature => feature.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'inactive': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      case 'configuring': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'inactive': return <XCircle className="h-3 w-3" />;
      case 'configuring': return <Settings className="h-3 w-3 animate-spin" />;
      default: return <XCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Features</h1>
          <p className="text-muted-foreground">
            Manage and configure all AI-powered features across your platform
          </p>
        </div>
        <Button onClick={() => window.location.href = '/admin/configuration/ai-agents'}>
          <Settings className="h-4 w-4 mr-2" />
          Configure AI
        </Button>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {category.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFeatures.map(feature => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{feature.name}</CardTitle>
                            <Badge 
                              variant="outline" 
                              className={`mt-1 ${getStatusColor(feature.status)}`}
                            >
                              {getStatusIcon(feature.status)}
                              <span className="ml-1 capitalize">{feature.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {feature.metrics && (
                        <div className="grid grid-cols-2 gap-4">
                          {feature.metrics.map((metric, index) => (
                            <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-2xl font-bold text-primary">{metric.value}</div>
                              <div className="text-xs text-muted-foreground">{metric.label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {feature.actions.map((action, index) => (
                          <Button 
                            key={index}
                            variant={action.type === 'primary' ? 'default' : 'outline'}
                            size="sm"
                            onClick={action.onClick}
                            disabled={isProcessing}
                            className="flex-1"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}