import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Phone, Mail, Eye, Star, Clock, User } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';

export function NewlyAssignedLeads() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewlyAssignedLeads();
  }, []);

  const loadNewlyAssignedLeads = async () => {
    try {
      // Enhanced mock data for newly assigned leads
      const mockLeads: Lead[] = [
        {
          id: 'lead-1',
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          country: 'United States',
          state: 'California',
          city: 'San Francisco',
          source: 'web',
          source_details: 'MBA Program Landing Page',
          status: 'new',
          stage: 'NEW_INQUIRY',
          priority: 'high',
          lead_score: 87,
          ai_score: 92,
          program_interest: ['MBA', 'Executive MBA'],
          assigned_to: 'current-user',
          assigned_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          assignment_method: 'ai_based',
          tags: ['high-intent', 'quick-decision'],
          notes: 'Expressed urgent interest in MBA program. Looking to start ASAP.',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'lead-2',
          first_name: 'Michael',
          last_name: 'Chen',
          email: 'michael.chen@email.com',
          phone: '+1 (555) 234-5678',
          country: 'Canada',
          state: 'Ontario',
          city: 'Toronto',
          source: 'referral',
          source_details: 'Alumni referral from John Smith',
          status: 'new',
          stage: 'NEW_INQUIRY',
          priority: 'medium',
          lead_score: 72,
          ai_score: 78,
          program_interest: ['Business Analytics', 'Data Science Certificate'],
          assigned_to: 'current-user',
          assigned_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          assignment_method: 'round_robin',
          tags: ['referral', 'alumni-connection'],
          notes: 'Referred by alumnus. Interested in data science programs.',
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'lead-3',
          first_name: 'Emily',
          last_name: 'Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1 (555) 345-6789',
          country: 'United States',
          state: 'Texas',
          city: 'Austin',
          source: 'social_media',
          source_details: 'LinkedIn ad campaign',
          status: 'new',
          stage: 'NEW_INQUIRY',
          priority: 'urgent',
          lead_score: 65,
          ai_score: 85,
          program_interest: ['Digital Marketing', 'Marketing Certificate'],
          assigned_to: 'current-user',
          assigned_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          assignment_method: 'manual',
          tags: ['linkedin', 'marketing-focus'],
          notes: 'High engagement on social media. Quick to respond.',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'lead-4',
          first_name: 'David',
          last_name: 'Kim',
          email: 'david.kim@email.com',
          phone: '+1 (555) 456-7890',
          country: 'United States',
          state: 'Washington',
          city: 'Seattle',
          source: 'email',
          source_details: 'Newsletter signup',
          status: 'new',
          stage: 'NEW_INQUIRY',
          priority: 'medium',
          lead_score: 58,
          ai_score: 71,
          program_interest: ['Project Management', 'Agile Certification'],
          assigned_to: 'current-user',
          assigned_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          assignment_method: 'geography',
          tags: ['newsletter', 'project-management'],
          notes: 'Subscribed to newsletter. Interested in PM certification.',
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'lead-5',
          first_name: 'Jennifer',
          last_name: 'Wilson',
          email: 'jennifer.wilson@email.com',
          phone: '+1 (555) 567-8901',
          country: 'United States',
          state: 'Florida',
          city: 'Miami',
          source: 'event',
          source_details: 'Virtual Information Session',
          status: 'new',
          stage: 'NEW_INQUIRY',
          priority: 'high',
          lead_score: 81,
          ai_score: 88,
          program_interest: ['Finance MBA', 'Investment Management'],
          assigned_to: 'current-user',
          assigned_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          assignment_method: 'ai_based',
          tags: ['info-session', 'finance-focus', 'high-engagement'],
          notes: 'Attended full info session. Asked detailed questions about finance track.',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setLeads(mockLeads);
    } catch (error) {
      console.error('Failed to load newly assigned leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getSourceIcon = (source: string) => {
    // Return appropriate icon based on source
    return <User className="w-3 h-3" />;
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            Newly Assigned Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-16"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="p-1.5 bg-blue-500 rounded-lg">
            <User className="w-4 h-4 text-white" />
          </div>
          Newly Assigned Leads
          <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 border-blue-300">
            {leads.length} new
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3">
              <User className="w-6 h-6 text-blue-500 mx-auto mt-1.5" />
            </div>
            <p className="text-sm">No new assignments</p>
            <p className="text-xs text-muted-foreground mt-1">Check back soon for new leads</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 3).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-blue-100 hover:bg-blue-50/50 transition-colors cursor-pointer shadow-sm"
                onClick={() => navigate(`/admin/leads/detail/${lead.id}`)}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-sm bg-blue-100 text-blue-700">
                    {lead.first_name[0]}{lead.last_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getPriorityColor(lead.priority))}
                    >
                      {lead.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {getSourceIcon(lead.source)}
                    <span>{lead.source.replace('_', ' ')}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(lead.assigned_at || lead.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-orange-500" />
                    <span className="text-xs font-medium">{lead.lead_score}/100</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                    <Phone className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                    <Mail className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {leads.length > 3 && (
              <Button variant="ghost" size="sm" className="w-full mt-2">
                View all {leads.length} assigned leads
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}