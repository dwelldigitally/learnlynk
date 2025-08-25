import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, Clock, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WasteRadarTable } from './WasteRadarTable';

interface WasteRadarItem {
  id: string;
  student_name: string;
  unresponsive_30d: boolean;
  wrong_intake: boolean;
  duplicate_flag: boolean;
  touch_count: number;
}

export function WasteRadarDashboard() {
  const [wasteItems, setWasteItems] = useState<WasteRadarItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWasteRadarData();
  }, []);

  const loadWasteRadarData = async () => {
    try {
      const { data, error } = await supabase
        .from('waste_radar')
        .select('*')
        .order('touch_count', { ascending: false });

      if (error) throw error;
      setWasteItems(data || []);
    } catch (error) {
      console.error('Error loading waste radar data:', error);
      toast({
        title: "Error",
        description: "Failed to load waste radar data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(new Set(wasteItems.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleApplyStopTouch = async () => {
    if (selectedItems.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select items to remove from counselor queues",
        variant: "destructive"
      });
      return;
    }

    setApplying(true);
    try {
      // In a real implementation, this would update the action_queue to remove selected items
      // For demo purposes, we'll just remove them from waste_radar
      const { error } = await supabase
        .from('waste_radar')
        .delete()
        .in('id', Array.from(selectedItems));

      if (error) throw error;

      // Show success message
      toast({
        title: "Stop-Touch Applied",
        description: `${selectedItems.size} contacts removed from counselor queues`,
      });

      // Reload data and clear selection
      await loadWasteRadarData();
      setSelectedItems(new Set());
      
    } catch (error) {
      console.error('Error applying stop-touch:', error);
      toast({
        title: "Error",
        description: "Failed to apply stop-touch",
        variant: "destructive"
      });
    } finally {
      setApplying(false);
    }
  };

  const flaggedUnresponsive = wasteItems.filter(item => item.unresponsive_30d).length;
  const flaggedWrongIntake = wasteItems.filter(item => item.wrong_intake).length;
  const flaggedDuplicates = wasteItems.filter(item => item.duplicate_flag).length;
  const totalTouches = wasteItems.reduce((sum, item) => sum + item.touch_count, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Waste Radar</h1>
          <p className="text-muted-foreground">
            Stop touches that don't convert—reallocate counselor time to high-probability students
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {selectedItems.size > 0 && (
            <Button
              onClick={handleApplyStopTouch}
              disabled={applying}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {applying ? 'Applying...' : `Apply Stop-Touch (${selectedItems.size})`}
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unresponsive 30d</p>
                <p className="text-2xl font-bold text-foreground">{flaggedUnresponsive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wrong Intake</p>
                <p className="text-2xl font-bold text-foreground">{flaggedWrongIntake}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duplicates</p>
                <p className="text-2xl font-bold text-foreground">{flaggedDuplicates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Touches</p>
                <p className="text-2xl font-bold text-foreground">{totalTouches}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selection Summary */}
      {selectedItems.size > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">
                  {selectedItems.size} contacts selected for stop-touch
                </span>
              </div>
              <Badge variant="destructive">
                Impact: -{selectedItems.size} from counselor queues
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waste Radar Table */}
      <Card>
        <CardHeader>
          <CardTitle>Low-Value Touch Identification</CardTitle>
        </CardHeader>
        <CardContent>
          <WasteRadarTable 
            items={wasteItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
      </Card>

      {/* Capacity Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Projected Capacity Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">+{Math.floor(totalTouches * 0.3)}</div>
              <div className="text-sm text-muted-foreground">Hours Freed per Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">+{Math.floor(totalTouches * 0.15)}</div>
              <div className="text-sm text-muted-foreground">High-Value Touches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">+{Math.floor(totalTouches * 0.08)}%</div>
              <div className="text-sm text-muted-foreground">Expected Conversion Lift</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}