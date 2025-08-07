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
      // Get leads with high activity in the past week
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const filters = {
        lead_score_range: { min: 70, max: 100 },
        date_range: { start: oneWeekAgo, end: new Date() }
      };
      
      const response = await LeadService.getLeads(filters, 1, 10);
      
      // Mock enhancement with activity data
      const hotLeadsData: HotLead[] = response.leads.map(lead => ({
        ...lead,
        activity_score: Math.floor(Math.random() * 40) + 60, // 60-100
        recent_activities: [
          { type: 'email_open', count: Math.floor(Math.random() * 5) + 1, last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() },
          { type: 'website_visit', count: Math.floor(Math.random() * 3) + 1, last_activity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() },
          { type: 'form_submission', count: Math.floor(Math.random() * 2), last_activity: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString() }
        ].filter(activity => activity.count > 0),
        engagement_indicators: [
          'Multiple email opens',
          'Recent website visits',
          'Downloaded brochure',
          'Viewed pricing page'
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      }));
      
      // Sort by activity score and take top leads
      const sortedHotLeads = hotLeadsData
        .sort((a, b) => b.activity_score - a.activity_score)
        .slice(0, 5);
      
      setHotLeads(sortedHotLeads);
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

                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md">
                      <Phone className="w-3 h-3 mr-1" />
                      Call Now
                    </Button>
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