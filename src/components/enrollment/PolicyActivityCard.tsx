import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PolicyConfigurationService } from '@/services/policyConfigurationService';

export function PolicyActivityCard() {
  const [activityData, setActivityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = async () => {
    try {
      const data = await PolicyConfigurationService.getDemoPolicyActivity();
      setActivityData(data);
    } catch (error) {
      console.error('Error loading policy activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !activityData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Policy Activity Overview */}
      <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              This Week's Policy Activity
            </CardTitle>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              Live Demo Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{activityData.totalBlocked}</div>
              <p className="text-sm text-muted-foreground">Messages Blocked</p>
              <p className="text-xs text-red-600 mt-1">Prevented spam complaints</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{activityData.queuedMessages}</div>
              <p className="text-sm text-muted-foreground">Messages Queued</p>
              <p className="text-xs text-yellow-600 mt-1">Waiting for business hours</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{activityData.complianceRate}%</div>
              <p className="text-sm text-muted-foreground">Compliance Rate</p>
              <p className="text-xs text-emerald-600 mt-1">Industry leading</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Policy Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Policy Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityData.recentActions.map((action: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    action.action.includes('blocked') ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{action.action}</p>
                    <p className="text-xs text-muted-foreground">{action.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {action.policy}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{action.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Policy Impact Insight */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-2">Policy Impact This Month</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Your policies have prevented an estimated <strong>2,340 spam complaints</strong> and improved 
                response rates by <strong>28%</strong> by ensuring messages are sent at optimal times.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  +28% Response Rate
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  -95% Complaints
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  +15% Conversion
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}