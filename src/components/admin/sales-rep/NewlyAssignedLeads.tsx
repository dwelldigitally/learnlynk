import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Phone, Mail, Eye, Star, Clock, User, Brain, Play, CheckSquare, Loader2, Zap } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { useLeadAIActions } from '@/hooks/useLeadAIActions';

export function NewlyAssignedLeads() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const {
    isGenerating,
    isExecuting,
    leadActions,
    generateActionsForLeads,
    executeAction,
    executeBulkActions,
  } = useLeadAIActions();

  useEffect(() => {
    loadNewlyAssignedLeads();
  }, []);

  useEffect(() => {
    if (leads.length > 0) {
      const leadIds = leads.map(lead => lead.id);
      generateActionsForLeads(leadIds);
    }
  }, [leads]);

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

  const handleLeadSelect = (leadId: string, checked: boolean) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(leadId);
      } else {
        newSet.delete(leadId);
      }
      setShowBulkActions(newSet.size > 0);
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(new Set(leads.slice(0, 3).map(lead => lead.id)));
      setShowBulkActions(true);
    } else {
      setSelectedLeads(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkExecute = async () => {
    if (selectedLeads.size === 0) return;
    
    await executeBulkActions(Array.from(selectedLeads));
    setSelectedLeads(new Set());
    setShowBulkActions(false);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'call': return <Phone className="w-3 h-3" />;
      case 'email': return <Mail className="w-3 h-3" />;
      case 'follow_up': return <Clock className="w-3 h-3" />;
      case 'document': return <Eye className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-700 bg-green-100 border-green-300';
    if (confidence >= 60) return 'text-amber-700 bg-amber-100 border-amber-300';
    return 'text-primary bg-primary/10 border-primary/30';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/30';
      case 'high': return 'text-warning bg-warning/10 border-warning/30';
      case 'medium': return 'text-primary bg-primary/10 border-primary/30';
      default: return 'text-muted-foreground bg-muted border-muted-foreground/30';
    }
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
          {isGenerating && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              AI analyzing...
            </div>
          )}
        </CardTitle>
        
        {showBulkActions && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedLeads.size} leads selected
              </span>
              <Button 
                size="sm" 
                onClick={handleBulkExecute}
                disabled={isExecuting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isExecuting ? (
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <Play className="w-3 h-3 mr-1" />
                )}
                Execute All Actions
              </Button>
            </div>
          </div>
        )}
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
            {/* Select All Header */}
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <Checkbox 
                checked={selectedLeads.size === leads.slice(0, 3).length && leads.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">AI Actions Available</span>
              <Badge variant="outline" className="ml-auto text-xs">
                Select for bulk execution
              </Badge>
            </div>

            {leads.slice(0, 3).map((lead) => {
              const aiAction = leadActions.get(lead.id);
              return (
                <div
                  key={lead.id}
                  className="relative p-3 rounded-lg bg-white border border-blue-100 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={selectedLeads.has(lead.id)}
                      onCheckedChange={(checked) => handleLeadSelect(lead.id, !!checked)}
                      className="mt-2"
                    />
                    
                    <Avatar className="w-10 h-10 mt-1">
                      <AvatarFallback className="text-sm bg-blue-100 text-blue-700">
                        {lead.first_name[0]}{lead.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p 
                          className="font-medium text-sm truncate cursor-pointer hover:text-blue-600"
                          onClick={() => navigate(`/admin/leads/detail/${lead.id}`)}
                        >
                          {lead.first_name} {lead.last_name}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getPriorityColor(lead.priority))}
                        >
                          {lead.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        {getSourceIcon(lead.source)}
                        <span>{lead.source.replace('_', ' ')}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(lead.assigned_at || lead.created_at)}</span>
                        <span>•</span>
                        <Star className="w-3 h-3 text-orange-500" />
                        <span className="font-medium">{lead.lead_score}/100</span>
                      </div>

                      {/* AI Action Section */}
                      {aiAction ? (
                        <div className="mt-2 p-3 bg-accent/50 rounded-lg border border-accent/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium text-primary">AI Next Best Action</span>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs border", getConfidenceColor(aiAction.confidence))}
                            >
                              {aiAction.confidence}% confidence
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs border", getUrgencyColor(aiAction.urgency))}
                            >
                              {aiAction.urgency} priority
                            </Badge>
                          </div>
                          <p className="text-xs text-foreground/80 mb-3 leading-relaxed">{aiAction.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <Button 
                              size="sm" 
                              className="h-7 text-xs px-3 bg-primary hover:bg-primary/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                executeAction(lead.id, aiAction);
                              }}
                              disabled={isExecuting}
                            >
                              {isExecuting ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                getActionIcon(aiAction.actionType)
                              )}
                              <span className="ml-1">Execute Action</span>
                            </Button>
                            <span className="text-xs text-muted-foreground font-medium">
                              Est. Impact: {aiAction.estimatedImpact}%
                            </span>
                          </div>
                        </div>
                      ) : isGenerating ? (
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-muted">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-xs text-muted-foreground">AI analyzing lead for next best action...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-muted/50">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">No AI action available</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                        <Mail className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
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