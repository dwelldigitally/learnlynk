import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { RotateCcw, Phone, Mail, Star, ArrowRight, Eye } from 'lucide-react';
import { LeadService } from '@/services/leadService';
import { supabase } from '@/integrations/supabase/client';

interface ReenquiryStudent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  original_program: string;
  new_interest: string;
  last_activity: string;
  engagement_score: number;
  type: 'dormant_reactivation' | 'program_change' | 'alumni_referral' | 'upsell_opportunity';
  days_since_last_contact: number;
}

export function ReenquiryStudents() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [students, setStudents] = useState<ReenquiryStudent[]>([]);
  const [loading, setLoading] = useState(true);

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

      const { data: leads, error } = await LeadService.getReenquiryStudents(user.id);
      
      if (error) {
        console.error('Failed to load re-enquiry students:', error);
        return;
      }

      // Transform leads to ReenquiryStudent format
      const reenquiryData: ReenquiryStudent[] = (leads || []).map(lead => {
        const tags = lead.tags || [];
        let type: ReenquiryStudent['type'] = 'dormant_reactivation';
        
        if (tags.includes('upsell')) type = 'upsell_opportunity';
        else if (tags.includes('program_change')) type = 'program_change';
        else if (tags.includes('alumni_referral')) type = 'alumni_referral';
        else if (tags.includes('dormant') || tags.includes('reactivation')) type = 'dormant_reactivation';

        const lastContactDate = lead.last_contacted_at ? new Date(lead.last_contacted_at) : new Date(lead.created_at);
        const daysSinceContact = Math.floor((Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          id: lead.id,
          name: `${lead.first_name} ${lead.last_name}`,
          email: lead.email,
          phone: lead.phone,
          original_program: lead.program_interest?.[0] || 'Unknown',
          new_interest: lead.program_interest?.[1] || lead.program_interest?.[0] || 'Unknown',
          last_activity: lead.last_contacted_at || lead.updated_at,
          engagement_score: lead.lead_score || lead.ai_score || 0,
          type,
          days_since_last_contact: daysSinceContact
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
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          {students.length} re-enquiries
        </Badge>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No re-enquiries at this time</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Student</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Program Change</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Last Contact</th>
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

                    {/* Program Change */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground truncate max-w-[120px]">{student.original_program}</span>
                        <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium truncate max-w-[120px]">{student.new_interest}</span>
                      </div>
                    </td>

                    {/* Last Contact */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {student.days_since_last_contact}d ago
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
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle call action
                          }}
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle email action
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
  );
}