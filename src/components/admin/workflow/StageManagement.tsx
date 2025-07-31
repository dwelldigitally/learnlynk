import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CustomStage {
  id: string;
  name: string;
  description: string;
  order_index: number;
  is_default: boolean;
  created_at: string;
}

const StageManagement: React.FC = () => {
  const [stages, setStages] = useState<CustomStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingStage, setEditingStage] = useState<CustomStage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_stages')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setStages(data || []);
    } catch (error) {
      console.error('Error fetching stages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStage = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Stage name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const maxOrder = Math.max(...stages.map(s => s.order_index), 0);
      
      const { error } = await supabase
        .from('custom_stages')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim(),
          order_index: maxOrder + 1,
          is_default: false,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stage created successfully",
      });

      setShowCreateDialog(false);
      setFormData({ name: "", description: "" });
      fetchStages();
    } catch (error) {
      console.error('Error creating stage:', error);
      toast({
        title: "Error",
        description: "Failed to create stage",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStage = async () => {
    if (!editingStage || !formData.name.trim()) return;

    try {
      const { error } = await supabase
        .from('custom_stages')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim(),
        })
        .eq('id', editingStage.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stage updated successfully",
      });

      setEditingStage(null);
      setFormData({ name: "", description: "" });
      fetchStages();
    } catch (error) {
      console.error('Error updating stage:', error);
      toast({
        title: "Error",
        description: "Failed to update stage",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStage = async (stage: CustomStage) => {
    if (stage.is_default) {
      toast({
        title: "Error",
        description: "Cannot delete default stages",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_stages')
        .delete()
        .eq('id', stage.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stage deleted successfully",
      });

      fetchStages();
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast({
        title: "Error",
        description: "Failed to delete stage",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (stage: CustomStage) => {
    setEditingStage(stage);
    setFormData({
      name: stage.name,
      description: stage.description || "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Application Stages</h2>
          <p className="text-muted-foreground">
            Manage the stages students go through in their application journey
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Stage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Stage</DialogTitle>
              <DialogDescription>
                Add a custom stage to your application workflow
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stage-name">Stage Name</Label>
                <Input
                  id="stage-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Interview Scheduled"
                />
              </div>
              <div>
                <Label htmlFor="stage-description">Description</Label>
                <Textarea
                  id="stage-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this stage"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateStage}>
                Create Stage
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-48"></div>
                  </div>
                  <div className="h-8 w-16 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <Card key={stage.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{stage.name}</h3>
                        {stage.is_default && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      {stage.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {stage.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(stage)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!stage.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStage(stage)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingStage} onOpenChange={(open) => !open && setEditingStage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stage</DialogTitle>
            <DialogDescription>
              Update the stage details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-stage-name">Stage Name</Label>
              <Input
                id="edit-stage-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Interview Scheduled"
              />
            </div>
            <div>
              <Label htmlFor="edit-stage-description">Description</Label>
              <Textarea
                id="edit-stage-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this stage"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStage(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStage}>
              Update Stage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StageManagement;