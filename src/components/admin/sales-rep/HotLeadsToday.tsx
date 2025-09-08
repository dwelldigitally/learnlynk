import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Flame, Phone, Mail, Eye, TrendingUp, Activity, MousePointer, Clock } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';

interface HotLead extends Lead {
  activity_score: number;
  recent_activities: {
    type: string;
    count: number;
    last_activity: string;
  }[];
  engagement_indicators: string[];
}

export function HotLeadsToday() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [hotLeads, setHotLeads] = useState<HotLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotLeads();
  }, []);

  const loadHotLeads = async () => {
    try {
      // Enhanced mock hot leads with more realistic activity data
      const mockHotLeads: HotLead[] = [
        {
          id: 'hot-1',
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          country: 'United States',
          state: 'California',
          city: 'San Francisco',
          source: 'web',
          source_details: 'MBA Program Landing Page',
          status: 'qualified',
          stage: 'QUALIFICATION',
          priority: 'urgent',
          lead_score: 93,
          ai_score: 96,
          program_interest: ['MBA', 'Executive MBA'],
          assigned_to: 'current-user',
          tags: ['hot-lead', 'high-intent'],
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          activity_score: 95,
          recent_activities: [
            { type: 'email_open', count: 8, last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { type: 'website_visit', count: 12, last_activity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
            { type: 'form_submission', count: 2, last_activity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
          ],
          engagement_indicators: ['Multiple email opens today', 'Visited pricing page 3x', 'Downloaded brochure', 'Clicked application link']
        },
        {
          id: 'hot-2',
          first_name: 'Michael',
          last_name: 'Chen',
          email: 'michael.chen@email.com',
          phone: '+1 (555) 234-5678',
          country: 'Canada',
          state: 'Ontario',
          city: 'Toronto',
          source: 'referral',
          status: 'nurturing',
          stage: 'NURTURING',
          priority: 'high',
          lead_score: 87,
          ai_score: 91,
          program_interest: ['Business Analytics', 'Data Science Certificate'],
          assigned_to: 'current-user',
          tags: ['referral', 'data-science'],
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          activity_score: 88,
          recent_activities: [
            { type: 'email_open', count: 5, last_activity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
            { type: 'website_visit', count: 7, last_activity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
            { type: 'form_submission', count: 1, last_activity: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() }
          ],
          engagement_indicators: ['Frequent email engagement', 'Career outcomes page views', 'Salary calculator usage']
        },
        {
          id: 'hot-3',
          first_name: 'Emily',
          last_name: 'Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1 (555) 345-6789',
          country: 'United States',
          state: 'Texas',
          city: 'Austin',
          source: 'social_media',
          status: 'contacted',
          stage: 'QUALIFICATION',
          priority: 'high',
          lead_score: 84,
          ai_score: 89,
          program_interest: ['Digital Marketing', 'Marketing Certificate'],
          assigned_to: 'current-user',
          tags: ['linkedin', 'marketing'],
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          activity_score: 82,
          recent_activities: [
            { type: 'email_open', count: 6, last_activity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
            { type: 'website_visit', count: 9, last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { type: 'form_submission', count: 1, last_activity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() }
          ],
          engagement_indicators: ['Social media engagement', 'Marketing curriculum views', 'Case study downloads']
        },
        {
          id: 'hot-4',
          first_name: 'David',
          last_name: 'Kim',
          email: 'david.kim@email.com',
          phone: '+1 (555) 456-7890',
          country: 'United States',
          state: 'Washington',
          city: 'Seattle',
          source: 'email',
          status: 'qualified',
          stage: 'PROPOSAL_SENT',
          priority: 'urgent',
          lead_score: 91,
          ai_score: 94,
          program_interest: ['Executive MBA'],
          assigned_to: 'current-user',
          tags: ['executive', 'proposal-sent'],
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          activity_score: 91,
          recent_activities: [
            { type: 'email_open', count: 4, last_activity: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
            { type: 'website_visit', count: 5, last_activity: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
            { type: 'form_submission', count: 0, last_activity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
          ],
          engagement_indicators: ['Proposal opened multiple times', 'Leadership track interest', 'Schedule request pending']
        },
        {
          id: 'hot-5',
          first_name: 'Jennifer',
          last_name: 'Wilson',
          email: 'jennifer.wilson@email.com',
          phone: '+1 (555) 567-8901',
          country: 'United States',
          state: 'Florida',
          city: 'Miami',
          source: 'event',
          status: 'nurturing',
          stage: 'NURTURING',
          priority: 'high',
          lead_score: 79,
          ai_score: 86,
          program_interest: ['Finance MBA', 'Investment Management'],
          assigned_to: 'current-user',
          tags: ['event-attendee', 'finance'],
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          activity_score: 85,
          recent_activities: [
            { type: 'email_open', count: 7, last_activity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
            { type: 'website_visit', count: 6, last_activity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
            { type: 'form_submission', count: 1, last_activity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
          ],
          engagement_indicators: ['Finance specialization interest', 'Alumni network questions', 'ROI calculator usage']
        }
      ];
      
      setHotLeads(mockHotLeads.sort((a, b) => b.activity_score - a.activity_score));
    } catch (error) {
      console.error('Failed to load hot leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email_open': return <Mail className="w-3 h-3" />;
      case 'website_visit': return <Eye className="w-3 h-3" />;
      case 'form_submission': return <MousePointer className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'email_open': return 'Email Opens';
      case 'website_visit': return 'Site Visits';
      case 'form_submission': return 'Form Fills';
      default: return 'Activity';
    }
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getHeatLevel = (score: number) => {
    if (score >= 90) return { level: 'burning', color: 'text-red-500', bgColor: 'bg-red-500' };
    if (score >= 80) return { level: 'hot', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    if (score >= 70) return { level: 'warm', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    return { level: 'cool', color: 'text-blue-500', bgColor: 'bg-blue-500' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="w-4 h-4" />
            HOT Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-24"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Flame className="w-4 h-4 text-white" />
          </div>
          HOT Today
          <Badge variant="destructive" className="ml-auto bg-red-100 text-red-700 border-red-300">
            {hotLeads.length} 🔥
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hotLeads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="p-3 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-3">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mt-1.5" />
            </div>
            <p className="text-sm">No hot leads today</p>
            <p className="text-xs text-muted-foreground mt-1">Keep nurturing your pipeline</p>
          </div>
        ) : (
          <div className="space-y-3">
            {hotLeads.slice(0, 3).map((lead) => {
              const heatLevel = getHeatLevel(lead.activity_score);
              
              return (
                <div
                  key={lead.id}
                  className="p-3 rounded-lg bg-white border border-orange-100 hover:bg-orange-50/50 transition-colors cursor-pointer shadow-sm"
                  onClick={() => navigate(`/admin/leads/detail/${lead.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="text-sm bg-orange-100 text-orange-700">
                        {lead.first_name[0]}{lead.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <div className="flex items-center gap-1">
                          <div className={cn("w-2 h-2 rounded-full animate-pulse", heatLevel.bgColor)}></div>
                          <span className={cn("text-xs font-bold", heatLevel.color)}>
                            {lead.activity_score}°
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {lead.recent_activities.slice(0, 2).map((activity, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs bg-orange-100 rounded px-1.5 py-0.5">
                            {getActivityIcon(activity.type)}
                            <span>{activity.count}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{lead.engagement_indicators[0] || 'High engagement'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button size="sm" className="h-7 px-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs border-orange-200 text-orange-700 hover:bg-orange-50">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        AI Play
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {hotLeads.length > 3 && (
              <Button variant="ghost" size="sm" className="w-full mt-2 text-orange-600 hover:bg-orange-100">
                View all {hotLeads.length} hot leads
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}