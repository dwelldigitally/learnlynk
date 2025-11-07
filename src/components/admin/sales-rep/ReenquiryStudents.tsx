import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { RotateCcw, Phone, Mail, Star, Calendar, TrendingUp, ArrowRight, Eye } from 'lucide-react';

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
  const isMobile = useIsMobile();
  const [students, setStudents] = useState<ReenquiryStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReenquiryStudents();
  }, []);

  const loadReenquiryStudents = async () => {
    try {
      // Enhanced mock data for re-enquiry students with more variety
      const mockStudents: ReenquiryStudent[] = [
        {
          id: '1',
          name: 'David Martinez',
          email: 'david.martinez@email.com',
          phone: '+1234567890',
          original_program: 'MBA',
          new_interest: 'Executive MBA',
          last_activity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          engagement_score: 89,
          type: 'upsell_opportunity',
          days_since_last_contact: 2
        },
        {
          id: '2',
          name: 'Lisa Wong',
          email: 'lisa.wong@email.com',
          phone: '+1234567891',
          original_program: 'Marketing Certificate',
          new_interest: 'Digital Marketing Master',
          last_activity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          engagement_score: 76,
          type: 'program_change',
          days_since_last_contact: 5
        },
        {
          id: '3',
          name: 'James Thompson',
          email: 'james.thompson@email.com',
          original_program: 'Business Analytics',
          new_interest: 'Data Science Master',
          last_activity: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          engagement_score: 68,
          type: 'dormant_reactivation',
          days_since_last_contact: 12
        },
        {
          id: '4',
          name: 'Rachel Green',
          email: 'rachel.green@email.com',
          phone: '+1234567893',
          original_program: 'Finance MBA',
          new_interest: 'Investment Management Certificate',
          last_activity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          engagement_score: 82,
          type: 'alumni_referral',
          days_since_last_contact: 7
        },
        {
          id: '5',
          name: 'Alex Rodriguez',
          email: 'alex.rodriguez@email.com',
          phone: '+1234567894',
          original_program: 'Project Management',
          new_interest: 'Agile Master Certification',
          last_activity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          engagement_score: 91,
          type: 'upsell_opportunity',
          days_since_last_contact: 1
        }
      ];
      
      setStudents(mockStudents);
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
    <>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary" className="text-xs">
          {students.length} re-enquiries
        </Badge>
      </div>
      
      <div className="space-y-3">
        {students.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No re-enquiries at this time</p>
            <p className="text-xs text-muted-foreground mt-1">Check back later for new opportunities</p>
          </div>
        ) : (
          <>
            {students.map((student) => (
              <div
                key={student.id}
                className="group p-4 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="w-10 h-10 border-2 border-border flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {student.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs flex-shrink-0", getTypeBadgeStyle(student.type))}
                      >
                        {getTypeLabel(student.type)}
                      </Badge>
                    </div>
                    
                    {/* Program Change */}
                    <div className="flex items-center gap-2 mb-3 p-2 rounded-md bg-muted/50 border border-border/50">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-1 min-w-0">
                        <span className="font-medium text-foreground truncate">{student.original_program}</span>
                        <ArrowRight className="w-3 h-3 flex-shrink-0 text-primary" />
                        <span className="font-medium text-foreground truncate">{student.new_interest}</span>
                      </div>
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{student.days_since_last_contact}d ago</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className={cn("font-medium", getScoreColor(student.engagement_score))}>
                          {student.engagement_score}/100
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        className="h-8 text-xs flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3 h-3 mr-1.5" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 text-xs flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-3 h-3 mr-1.5" />
                        Email
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}