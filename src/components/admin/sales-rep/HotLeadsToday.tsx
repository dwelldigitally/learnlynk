import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Flame, Phone, Mail, Eye, TrendingUp, Activity, MousePointer, Clock, Zap, CheckCircle2, Timer, Sparkles } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [selectedLead, setSelectedLead] = useState<HotLead | null>(null);
  const [showPlaybookDialog, setShowPlaybookDialog] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    loadHotLeads();
  }, []);

  const loadHotLeads = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in to view hot leads');
        return;
      }

      const { data: leads, error } = await LeadService.getHotLeads(user.id);
      
      if (error) {
        console.error('Failed to load hot leads:', error);
        toast.error('Failed to load hot leads');
        return;
      }

      // Transform leads to HotLead format
      const hotLeadsData: HotLead[] = (leads || []).map(lead => ({
        ...lead,
        activity_score: lead.lead_score || 0,
        recent_activities: [],
        engagement_indicators: []
      }));
      
      setHotLeads(hotLeadsData);
    } catch (error) {
      console.error('Failed to load hot leads:', error);
      toast.error('Failed to load hot leads');
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

  const handleAIPlayEnrollment = (lead: HotLead) => {
    console.log('AI Play button clicked for lead:', lead.first_name, lead.last_name);
    console.log('Setting selectedLead:', lead);
    console.log('Setting showPlaybookDialog to true');
    setSelectedLead(lead);
    setShowPlaybookDialog(true);
  };

  const confirmEnrollment = async () => {
    if (!selectedLead) return;
    
    setIsEnrolling(true);
    try {
      toast.success(`Enrolling ${selectedLead.first_name} ${selectedLead.last_name} in AI playbook...`);
      
      // Simulate enrollment API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${selectedLead.first_name} ${selectedLead.last_name} successfully enrolled!`);
      setShowPlaybookDialog(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Failed to enroll in AI playbook:', error);
      toast.error('Failed to enroll in AI playbook');
    } finally {
      setIsEnrolling(false);
    }
  };

  const getAISuggestedPlaybook = (lead: HotLead) => {
    // AI logic to suggest playbook based on lead data
    const basePlaybook = {
      id: 'hot-lead-nurture',
      name: 'Hot Lead Nurture Sequence',
      description: 'AI-optimized sequence for high-intent leads',
      confidence: 94,
      steps: [
        { type: 'email', title: 'Welcome & Value Proposition', delay: '0 hours', description: 'Personalized welcome with program benefits' },
        { type: 'call', title: 'Discovery Call', delay: '2 hours', description: 'Personal consultation to understand goals' },
        { type: 'email', title: 'Program Details & Next Steps', delay: '1 day', description: 'Detailed curriculum and enrollment process' },
        { type: 'sms', title: 'Application Reminder', delay: '3 days', description: 'Gentle reminder about application deadline' },
        { type: 'call', title: 'Final Enrollment Call', delay: '5 days', description: 'Address final questions and close enrollment' }
      ]
    };

    return basePlaybook;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-muted rounded-lg h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-md ml-auto">
          {hotLeads.length} 🔥
        </Badge>
      </div>
      
      <div className="space-y-4">
        {hotLeads.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mx-auto flex items-center justify-center shadow-lg">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-md transform translate-x-6">
                <span className="text-white text-xs font-bold">0</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hot leads today</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              Keep nurturing your pipeline. Hot leads will appear here when high engagement is detected.
            </p>
          </div>
        ) : (
          <>
            {hotLeads.slice(0, 3).map((lead) => {
              const heatLevel = getHeatLevel(lead.activity_score);
              
              return (
                <div
                  key={lead.id}
                  className="group relative p-3 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => navigate(`/admin/leads/detail/${lead.id}`)}
                >
                  {/* Heat indicator stripe */}
                  <div className={cn(
                    "absolute left-0 top-0 w-1 h-full rounded-l-lg",
                    lead.activity_score >= 90 ? "bg-destructive" : 
                    lead.activity_score >= 80 ? "bg-orange-500" : "bg-yellow-500"
                  )}></div>
                  
                  <div className="flex items-center gap-3">
                    {/* Avatar with heat indicator */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-10 h-10 border-2 border-border">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {lead.first_name[0]}{lead.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 flex items-center gap-0.5 bg-background rounded-full px-1 py-0.5 shadow-sm border border-border">
                        <Flame className={cn(
                          "w-2.5 h-2.5",
                          lead.activity_score >= 90 ? "text-destructive" : 
                          lead.activity_score >= 80 ? "text-orange-500" : "text-yellow-500"
                        )} />
                        <span className="text-[10px] font-bold text-foreground">
                          {lead.activity_score}
                        </span>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Name and Priority */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {lead.first_name} {lead.last_name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs flex-shrink-0",
                            lead.priority === 'urgent' && "bg-destructive/10 text-destructive border-destructive/20"
                          )}
                        >
                          {lead.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {/* Activity indicators */}
                      <div className="flex flex-wrap gap-1.5">
                        {lead.recent_activities.slice(0, 3).map((activity, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs bg-muted/50 rounded px-1.5 py-0.5">
                            <div className="text-primary">
                              {getActivityIcon(activity.type)}
                            </div>
                            <span className="font-semibold text-foreground">{activity.count}</span>
                            <span className="text-muted-foreground text-[10px]">{getActivityLabel(activity.type)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons - Horizontal */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="default"
                        className="h-8 px-2.5 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 px-2.5 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="h-8 px-2.5 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAIPlayEnrollment(lead);
                        }}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        AI
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {hotLeads.length > 3 && (
              <div className="pt-4 border-t border-orange-100">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full h-10 text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 font-medium"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View all {hotLeads.length} hot leads
                  <TrendingUp className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* AI Playbook Confirmation Dialog */}
      <Dialog open={showPlaybookDialog} onOpenChange={(open) => {
        console.log('Dialog onOpenChange called with:', open);
        setShowPlaybookDialog(open);
      }}>
        <DialogContent className="max-w-lg z-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              AI-Suggested Playbook
            </DialogTitle>
            <DialogDescription>
              AI has analyzed {selectedLead?.first_name} {selectedLead?.last_name}'s engagement and suggests the following playbook.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-900">
                    {getAISuggestedPlaybook(selectedLead).name}
                  </h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {getAISuggestedPlaybook(selectedLead).confidence}% Match
                  </Badge>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  {getAISuggestedPlaybook(selectedLead).description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900 text-sm">Playbook Steps:</h4>
                  {getAISuggestedPlaybook(selectedLead).steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 bg-white rounded border border-blue-100">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {step.type === 'email' && <Mail className="w-3 h-3 text-orange-500" />}
                          {step.type === 'call' && <Phone className="w-3 h-3 text-green-500" />}
                          {step.type === 'sms' && <MousePointer className="w-3 h-3 text-blue-500" />}
                          <span className="font-medium text-sm">{step.title}</span>
                          <Badge variant="outline" className="text-xs">
                            <Timer className="w-2 h-2 mr-1" />
                            {step.delay}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlaybookDialog(false)} disabled={isEnrolling}>
              Cancel
            </Button>
            <Button onClick={confirmEnrollment} disabled={isEnrolling} className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}