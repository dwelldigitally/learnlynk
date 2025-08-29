import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bot, Play, Clock, Target, Zap, MessageSquare, Phone, FileText, Calendar } from 'lucide-react';
import { Lead } from '@/types/lead';
import { PlaysService } from '@/services/playsService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SuggestedPlay {
  id: string;
  name: string;
  play_type: string;
  description: string;
  confidence: number;
  reasoning: string[];
  urgency: 'low' | 'medium' | 'high';
  estimated_outcome: string;
  trigger_conditions: string[];
}

interface ActivePlay {
  id: string;
  name: string;
  play_type: string;
  status: 'active' | 'scheduled' | 'completed';
  started_at?: string;
  next_action?: string;
  progress: number;
}

interface AIPlaysPanelProps {
  lead: Lead;
  onUpdate?: () => void;
}

export function AIPlaysPanel({ lead, onUpdate }: AIPlaysPanelProps) {
  const [suggestedPlays, setSuggestedPlays] = useState<SuggestedPlay[]>([]);
  const [activePlays, setActivePlays] = useState<ActivePlay[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPlaysData();
  }, [lead.id]);

  const loadPlaysData = async () => {
    try {
      setLoading(true);
      
      // Load suggested plays based on lead context
      const suggested = await generateSuggestedPlays();
      setSuggestedPlays(suggested);

      // Load active plays for this lead
      const { data: activeActions, error } = await supabase
        .from('student_actions')
        .select(`
          *,
          plays:play_id (name, play_type)
        `)
        .eq('student_id', lead.id)
        .in('status', ['pending', 'in_progress']);

      if (error) throw error;

      const activePlayData = activeActions?.map(action => ({
        id: action.play_id || 'manual',
        name: action.plays?.name || 'Manual Action',
        play_type: action.plays?.play_type || 'manual',
        status: (action.status === 'pending' ? 'scheduled' : action.status === 'completed' ? 'completed' : 'active') as 'active' | 'scheduled' | 'completed',
        started_at: action.created_at,
        next_action: action.instruction,
        progress: action.status === 'completed' ? 100 : 50
      })) || [];

      setActivePlays(activePlayData);

    } catch (error) {
      console.error('Error loading plays data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestedPlays = async (): Promise<SuggestedPlay[]> => {
    // Analyze lead context to suggest relevant plays
    const suggestions: SuggestedPlay[] = [];

    // Get real plays from the database
    const { data: plays, error } = await supabase
      .from('plays')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching plays:', error);
      return [];
    }

    // Analyze lead context for play suggestions
    const leadAge = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const lastContactDays = lead.last_contacted_at 
      ? Math.floor((Date.now() - new Date(lead.last_contacted_at).getTime()) / (1000 * 60 * 60 * 24))
      : leadAge;

    // Generate contextual suggestions
    if (lead.status === 'new' && leadAge < 1) {
      suggestions.push({
        id: 'immediate-response',
        name: 'Speed-to-Lead Response',
        play_type: 'immediate_response',
        description: 'Contact within 5 minutes of inquiry',
        confidence: 95,
        reasoning: ['New inquiry', 'Within 24 hours', 'High conversion potential'],
        urgency: 'high',
        estimated_outcome: '40% higher conversion rate',
        trigger_conditions: ['New lead', 'Recent inquiry']
      });
    }

    if (lastContactDays >= 3 && lead.status === 'contacted') {
      suggestions.push({
        id: 'follow-up-sequence',
        name: 'Nurture Follow-up',
        play_type: 'nurture_sequence',
        description: 'Multi-touch follow-up sequence',
        confidence: 85,
        reasoning: ['No contact for 3+ days', 'Previously engaged', 'Maintaining interest'],
        urgency: 'medium',
        estimated_outcome: '25% re-engagement rate',
        trigger_conditions: ['Contact gap', 'Previous engagement']
      });
    }

    if (lead.program_interest && lead.program_interest.length > 0) {
      suggestions.push({
        id: 'program-specific',
        name: 'Program Information Package',
        play_type: 'document_follow_up',
        description: 'Send tailored program materials',
        confidence: 78,
        reasoning: ['Specific program interest', 'Information gathering stage'],
        urgency: 'medium',
        estimated_outcome: '35% document engagement',
        trigger_conditions: ['Program interest indicated']
      });
    }

    if (lead.lead_score && lead.lead_score >= 70) {
      suggestions.push({
        id: 'interview-scheduler',
        name: 'Priority Interview Scheduling',
        play_type: 'interview_scheduler',
        description: 'Fast-track to interview',
        confidence: 88,
        reasoning: ['High lead score', 'Qualified candidate', 'Ready for assessment'],
        urgency: 'high',
        estimated_outcome: '60% interview acceptance',
        trigger_conditions: ['High lead score', 'Qualification criteria met']
      });
    }

    return suggestions;
  };

  const executePlay = async (playId: string) => {
    try {
      // Create a student action based on the suggested play
      const play = suggestedPlays.find(p => p.id === playId);
      if (!play) return;

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('student_actions')
        .insert([{
          user_id: user.user.id,
          student_id: lead.id,
          action_type: getActionTypeFromPlay(play.play_type),
          instruction: generateActionInstruction(play, lead),
          priority: play.urgency === 'high' ? 1 : play.urgency === 'medium' ? 2 : 3,
          reason_chips: play.reasoning,
          metadata: {
            suggested_play: play.name,
            confidence: play.confidence,
            trigger_source: 'ai_suggestion'
          }
        }]);

      if (error) throw error;

      toast({
        title: 'Play Executed',
        description: `${play.name} has been added to the action queue.`
      });

      loadPlaysData(); // Refresh data
      onUpdate?.();

    } catch (error) {
      console.error('Error executing play:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute play',
        variant: 'destructive'
      });
    }
  };

  const getActionTypeFromPlay = (playType: string): string => {
    switch (playType) {
      case 'immediate_response': return 'call';
      case 'nurture_sequence': return 'email';
      case 'document_follow_up': return 'document_request';
      case 'interview_scheduler': return 'call';
      default: return 'email';
    }
  };

  const generateActionInstruction = (play: SuggestedPlay, lead: Lead): string => {
    const studentName = `${lead.first_name} ${lead.last_name}`;
    
    switch (play.play_type) {
      case 'immediate_response':
        return `Call ${studentName} immediately - new inquiry response`;
      case 'nurture_sequence':
        return `Send follow-up email to ${studentName} - re-engagement sequence`;
      case 'document_follow_up':
        return `Send program information package to ${studentName}`;
      case 'interview_scheduler':
        return `Schedule priority interview with ${studentName}`;
      default:
        return `Contact ${studentName} - ${play.name}`;
    }
  };

  const getPlayIcon = (playType: string) => {
    switch (playType) {
      case 'immediate_response': return Phone;
      case 'nurture_sequence': return MessageSquare;
      case 'document_follow_up': return FileText;
      case 'interview_scheduler': return Calendar;
      default: return Play;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Plays & Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5" />
          AI Plays & Suggestions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto">
        {/* Active Plays */}
        {activePlays.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Active Plays
            </h4>
            <div className="space-y-2">
              {activePlays.map((play) => {
                const PlayIcon = getPlayIcon(play.play_type);
                return (
                  <div key={play.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PlayIcon className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">{play.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {play.status}
                      </Badge>
                    </div>
                    {play.next_action && (
                      <p className="text-xs text-muted-foreground">{play.next_action}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <Separator className="my-4" />
          </div>
        )}

        {/* Suggested Plays */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            AI Suggestions
          </h4>
          <div className="space-y-3">
            {suggestedPlays.map((play) => {
              const PlayIcon = getPlayIcon(play.play_type);
              return (
                <div key={play.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <PlayIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{play.name}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getUrgencyColor(play.urgency)}`}>
                      {play.urgency}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{play.description}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-green-500" />
                      <span className="text-xs font-medium">{play.confidence}% confidence</span>
                    </div>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{play.estimated_outcome}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {play.reasoning.slice(0, 3).map((reason, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => executePlay(play.id)}
                  >
                    Execute Play
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {suggestedPlays.length === 0 && activePlays.length === 0 && (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No AI plays or suggestions available</p>
            <p className="text-xs text-muted-foreground mt-2">AI will analyze this lead and suggest optimal actions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}