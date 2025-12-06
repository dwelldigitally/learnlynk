import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Lead } from '@/types/lead';
import { supabase } from '@/integrations/supabase/client';

interface IntakeDeadlineWidgetProps {
  lead: Lead;
}

interface IntakeData {
  id: string;
  name: string;
  start_date: string;
  application_deadline?: string;
  status: string;
  program_name?: string;
}

export function IntakeDeadlineWidget({ lead }: IntakeDeadlineWidgetProps) {
  const [intake, setIntake] = useState<IntakeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntakeData();
  }, [lead.preferred_intake_id, lead.program_interest]);

  const fetchIntakeData = async () => {
    setLoading(true);
    
    try {
      // If lead has a preferred intake, fetch that
      if (lead.preferred_intake_id) {
        const { data, error } = await supabase
          .from('intakes')
          .select(`
            id,
            name,
            start_date,
            application_deadline,
            status,
            program_id
          `)
          .eq('id', lead.preferred_intake_id)
          .single();

        if (!error && data) {
          // Fetch program name separately
          let programName: string | undefined;
          if (data.program_id) {
            const { data: programData } = await supabase
              .from('programs')
              .select('name')
              .eq('id', data.program_id)
              .single();
            programName = programData?.name;
          }
          
          setIntake({
            id: data.id,
            name: data.name,
            start_date: data.start_date,
            application_deadline: data.application_deadline || undefined,
            status: data.status,
            program_name: programName
          });
          setLoading(false);
          return;
        }
      }

      // Otherwise, try to find the next open intake for the lead's program interest
      if (lead.program_interest && lead.program_interest.length > 0) {
        const { data: programs } = await supabase
          .from('programs')
          .select('id, name')
          .in('name', lead.program_interest);

        if (programs && programs.length > 0) {
          const programIds = programs.map(p => p.id);
          
          const { data: intakeData, error } = await supabase
            .from('intakes')
            .select(`
              id,
              name,
              start_date,
              application_deadline,
              status,
              program_id
            `)
            .in('program_id', programIds)
            .eq('status', 'open')
            .gte('start_date', new Date().toISOString())
            .order('start_date', { ascending: true })
            .limit(1)
            .single();

          if (!error && intakeData) {
            const matchedProgram = programs.find(p => p.id === intakeData.program_id);
            setIntake({
              id: intakeData.id,
              name: intakeData.name,
              start_date: intakeData.start_date,
              application_deadline: intakeData.application_deadline || undefined,
              status: intakeData.status,
              program_name: matchedProgram?.name
            });
            setLoading(false);
            return;
          }
        }
      }

      // No intake found
      setIntake(null);
    } catch (error) {
      console.error('Error fetching intake data:', error);
      setIntake(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatMonthYear = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Intake Deadline
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!intake) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Intake Deadline
          </CardTitle>
          <CardDescription>
            Important dates and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No Intake Selected</p>
            <p className="text-xs text-muted-foreground mt-1">
              {lead.program_interest?.length 
                ? 'No open intakes found for the selected programs'
                : 'Select a program interest to see intake deadlines'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysUntilStart = calculateDaysUntil(intake.start_date);
  const daysUntilDeadline = intake.application_deadline 
    ? calculateDaysUntil(intake.application_deadline) 
    : null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Intake Deadline
        </CardTitle>
        <CardDescription>
          {intake.program_name || 'Important dates and deadlines'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{intake.name}</p>
              <Badge 
                variant={intake.status === 'open' ? 'default' : 'secondary'} 
                className="text-xs"
              >
                {intake.status}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatMonthYear(intake.start_date)}
            </p>
          </div>

          <div className="space-y-3">
            {intake.application_deadline && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Application Deadline</span>
                <span className="font-medium text-foreground">
                  {formatDate(intake.application_deadline)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Intake Start Date</span>
              <span className="font-medium text-foreground">
                {formatDate(intake.start_date)}
              </span>
            </div>
          </div>

          {daysUntilDeadline !== null && daysUntilDeadline > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className={`h-4 w-4 ${daysUntilDeadline <= 7 ? 'text-destructive' : daysUntilDeadline <= 14 ? 'text-amber-500' : 'text-emerald-500'}`} />
                <span className={`${daysUntilDeadline <= 7 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                  {daysUntilDeadline} days left to apply
                </span>
              </div>
            </div>
          )}

          {daysUntilDeadline !== null && daysUntilDeadline <= 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Application deadline passed</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
