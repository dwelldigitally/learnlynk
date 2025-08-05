import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Target,
  Lightbulb,
  BarChart3,
  Users,
  Mail,
  MessageSquare
} from 'lucide-react';

interface StudentRightSidebarProps {
  student: any;
}

export function StudentRightSidebar({ student }: StudentRightSidebarProps) {
  // Calculate AI score based on student metrics
  const calculateAIScore = () => {
    const gpaScore = (student.gpa / 4.0) * 25;
    const progressScore = (student.progress / 100) * 25;
    const testScore = ((student.testScores?.SAT || 0) / 1600) * 25;
    const riskScore = student.risk_level === 'low' ? 25 : student.risk_level === 'medium' ? 15 : 5;
    return Math.round(gpaScore + progressScore + testScore + riskScore);
  };

  const aiScore = calculateAIScore();
  const engagementScore = Math.round((student.progress * 0.7) + (student.acceptanceLikelihood * 0.3));

  return (
    <div className="w-80 border-l bg-card overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* AI Insights Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered recommendations and analytics
          </p>
        </div>

        {/* AI Score Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-primary" />
              AI Student Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{aiScore}</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <Progress value={aiScore} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Based on academic performance, progress, and engagement metrics
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Engagement Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{engagementScore}%</div>
              <div className="text-sm text-muted-foreground">Engagement Level</div>
            </div>
            <Progress value={engagementScore} className="h-2" />
            <div className="text-xs text-muted-foreground">
              High engagement indicates strong commitment to the program
            </div>
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Document Review</div>
                  <div className="text-muted-foreground text-xs">
                    Review and approve submitted documents
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Send Follow-up</div>
                  <div className="text-muted-foreground text-xs">
                    Check on application progress
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Payment Reminder</div>
                  <div className="text-muted-foreground text-xs">
                    Follow up on pending fee payment
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Prediction */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4" />
              Success Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Acceptance Likelihood</span>
                <span className="font-medium text-green-600">{student.acceptanceLikelihood}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completion Probability</span>
                <span className="font-medium text-blue-600">92%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>On-time Graduation</span>
                <span className="font-medium text-purple-600">88%</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Key Success Factors:</p>
              <ul className="space-y-1">
                <li>• Strong academic background</li>
                <li>• Consistent communication</li>
                <li>• Timely document submission</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Student Analytics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Analytics Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">12</div>
                <div className="text-xs text-muted-foreground">Total Interactions</div>
              </div>
              <div>
                <div className="text-lg font-bold">3</div>
                <div className="text-xs text-muted-foreground">Days Since Contact</div>
              </div>
              <div>
                <div className="text-lg font-bold">95%</div>
                <div className="text-xs text-muted-foreground">Response Rate</div>
              </div>
              <div>
                <div className="text-lg font-bold">4.8</div>
                <div className="text-xs text-muted-foreground">Avg Response Time (h)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">Document uploaded</span>
                <span className="ml-auto text-xs">2h ago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">Email sent</span>
                <span className="ml-auto text-xs">1d ago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-muted-foreground">Status updated</span>
                <span className="ml-auto text-xs">2d ago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-muted-foreground">Call scheduled</span>
                <span className="ml-auto text-xs">3d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick AI Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">AI-Powered Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Brain className="h-4 w-4 mr-2" />
              Generate Email
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              Predict Next Step
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Risk Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}