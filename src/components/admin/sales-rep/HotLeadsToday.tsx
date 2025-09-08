import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Flame, Phone, Mail, Eye, TrendingUp, Activity, MousePointer, Clock, Zap, CheckCircle2, Timer } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { toast } from 'sonner';

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
      // Enhanced mock hot leads with more realistic activity data
      const mockHotLeads: HotLead[] = [
        {
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
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
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
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
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
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
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d482',
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
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d483',
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
                  className="group relative p-4 rounded-xl bg-gradient-to-r from-white to-orange-50/30 border border-orange-200/60 hover:border-orange-300 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/admin/leads/detail/${lead.id}`)}
                >
                  {/* Heat indicator stripe */}
                  <div className={cn("absolute left-0 top-0 w-1 h-full", heatLevel.bgColor)}></div>
                  
                  <div className="flex items-start gap-4">
                    {/* Avatar Section */}
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-orange-100 ring-offset-2">
                        <AvatarFallback className="text-sm bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800 font-semibold">
                          {lead.first_name[0]}{lead.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {/* Heat level indicator */}
                      <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-white rounded-full px-2 py-0.5 shadow-md border border-orange-200">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", heatLevel.bgColor)}></div>
                        <span className={cn("text-xs font-bold", heatLevel.color)}>
                          {lead.activity_score}°
                        </span>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with name and status */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base group-hover:text-orange-700 transition-colors">
                            {lead.first_name} {lead.last_name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-0.5">{lead.email}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="bg-orange-50 text-orange-700 border-orange-200 text-xs font-medium px-2 py-1"
                        >
                          {lead.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {/* Activity indicators */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {lead.recent_activities.slice(0, 3).map((activity, index) => (
                          <div key={index} className="flex items-center gap-1.5 text-xs bg-white rounded-lg px-2.5 py-1.5 border border-orange-100 shadow-sm">
                            <div className="text-orange-600">
                              {getActivityIcon(activity.type)}
                            </div>
                            <span className="font-medium text-gray-700">{activity.count}</span>
                            <span className="text-gray-500">{getActivityLabel(activity.type)}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Engagement insight */}
                      <div className="flex items-start gap-2 p-2.5 bg-orange-50/50 rounded-lg border border-orange-100/50">
                        <TrendingUp className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-orange-800">Latest Insight</p>
                          <p className="text-xs text-orange-700 mt-0.5 leading-relaxed">
                            {lead.engagement_indicators[0] || 'High engagement detected'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-2">
                      <Button 
                        size="sm" 
                        className="h-8 px-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md hover:shadow-lg transition-all group/btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                        Call
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-3 text-xs border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-3 h-3 mr-1.5" />
                        Email
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-3 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAIPlayEnrollment(lead);
                        }}
                      >
                        <TrendingUp className="w-3 h-3 mr-1.5" />
                        AI Play
                      </Button>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none"></div>
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