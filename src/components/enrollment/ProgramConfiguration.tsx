import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Settings, Plus, Clock, FileText, Users } from 'lucide-react';

interface ProgramConfig {
  id: string;
  user_id: string;
  program_name: string;
  settings: {
    stall_days?: number;
    requires_interview?: boolean;
    requires_documents?: boolean;
    auto_nurture?: boolean;
    response_time_target?: number;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function ProgramConfiguration() {
  const [programs, setPrograms] = useState<ProgramConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [newProgramName, setNewProgramName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('program_configurations')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setPrograms((data || []).map(d => ({
        ...d,
        settings: typeof d.settings === 'string' ? JSON.parse(d.settings) : d.settings
      })));
    } catch (error) {
      console.error('Error loading programs:', error);
      toast({
        title: "Error",
        description: "Failed to load program configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgram = async () => {
    if (!newProgramName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('program_configurations')
        .insert({
          program_name: newProgramName,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          settings: {
            stall_days: 7,
            requires_interview: false,
            requires_documents: true,
            auto_nurture: true,
            response_time_target: 5
          },
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setPrograms([...programs, {
        ...data,
        settings: typeof data.settings === 'string' ? JSON.parse(data.settings) : data.settings
      }]);
      setNewProgramName('');
      setShowAddProgram(false);
      
      toast({
        title: "Program added",
        description: `${newProgramName} has been configured`,
      });
    } catch (error) {
      console.error('Error adding program:', error);
      toast({
        title: "Error",
        description: "Failed to add program",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProgram = async (programId: string, settings: any) => {
    try {
      const { data, error } = await supabase
        .from('program_configurations')
        .update({ settings })
        .eq('id', programId)
        .select()
        .single();

      if (error) throw error;

      setPrograms(programs.map(p => p.id === programId ? {
        ...data,
        settings: typeof data.settings === 'string' ? JSON.parse(data.settings) : data.settings
      } : p));
    } catch (error) {
      console.error('Error updating program:', error);
      toast({
        title: "Error",
        description: "Failed to update program settings",
        variant: "destructive",
      });
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
                  <div className="h-5 bg-muted rounded w-48"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-muted-foreground">
            Configure which plays apply to each program and set program-specific rules
          </p>
        </div>
        <Button onClick={() => setShowAddProgram(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      {/* Explanation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">Program Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Set up program-specific settings like stall thresholds, interview requirements, 
            and response time targets. These control how plays behave for each program.
          </p>
        </CardContent>
      </Card>

      {/* Add New Program */}
      {showAddProgram && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Add New Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Program Name</Label>
              <Input
                value={newProgramName}
                onChange={(e) => setNewProgramName(e.target.value)}
                placeholder="e.g., Business Administration"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddProgram}>Add Program</Button>
              <Button variant="outline" onClick={() => {
                setShowAddProgram(false);
                setNewProgramName('');
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Programs List */}
      <div className="grid gap-6">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>{program.program_name}</CardTitle>
                  <Badge variant={program.is_active ? "default" : "secondary"} className="mt-1">
                    {program.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Stall Configuration */}
              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4" />
                  <span>Timing Settings</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Consider application "stalled" after</Label>
                    <Select
                      value={String(program.settings.stall_days || 7)}
                      onValueChange={(value) => handleUpdateProgram(program.id, {
                        ...program.settings,
                        stall_days: parseInt(value)
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="10">10 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Response time target (minutes)</Label>
                    <Select
                      value={String(program.settings.response_time_target || 5)}
                      onValueChange={(value) => handleUpdateProgram(program.id, {
                        ...program.settings,
                        response_time_target: parseInt(value)
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <FileText className="h-4 w-4" />
                  <span>Program Requirements</span>
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Requires interview</Label>
                      <p className="text-xs text-muted-foreground">Enable RSVP → Interview play</p>
                    </div>
                    <Switch
                      checked={program.settings.requires_interview || false}
                      onCheckedChange={(checked) => handleUpdateProgram(program.id, {
                        ...program.settings,
                        requires_interview: checked
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Requires additional documents</Label>
                      <p className="text-xs text-muted-foreground">Enable Document Chase play</p>
                    </div>
                    <Switch
                      checked={program.settings.requires_documents || false}
                      onCheckedChange={(checked) => handleUpdateProgram(program.id, {
                        ...program.settings,
                        requires_documents: checked
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Automation */}
              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <Settings className="h-4 w-4" />
                  <span>Automation Settings</span>
                </Label>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Enable automatic nurture sequences</Label>
                    <p className="text-xs text-muted-foreground">Allow plays to run automatically for this program</p>
                  </div>
                  <Switch
                    checked={program.settings.auto_nurture || false}
                    onCheckedChange={(checked) => handleUpdateProgram(program.id, {
                      ...program.settings,
                      auto_nurture: checked
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {programs.length === 0 && !showAddProgram && (
        <Card>
          <CardContent className="p-8 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No programs configured</h3>
            <p className="text-muted-foreground mb-4">
              Add your first program to start configuring plays and policies.
            </p>
            <Button onClick={() => setShowAddProgram(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}