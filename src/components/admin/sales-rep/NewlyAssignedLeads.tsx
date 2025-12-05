import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Phone, Mail, Star, Clock, User, MapPin, GraduationCap, ChevronRight, Globe, Users, Briefcase } from 'lucide-react';
export function NewlyAssignedLeads() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNewlyAssignedLeads();
    }
  }, [user]);

  const loadNewlyAssignedLeads = async () => {
    if (!user) return;

    try {
      // Get leads assigned to current user in the last 48 hours with status 'new'
      const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('assigned_to', user.id)
        .eq('status', 'new')
        .gte('assigned_at', fortyEightHoursAgo)
        .order('assigned_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching newly assigned leads:', error);
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Failed to load newly assigned leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-[hsl(24,95%,92%)] text-[hsl(24,95%,40%)]';
      case 'high':
        return 'bg-[hsl(24,95%,92%)] text-[hsl(24,95%,40%)]';
      case 'medium':
        return 'bg-[hsl(245,90%,94%)] text-primary';
      default:
        return 'bg-muted text-muted-foreground';
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
    if (score >= 80) return 'text-[hsl(158,64%,40%)]';
    if (score >= 60) return 'text-[hsl(32,85%,50%)]';
    return 'text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-muted rounded-2xl h-28"></div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-[hsl(245,90%,94%)] rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <p className="font-semibold text-foreground">No new assignments</p>
        <p className="text-sm text-muted-foreground mt-1">Check back soon for new leads</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.slice(0, 4).map((lead) => (
        <div
          key={lead.id}
          className="group relative rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer overflow-hidden"
          onClick={() => navigate(`/admin/leads/detail/${lead.id}`)}
        >
          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <Avatar className="w-12 h-12 ring-2 ring-background shadow-sm">
                <AvatarFallback className="text-sm font-semibold bg-[hsl(245,90%,94%)] text-primary">
                  {lead.first_name?.[0]}{lead.last_name?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {lead.first_name} {lead.last_name}
                    </h4>
                    <Badge 
                      className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium capitalize border-0 shrink-0", getPriorityStyles(lead.priority || 'medium'))}
                    >
                      {lead.priority || 'medium'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{formatTimeAgo(lead.assigned_at || lead.created_at)}</span>
                  </div>
                </div>

                {/* Info row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1.5">
                    {getSourceIcon(lead.source || 'web')}
                    <span className="capitalize">{(lead.source || 'web').replace('_', ' ')}</span>
                  </span>
                  {(lead.city || lead.country) && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{[lead.city, lead.country].filter(Boolean).join(', ')}</span>
                    </span>
                  )}
                  {lead.lead_score && (
                    <span className="flex items-center gap-1.5">
                      <Star className={cn("w-3.5 h-3.5", getScoreColor(lead.lead_score))} />
                      <span className={cn("font-semibold", getScoreColor(lead.lead_score))}>{lead.lead_score}</span>
                    </span>
                  )}
                </div>

                {/* Program interest */}
                {lead.program_interest && lead.program_interest.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <div className="flex flex-wrap gap-1.5">
                      {lead.program_interest.slice(0, 2).map((program, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs px-2.5 py-1 rounded-full bg-[hsl(245,90%,94%)] text-primary font-medium"
                        >
                          {program}
                        </span>
                      ))}
                      {lead.program_interest.length > 2 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
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
                    className="h-8 px-3 text-xs gap-1.5 rounded-full border-border hover:bg-[hsl(158,64%,90%)] hover:text-[hsl(158,64%,35%)] hover:border-[hsl(158,64%,80%)]"
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
                    className="h-8 px-3 text-xs gap-1.5 rounded-full border-border hover:bg-[hsl(200,80%,92%)] hover:text-[hsl(200,80%,35%)] hover:border-[hsl(200,80%,80%)]"
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
                    className="h-8 px-3 text-xs gap-1 ml-auto text-muted-foreground hover:text-primary hover:bg-[hsl(245,90%,94%)] rounded-full"
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
          className="w-full mt-2 text-muted-foreground hover:text-primary hover:bg-[hsl(245,90%,94%)] hover:border-primary/30 rounded-full"
          onClick={() => navigate('/admin/leads')}
        >
          View all {leads.length} assigned leads
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}
