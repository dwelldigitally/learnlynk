import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlaysService, type Play } from '@/services/playsService';
import { Play as PlayIcon, Zap, Clock, FileText, Users, Heart } from 'lucide-react';

export function PlaysManagement() {
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPlays();
  }, []);

  const loadPlays = async () => {
    try {
      const data = await PlaysService.getPlays();
      setPlays(data);
    } catch (error) {
      console.error('Error loading plays:', error);
      toast({
        title: "Error",
        description: "Failed to load plays",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlay = async (playId: string, isActive: boolean) => {
    setToggleLoading(playId);
    try {
      const updatedPlay = await PlaysService.togglePlay(playId, isActive);
      setPlays(plays.map(p => p.id === playId ? updatedPlay : p));
      
      if (isActive) {
        const actionsGenerated = await PlaysService.generateActionsForPlay(updatedPlay);
        toast({
          title: "Play activated",
          description: `${actionsGenerated} new prioritized actions created`,
        });
      } else {
        toast({
          title: "Play deactivated",
          description: "Play has been turned off",
        });
      }
    } catch (error) {
      console.error('Error toggling play:', error);
      toast({
        title: "Error",
        description: "Failed to toggle play",
        variant: "destructive",
      });
    } finally {
      setToggleLoading(null);
    }
  };

  const getPlayIcon = (playType: string) => {
    switch (playType) {
      case 'immediate_response': return <Zap className="h-5 w-5" />;
      case 'nurture_sequence': return <Clock className="h-5 w-5" />;
      case 'document_follow_up': return <FileText className="h-5 w-5" />;
      case 'interview_booking': return <Users className="h-5 w-5" />;
      case 'onboarding': return <Heart className="h-5 w-5" />;
      default: return <PlayIcon className="h-5 w-5" />;
    }
  };

  const getPlayTypeLabel = (playType: string) => {
    switch (playType) {
      case 'immediate_response': return 'Immediate Response';
      case 'nurture_sequence': return 'Nurture Sequence';
      case 'document_follow_up': return 'Document Follow-up';
      case 'interview_booking': return 'Interview Booking';
      case 'onboarding': return 'Onboarding';
      default: return 'Sequence';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-5 bg-muted rounded w-48"></div>
                      <div className="h-4 bg-muted rounded w-64"></div>
                    </div>
                    <div className="h-6 w-12 bg-muted rounded-full"></div>
                  </div>
                  <div className="h-16 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activePlays = plays.filter(p => p.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Playbooks</h1>
          <p className="text-muted-foreground">
            Turn plays on or off to control which actions appear in Today
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {activePlays.length} Active
        </Badge>
      </div>

      {/* Explanation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">What are Plays?</h3>
          <p className="text-sm text-muted-foreground">
            Plays are small, reusable action recipes like "Stalled 7-Day" or "Document Chase." 
            You can turn them on or off per program. When you activate a play, it immediately 
            adds relevant actions to Today's list.
          </p>
        </CardContent>
      </Card>

      {/* Plays List */}
      <div className="grid gap-6">
        {plays.map((play) => (
          <Card key={play.id} className={play.is_active ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    play.is_active ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {getPlayIcon(play.play_type || '')}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{play.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {getPlayTypeLabel(play.play_type || '')}
                    </Badge>
                  </div>
                </div>
                
                <Switch
                  checked={play.is_active}
                  onCheckedChange={(checked) => handleTogglePlay(play.id, checked)}
                  disabled={toggleLoading === play.id}
                />
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-4">{play.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Target Stage</p>
                  <Badge variant="secondary">{play.target_stage || 'All stages'}</Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Expected Impact</p>
                  <p className="text-sm">{play.estimated_impact}</p>
                </div>
              </div>

              {play.is_active && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-green-800">Performance: Running</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {plays.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <PlayIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No plays available</h3>
            <p className="text-muted-foreground">
              Plays will be automatically created when you set up your system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}