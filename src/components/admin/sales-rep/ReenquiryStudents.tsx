import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { RotateCcw, Phone, Mail, Star, Calendar, TrendingUp } from 'lucide-react';

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
      // Mock data for re-enquiry students
      const mockStudents: ReenquiryStudent[] = [
        {
          id: '1',
          name: 'David Martinez',
          email: 'david.martinez@email.com',
          phone: '+1234567890',
          original_program: 'MBA',
          new_interest: 'Executive MBA',
          last_activity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          engagement_score: 85,
          type: 'upsell_opportunity',
          days_since_last_contact: 3
        },
        {
          id: '2',
          name: 'Lisa Wong',
          email: 'lisa.wong@email.com',
          phone: '+1234567891',
          original_program: 'Marketing Certificate',
          new_interest: 'Digital Marketing Master',
          last_activity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          engagement_score: 72,
          type: 'program_change',
          days_since_last_contact: 7
        },
        {
          id: '3',
          name: 'James Thompson',
          email: 'james.thompson@email.com',
          original_program: 'Business Analytics',
          new_interest: 'Data Science',
          last_activity: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          engagement_score: 68,
          type: 'dormant_reactivation',
          days_since_last_contact: 14
        }
      ];
      
      setStudents(mockStudents);
    } catch (error) {
      console.error('Failed to load re-enquiry students:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'upsell_opportunity': return 'text-success';
      case 'program_change': return 'text-primary';
      case 'dormant_reactivation': return 'text-warning';
      case 'alumni_referral': return 'text-accent';
      default: return 'text-muted-foreground';
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

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'text-success';
    if (days <= 7) return 'text-warning';
    return 'text-destructive';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Re-enquiry Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-20"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Re-enquiry Students
          <Badge variant="secondary" className="ml-auto">{students.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <RotateCcw className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No re-enquiries today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {student.name}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getTypeColor(student.type))}
                      >
                        {getTypeLabel(student.type)}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{student.original_program} → {student.new_interest}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span className={getUrgencyColor(student.days_since_last_contact)}>
                          {student.days_since_last_contact} days ago
                        </span>
                        <span>•</span>
                        <Star className="w-3 h-3 text-warning" />
                        <span>{student.engagement_score}/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Phone className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Mail className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}