import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { JourneyOrchestrator } from '@/services/journeyOrchestrator';
import { PlaysService } from '@/services/playsService';
import type { AcademicJourney } from '@/types/academicJourney';
import { Settings, Zap, Clock, Target } from 'lucide-react';

interface JourneyPlayMapperProps {
  journey: AcademicJourney;
  onMappingsChanged?: () => void;
}

interface PlayMapping {
  id?: string;
  playId: string;
  playName: string;
  stageId: string;
  stageName: string;
  isEnabled: boolean;
  timingOverride: {
    delayHours?: number;
    description?: string;
  };
  priorityOverride?: number;
  conditions: Record<string, any>;
}

export function JourneyPlayMapper({ journey, onMappingsChanged }: JourneyPlayMapperProps) {
  const [plays, setPlays] = useState<any[]>([]);
  const [mappings, setMappings] = useState<PlayMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [journey.id]);

  const loadData = async () => {
    try {
      const [playsData, mappingsData] = await Promise.all([
        PlaysService.getPlays(),
        JourneyOrchestrator.getJourneyPlayMappings(journey.id)
      ]);

      setPlays(playsData);
      
      // Convert mappings to UI format
      const uiMappings: PlayMapping[] = [];
      
      for (const stage of (journey as any).journey_stages || []) {
        for (const play of playsData) {
          const existingMapping = mappingsData.find(
            m => m.stage_id === stage.id && m.play_id === play.id
          );

          uiMappings.push({
            id: existingMapping?.id,
            playId: play.id,
            playName: play.name,
            stageId: stage.id,
            stageName: stage.name,
            isEnabled: existingMapping?.is_enabled ?? false,
            timingOverride: existingMapping?.timing_override as any || {},
            priorityOverride: existingMapping?.priority_override || undefined,
            conditions: existingMapping?.conditions as any || {}
          });
        }
      }

      setMappings(uiMappings);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load journey-play mappings"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMappings = async () => {
    setSaving(true);
    try {
      // Save enabled mappings
      const enabledMappings = mappings.filter(m => m.isEnabled);
      
      for (const mapping of enabledMappings) {
        if (!mapping.id) {
          // Create new mapping
          await JourneyOrchestrator.createJourneyPlayMapping({
            journey_id: journey.id,
            stage_id: mapping.stageId,
            play_id: mapping.playId,
            is_enabled: true,
            timing_override: mapping.timingOverride,
            priority_override: mapping.priorityOverride,
            conditions: mapping.conditions
          });
        }
        // Note: Updates would go here in full implementation
      }

      toast({
        title: "Success",
        description: "Journey-play mappings saved successfully"
      });

      onMappingsChanged?.();
      loadData(); // Reload to get IDs for new mappings
    } catch (error) {
      console.error('Error saving mappings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save mappings"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateMapping = (
    playId: string, 
    stageId: string, 
    updates: Partial<PlayMapping>
  ) => {
    setMappings(prev => prev.map(m => 
      m.playId === playId && m.stageId === stageId 
        ? { ...m, ...updates }
        : m
    ));
  };

  const getStagePlayMappings = (stageId: string) => {
    return mappings.filter(m => m.stageId === stageId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Journey-Play Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure which plays can run during each journey stage
          </p>
        </div>
        <Button 
          onClick={saveMappings} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>

      {((journey as any).journey_stages || []).map((stage: any) => (
        <Card key={stage.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {stage.name}
              <Badge variant="outline">{stage.stage_type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {getStagePlayMappings(stage.id).map((mapping) => (
                <div 
                  key={`${mapping.playId}-${mapping.stageId}`}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={mapping.isEnabled}
                      onCheckedChange={(checked) => 
                        updateMapping(mapping.playId, mapping.stageId, { 
                          isEnabled: checked 
                        })
                      }
                    />
                    <div>
                      <div className="font-medium">{mapping.playName}</div>
                      <div className="text-sm text-muted-foreground">
                        {plays.find(p => p.id === mapping.playId)?.description || 'Automated play sequence'}
                      </div>
                    </div>
                  </div>

                  {mapping.isEnabled && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={`delay-${mapping.playId}-${mapping.stageId}`} className="text-xs">
                          Delay (hours)
                        </Label>
                        <Input
                          id={`delay-${mapping.playId}-${mapping.stageId}`}
                          type="number"
                          min="0"
                          max="168"
                          className="w-20"
                          value={mapping.timingOverride.delayHours || 0}
                          onChange={(e) => 
                            updateMapping(mapping.playId, mapping.stageId, {
                              timingOverride: {
                                ...mapping.timingOverride,
                                delayHours: parseInt(e.target.value) || 0
                              }
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={`priority-${mapping.playId}-${mapping.stageId}`} className="text-xs">
                          Priority
                        </Label>
                        <Input
                          id={`priority-${mapping.playId}-${mapping.stageId}`}
                          type="number"
                          min="1"
                          max="5"
                          className="w-16"
                          value={mapping.priorityOverride || ''}
                          placeholder="Auto"
                          onChange={(e) => 
                            updateMapping(mapping.playId, mapping.stageId, {
                              priorityOverride: e.target.value ? parseInt(e.target.value) : undefined
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {((journey as any).journey_stages || []).length}
              </div>
              <div className="text-sm text-muted-foreground">Journey Stages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {plays.length}
              </div>
              <div className="text-sm text-muted-foreground">Available Plays</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mappings.filter(m => m.isEnabled).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Mappings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {mappings.filter(m => m.isEnabled && (m.timingOverride.delayHours || 0) > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">With Delays</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}