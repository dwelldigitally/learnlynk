import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Target, TrendingUp, RefreshCw, UserX } from 'lucide-react';
import { Lead } from '@/types/lead';
import { supabase } from '@/integrations/supabase/client';

interface SmartAdvisorMatchProps {
  lead: Lead;
}

interface AdvisorInfo {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  department?: string;
  assignedAt?: string;
  assignmentMethod?: string;
}

export function SmartAdvisorMatch({ lead }: SmartAdvisorMatchProps) {
  const [advisor, setAdvisor] = useState<AdvisorInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdvisor();
  }, [lead.assigned_to]);

  const fetchAdvisor = async () => {
    if (!lead.assigned_to) {
      setAdvisor(null);
      return;
    }

    setLoading(true);
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email, avatar_url, department')
        .eq('user_id', lead.assigned_to)
        .single();

      if (error) {
        console.error('Failed to fetch advisor profile:', error);
        setAdvisor(null);
      } else if (profile) {
        const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Unknown Advisor';
        setAdvisor({
          userId: profile.user_id,
          fullName,
          email: profile.email || '',
          avatarUrl: profile.avatar_url || undefined,
          department: profile.department || undefined,
          assignedAt: lead.assigned_at || undefined,
          assignmentMethod: lead.assignment_method || undefined
        });
      }
    } catch (error) {
      console.error('Failed to fetch advisor:', error);
      setAdvisor(null);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentMethodLabel = (method?: string) => {
    if (!method) return 'Manual';
    const labels: Record<string, string> = {
      'manual': 'Manual',
      'round_robin': 'Round Robin',
      'ai_based': 'AI Based',
      'geography': 'Geographic',
      'performance': 'Performance',
      'team_based': 'Team Based',
      'territory_based': 'Territory',
      'workload_based': 'Workload'
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assigned Advisor
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!lead.assigned_to || !advisor) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assigned Advisor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <UserX className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Not Assigned</p>
            <p className="text-xs text-muted-foreground">
              This lead has not been assigned to an advisor yet
            </p>
          </div>
          <Button size="sm" variant="outline" className="w-full" onClick={fetchAdvisor}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Assigned Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {advisor.avatarUrl ? (
              <img 
                src={advisor.avatarUrl} 
                alt={advisor.fullName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {advisor.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium">{advisor.fullName}</p>
              <p className="text-xs text-muted-foreground">{advisor.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span className="text-muted-foreground">Assignment</span>
            </div>
            <p className="font-medium">{getAssignmentMethodLabel(advisor.assignmentMethod)}</p>
          </div>
          {advisor.department && (
            <div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-muted-foreground">Department</span>
              </div>
              <p className="font-medium">{advisor.department}</p>
            </div>
          )}
        </div>

        {advisor.assignedAt && (
          <div>
            <p className="text-xs text-muted-foreground">
              Assigned on {new Date(advisor.assignedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="flex items-center justify-end">
          <Button size="sm" variant="outline" onClick={fetchAdvisor}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
