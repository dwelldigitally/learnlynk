import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { RotateCcw, Phone, Mail, Star, ArrowRight, Eye, Maximize2 } from 'lucide-react';
import { LeadService } from '@/services/leadService';
import { supabase } from '@/integrations/supabase/client';
import { ReenquiryExpandedModal } from './ReenquiryExpandedModal';
import { formatDistanceToNow } from 'date-fns';
import type { Lead } from '@/types/lead';

interface ReenquiryStudent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  original_program: string;
  new_interest: string;
  last_activity: string;
  engagement_score: number;
  type: 'dormant_reactivation' | 'program_change' | 'alumni_referral' | 'upsell_opportunity' | 'reenquiry';
  days_since_last_contact: number;
  reenquiry_count: number;
  last_reenquiry_at?: string;
}

export function ReenquiryStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<ReenquiryStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExpandedModal, setShowExpandedModal] = useState(false);

  useEffect(() => {
    loadReenquiryStudents();
  }, []);

  const loadReenquiryStudents = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const { data: tenantUser } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single();

      const { data: leads, error } = await LeadService.getReenquiryStudents(
        user.id,
        tenantUser?.tenant_id
      );
      
      if (error) {
        console.error('Failed to load re-enquiry students:', error);
        return;
      }

      // Transform leads to ReenquiryStudent format
      const reenquiryData: ReenquiryStudent[] = (leads || []).slice(0, 10).map((lead: Lead) => {
        const tags = lead.tags || [];
        let type: ReenquiryStudent['type'] = 'reenquiry';
        
        if (tags.includes('reenquiry')) type = 'reenquiry';
        else if (tags.includes('upsell')) type = 'upsell_opportunity';
        else if (tags.includes('program_change')) type = 'program_change';
        else if (tags.includes('alumni_referral')) type = 'alumni_referral';
        else if (tags.includes('dormant') || tags.includes('reactivation')) type = 'dormant_reactivation';

        const lastContactDate = lead.last_contacted_at ? new Date(lead.last_contacted_at) : new Date(lead.created_at);
        const daysSinceContact = Math.floor((Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          id: lead.id,
          name: `${lead.first_name} ${lead.last_name}`,
          email: lead.email,
          phone: lead.phone || undefined,
          original_program: lead.program_interest?.[0] || 'Unknown',
          new_interest: lead.program_interest?.[1] || lead.program_interest?.[0] || 'Unknown',
          last_activity: lead.last_contacted_at || lead.updated_at,
          engagement_score: lead.lead_score || lead.ai_score || 0,
          type,
          days_since_last_contact: daysSinceContact,
          reenquiry_count: (lead as any).reenquiry_count || 1,
          last_reenquiry_at: (lead as any).last_reenquiry_at,
        };
      });
      
      setStudents(reenquiryData);
    } catch (error) {
      console.error('Failed to load re-enquiry students:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'upsell_opportunity': 
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'program_change': 
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'dormant_reactivation': 
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'alumni_referral': 
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'reenquiry':
        return 'bg-primary/10 text-primary border-primary/20';
      default: 
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'upsell_opportunity': return 'Upsell';
      case 'program_change': return 'Program Change';
      case 'dormant_reactivation': return 'Reactivation';
      case 'alumni_referral': return 'Alumni Referral';
      case 'reenquiry': return 'Re-enquiry';
      default: return 'Re-enquiry';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-muted rounded-lg h-20"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {students.length} re-enquiries
          </Badge>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowExpandedModal(true)}
            className="gap-1.5 text-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Expand
          </Button>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No re-enquiries at this time</p>
            <p className="text-xs text-muted-foreground mt-1">
              Leads who submit forms again will appear here
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Student</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Re-enquiries</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Last Re-enquiry</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Score</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/leads/detail/${student.id}`)}
                    >
                      {/* Student */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs whitespace-nowrap", getTypeBadgeStyle(student.type))}
                        >
                          {getTypeLabel(student.type)}
                        </Badge>
                      </td>

                      {/* Re-enquiry Count */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium">{student.reenquiry_count}x</span>
                      </td>

                      {/* Last Re-enquiry */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {student.last_reenquiry_at 
                            ? formatDistanceToNow(new Date(student.last_reenquiry_at), { addSuffix: true })
                            : `${student.days_since_last_contact}d ago`
                          }
                        </span>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className={cn("text-sm font-medium", getScoreColor(student.engagement_score))}>
                            {student.engagement_score}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {student.phone && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${student.phone}`, '_self');
                              }}
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`mailto:${student.email}`, '_blank');
                            }}
                            title="Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/leads/detail/${student.id}`);
                            }}
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ReenquiryExpandedModal 
        open={showExpandedModal} 
        onClose={() => setShowExpandedModal(false)} 
      />
    </>
  );
}
