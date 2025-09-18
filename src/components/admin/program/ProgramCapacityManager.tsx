import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgramCapacity, ClassShapingTargets } from "@/types/programFit";
import { ProgramFitService } from "@/services/programFitService";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Target,
  Globe,
  TrendingUp,
  Settings,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProgramCapacityManagerProps {
  programName?: string;
  onCapacityUpdate?: (capacity: ProgramCapacity) => void;
}

export const ProgramCapacityManager: React.FC<ProgramCapacityManagerProps> = ({
  programName,
  onCapacityUpdate
}) => {
  const [capacities, setCapacities] = useState<ProgramCapacity[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<ProgramCapacity | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    program_name: programName || '',
    total_seats: 30,
    filled_seats: 0,
    target_gpa_min: 3.0,
    target_gpa_max: 4.0,
    target_domestic_ratio: 0.7,
    target_international_ratio: 0.3,
    intake_period: 'Fall 2024',
    diversity_targets: {},
    class_shaping_rules: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCapacities();
  }, []);

  useEffect(() => {
    if (programName) {
      const capacity = capacities.find(c => c.program_name === programName);
      setSelectedCapacity(capacity || null);
    }
  }, [programName, capacities]);

  const loadCapacities = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('program_capacity')
        .select('*')
        .eq('user_id', user.id)
        .order('program_name');

      if (error) throw error;
      setCapacities(data || []);
    } catch (error) {
      console.error('Error loading capacities:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCapacity = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const capacityData = {
        ...formData,
        user_id: user.id,
        diversity_targets: JSON.stringify(formData.diversity_targets),
        class_shaping_rules: JSON.stringify(formData.class_shaping_rules)
      };

      if (selectedCapacity) {
        const { data, error } = await supabase
          .from('program_capacity')
          .update(capacityData)
          .eq('id', selectedCapacity.id)
          .select()
          .single();

        if (error) throw error;
        setSelectedCapacity(data);
        onCapacityUpdate?.(data);
      } else {
        const { data, error } = await supabase
          .from('program_capacity')
          .insert([capacityData])
          .select()
          .single();

        if (error) throw error;
        setSelectedCapacity(data);
        onCapacityUpdate?.(data);
      }

      setEditing(false);
      loadCapacities();
      
      toast({
        title: "Capacity Updated",
        description: `Program capacity for ${formData.program_name} has been saved.`,
      });
    } catch (error) {
      console.error('Error saving capacity:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save program capacity. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getCapacityStatus = (capacity: ProgramCapacity) => {
    const utilization = (capacity.filled_seats / capacity.total_seats) * 100;
    if (utilization >= 90) return { color: 'text-destructive', status: 'Critical', icon: AlertTriangle };
    if (utilization >= 75) return { color: 'text-warning', status: 'High', icon: TrendingUp };
    if (utilization >= 50) return { color: 'text-blue-600', status: 'Good', icon: Target };
    return { color: 'text-success', status: 'Available', icon: CheckCircle };
  };

  const startEditing = (capacity?: ProgramCapacity) => {
    if (capacity) {
      setFormData({
        program_name: capacity.program_name,
        total_seats: capacity.total_seats,
        filled_seats: capacity.filled_seats,
        target_gpa_min: capacity.target_gpa_min,
        target_gpa_max: capacity.target_gpa_max,
        target_domestic_ratio: capacity.target_domestic_ratio,
        target_international_ratio: capacity.target_international_ratio,
        intake_period: capacity.intake_period || '',
        diversity_targets: capacity.diversity_targets,
        class_shaping_rules: capacity.class_shaping_rules
      });
      setSelectedCapacity(capacity);
    } else {
      setFormData({
        program_name: '',
        total_seats: 30,
        filled_seats: 0,
        target_gpa_min: 3.0,
        target_gpa_max: 4.0,
        target_domestic_ratio: 0.7,
        target_international_ratio: 0.3,
        intake_period: 'Fall 2024',
        diversity_targets: {},
        class_shaping_rules: {}
      });
      setSelectedCapacity(null);
    }
    setEditing(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 animate-pulse" />
            <span>Loading program capacities...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Program Capacity Management
            </div>
            <Button onClick={() => startEditing()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Capacity Overview */}
      {!editing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capacities.map((capacity) => {
            const status = getCapacityStatus(capacity);
            const utilization = (capacity.filled_seats / capacity.total_seats) * 100;

            return (
              <Card key={capacity.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => startEditing(capacity)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{capacity.program_name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <status.icon className={`h-4 w-4 ${status.color}`} />
                    <Badge variant={utilization >= 90 ? 'destructive' : utilization >= 75 ? 'secondary' : 'outline'}>
                      {status.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capacity Utilization</span>
                      <span className={status.color}>{Math.round(utilization)}%</span>
                    </div>
                    <Progress value={utilization} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {capacity.filled_seats} of {capacity.total_seats} seats filled
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">GPA Range:</span>
                      <div>{capacity.target_gpa_min} - {capacity.target_gpa_max}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Intake:</span>
                      <div>{capacity.intake_period || 'Not set'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-3 w-3" />
                    <span>
                      {Math.round(capacity.target_domestic_ratio * 100)}% Domestic / 
                      {Math.round(capacity.target_international_ratio * 100)}% International
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Form */}
      {editing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {selectedCapacity ? 'Edit Program Capacity' : 'Add New Program Capacity'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program_name">Program Name</Label>
                <Input
                  id="program_name"
                  value={formData.program_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, program_name: e.target.value }))}
                  placeholder="e.g., Health Care Assistant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intake_period">Intake Period</Label>
                <Input
                  id="intake_period"
                  value={formData.intake_period}
                  onChange={(e) => setFormData(prev => ({ ...prev, intake_period: e.target.value }))}
                  placeholder="e.g., Fall 2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_seats">Total Seats</Label>
                <Input
                  id="total_seats"
                  type="number"
                  value={formData.total_seats}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_seats: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filled_seats">Currently Filled</Label>
                <Input
                  id="filled_seats"
                  type="number"
                  value={formData.filled_seats}
                  onChange={(e) => setFormData(prev => ({ ...prev, filled_seats: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_gpa_min">Minimum GPA Target</Label>
                <Input
                  id="target_gpa_min"
                  type="number"
                  step="0.1"
                  value={formData.target_gpa_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_gpa_min: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_gpa_max">Maximum GPA Target</Label>
                <Input
                  id="target_gpa_max"
                  type="number"
                  step="0.1"
                  value={formData.target_gpa_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_gpa_max: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domestic_ratio">Domestic Ratio</Label>
                <Input
                  id="domestic_ratio"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.target_domestic_ratio}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    target_domestic_ratio: parseFloat(e.target.value) || 0,
                    target_international_ratio: 1 - (parseFloat(e.target.value) || 0)
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="international_ratio">International Ratio</Label>
                <Input
                  id="international_ratio"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.target_international_ratio}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    target_international_ratio: parseFloat(e.target.value) || 0,
                    target_domestic_ratio: 1 - (parseFloat(e.target.value) || 0)
                  }))}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveCapacity}>
                Save Capacity
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};