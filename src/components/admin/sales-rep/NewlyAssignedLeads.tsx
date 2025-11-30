import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Phone, Mail, Star, Clock, User, MapPin, GraduationCap, ChevronRight, Globe, Users, Briefcase } from 'lucide-react';
import { Lead } from '@/types/lead';

export function NewlyAssignedLeads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewlyAssignedLeads();
  }, []);

  const loadNewlyAssignedLeads = async () => {
    try {
      const mockLeads: Lead[] = [{
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
        notes: 'Expressed urgent interest in MBA program.',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }, {
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
      }, {
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
      }, {
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
      }, {
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
      }];
      setLeads(mockLeads);
    } catch (error) {
      console.error('Failed to load newly assigned leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'web':
        return <Globe className="w-3.5 h-3.5" />;
      case 'referral':
        return <Users className="w-3.5 h-3.5" />;
      case 'social_media':
        return <User className="w-3.5 h-3.5" />;
      case 'event':
        return <Briefcase className="w-3.5 h-3.5" />;
      default:
        return <Mail className="w-3.5 h-3.5" />;
    }
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-muted/50 rounded-xl h-24"></div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <p className="font-medium text-foreground">No new assignments</p>
        <p className="text-sm text-muted-foreground mt-1">Check back soon for new leads</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.slice(0, 4).map((lead) => (
        <div
          key={lead.id}
          className="group relative rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
          onClick={() => navigate(`/admin/leads/detail/${lead.id}`)}
        >
          {/* Priority indicator strip */}
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-1",
            lead.priority === 'urgent' && "bg-destructive",
            lead.priority === 'high' && "bg-orange-500",
            lead.priority === 'medium' && "bg-primary",
            lead.priority === 'low' && "bg-muted-foreground"
          )} />

          <div className="p-4 pl-5">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <Avatar className="w-12 h-12 ring-2 ring-background shadow-sm">
                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                  {lead.first_name[0]}{lead.last_name[0]}
                </AvatarFallback>
              </Avatar>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {lead.first_name} {lead.last_name}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px] px-1.5 py-0 h-5 font-medium capitalize shrink-0", getPriorityStyles(lead.priority))}
                    >
                      {lead.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{formatTimeAgo(lead.assigned_at || lead.created_at)}</span>
                  </div>
                </div>

                {/* Info row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2.5">
                  <span className="flex items-center gap-1.5">
                    {getSourceIcon(lead.source)}
                    <span className="capitalize">{lead.source.replace('_', ' ')}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{lead.city}, {lead.country}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className={cn("w-3.5 h-3.5", getScoreColor(lead.lead_score || 0))} />
                    <span className={cn("font-semibold", getScoreColor(lead.lead_score || 0))}>{lead.lead_score}</span>
                  </span>
                </div>

                {/* Program interest */}
                {lead.program_interest && lead.program_interest.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {lead.program_interest.slice(0, 2).map((program, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/5 text-primary/80 font-medium"
                        >
                          {program}
                        </span>
                      ))}
                      {lead.program_interest.length > 2 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          +{lead.program_interest.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 text-xs gap-1.5 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${lead.phone}`, '_blank');
                    }}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 text-xs gap-1.5 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`mailto:${lead.email}`, '_blank');
                    }}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 text-xs gap-1 ml-auto text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/leads/detail/${lead.id}`);
                    }}
                  >
                    View
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {leads.length > 4 && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-1 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/admin/leads')}
        >
          View all {leads.length} assigned leads
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}
