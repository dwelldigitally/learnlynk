import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, TrendingUp, Clock, Target, 
  ArrowRight, Star, Zap, Users, 
  Calendar, MessageSquare, FileText
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { SmartAdvisorMatch } from './SmartAdvisorMatch';

interface LeadRightSidebarProps {
  lead: Lead;
}

export function LeadRightSidebar({ lead }: LeadRightSidebarProps) {
  const aiScore = lead.ai_score || 0;
  const engagementScore = Math.round((lead.lead_score / 100) * 85);
  
  return (
    <div className="w-72 bg-card border-l border-border h-full flex flex-col space-y-4 p-4">
      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">AI Score</span>
              <span className="text-lg font-bold text-primary">{aiScore.toFixed(1)}</span>
            </div>
            <Progress value={aiScore * 10} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {aiScore >= 8 ? 'High conversion potential' : 
               aiScore >= 6 ? 'Good potential' : 
               aiScore >= 4 ? 'Moderate potential' : 'Needs nurturing'}
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Engagement</span>
              <span className="text-sm font-semibold">{engagementScore}%</span>
            </div>
            <Progress value={engagementScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-500" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {lead.phone && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start h-auto p-3"
                onClick={() => window.open(`tel:${lead.phone}`)}
              >
                <div className="flex items-center gap-2 w-full">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">Call lead</div>
                    <div className="text-xs text-muted-foreground">{lead.phone}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            )}
            
            <Button variant="outline" size="sm" className="w-full justify-start h-auto p-3">
              <div className="flex items-center gap-2 w-full">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">Send follow-up email</div>
                  <div className="text-xs text-muted-foreground">Best time: 2-4 PM</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start h-auto p-3">
              <div className="flex items-center gap-2 w-full">
                <Calendar className="h-4 w-4 text-green-500" />
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">Schedule consultation</div>
                  <div className="text-xs text-muted-foreground">High interest detected</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>

            <Button variant="outline" size="sm" className="w-full justify-start h-auto p-3">
              <div className="flex items-center gap-2 w-full">
                <FileText className="h-4 w-4 text-purple-500" />
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">Send program info</div>
                  <div className="text-xs text-muted-foreground">Match: 94%</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Program Match */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Program Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lead.program_interest?.map((program, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex-1">
                <div className="text-sm font-medium">{program}</div>
                <div className="text-xs text-muted-foreground">Perfect match</div>
              </div>
              <Badge variant="secondary" className="text-xs">94%</Badge>
            </div>
          )) || (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="text-sm font-medium">MBA Program</div>
                  <div className="text-xs text-muted-foreground">Good match</div>
                </div>
                <Badge variant="secondary" className="text-xs">87%</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="text-sm font-medium">Executive Education</div>
                  <div className="text-xs text-muted-foreground">Strong match</div>
                </div>
                <Badge variant="secondary" className="text-xs">82%</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Advisor Match */}
      <SmartAdvisorMatch lead={lead} />


      {/* Lead Analytics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">3</div>
              <div className="text-xs text-muted-foreground">Interactions</div>
            </div>
            <div>
              <div className="text-lg font-bold">2</div>
              <div className="text-xs text-muted-foreground">Days since contact</div>
            </div>
            <div>
              <div className="text-lg font-bold">85%</div>
              <div className="text-xs text-muted-foreground">Response rate</div>
            </div>
            <div>
              <div className="text-lg font-bold">12m</div>
              <div className="text-xs text-muted-foreground">Avg response</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">2h ago</span>
              <span>Opened email</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">1d ago</span>
              <span>Visited website</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">3d ago</span>
              <span>Downloaded brochure</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}