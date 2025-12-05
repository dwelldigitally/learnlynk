import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  User, 
  AlertCircle, 
  Tag,
  Search,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useEntitySearch, SearchEntity } from "@/hooks/useEntitySearch";
import { supabase } from "@/integrations/supabase/client";

interface QuickTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: () => void;
}

export function QuickTaskModal({ open, onOpenChange, onTaskCreated }: QuickTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Entity selection
  const [entityType, setEntityType] = useState<string>("");
  const [selectedEntity, setSelectedEntity] = useState<SearchEntity | null>(null);
  const [entitySearchQuery, setEntitySearchQuery] = useState("");
  
  const { teamMembers, loading: loadingTeam } = useTeamMembers();
  const { results: entityResults, loading: searchingEntities, search: searchEntities } = useEntitySearch();

  // Set default assignee to current user
  useEffect(() => {
    const setDefaultAssignee = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !assignee) {
        setAssignee(user.id);
      }
    };
    if (open) {
      setDefaultAssignee();
    }
  }, [open, assignee]);

  // Search entities when query changes
  useEffect(() => {
    if (entitySearchQuery.length >= 2) {
      searchEntities(entitySearchQuery);
    }
  }, [entitySearchQuery, searchEntities]);

  const taskTemplates = [
    { id: "follow-up", title: "Follow up with lead", category: "follow_up" },
    { id: "document-review", title: "Review application documents", category: "review_documents" },
    { id: "payment-follow", title: "Follow up on payment", category: "approve_payments" },
    { id: "meeting-prep", title: "Prepare for consultation meeting", category: "scheduling" },
    { id: "data-entry", title: "Update student records", category: "administrative" }
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "urgent", label: "Urgent", color: "bg-red-500" }
  ];

  const categories = [
    { value: "general", label: "General Task" },
    { value: "review_documents", label: "Review Documents" },
    { value: "approve_payments", label: "Approve Payments" },
    { value: "follow_up", label: "Follow Up" },
    { value: "communication", label: "Communication" },
    { value: "administrative", label: "Administrative" },
    { value: "academic", label: "Academic Review" },
    { value: "verification", label: "Verification" },
    { value: "scheduling", label: "Scheduling" }
  ];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const loadTemplate = (templateId: string) => {
    const template = taskTemplates.find(t => t.id === templateId);
    if (template) {
      setTitle(template.title);
      setCategory(template.category);
    }
  };

  const selectEntity = (entity: SearchEntity) => {
    setSelectedEntity(entity);
    setEntityType(entity.type);
    setEntitySearchQuery("");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setAssignee("");
    setDueDate("");
    setCategory("");
    setTags([]);
    setTagInput("");
    setEntityType("");
    setSelectedEntity(null);
    setEntitySearchQuery("");
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    if (!priority) {
      toast.error("Please select a priority level");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      // Determine which table to use based on entity type
      if (selectedEntity?.type === 'lead' && selectedEntity.id) {
        // Create lead-specific task
        const { error } = await supabase
          .from('lead_tasks')
          .insert({
            lead_id: selectedEntity.id,
            user_id: user.id,
            title,
            description: description || null,
            priority,
            task_type: category || 'general',
            due_date: dueDate || null,
            assigned_to: assignee === 'self' ? user.id : (assignee || null),
            status: 'pending'
          });

        if (error) throw error;
      } else {
        // Create universal task
        const { error } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            title,
            description: description || null,
            category: category || 'general',
            priority,
            entity_type: selectedEntity?.type || null,
            entity_id: selectedEntity?.id || null,
            due_date: dueDate || null,
            assigned_to: assignee === 'self' ? user.id : (assignee || null),
            status: 'pending',
            tags: tags.length > 0 ? tags : null
          });

        if (error) throw error;
      }

      toast.success("Task created successfully!");
      resetForm();
      onOpenChange(false);
      onTaskCreated?.();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Task</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Templates */}
          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              {taskTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadTemplate(template.id)}
                  className="text-xs"
                >
                  {template.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Task Title */}
          <div className="space-y-2">
            <Label>Task Title *</Label>
            <Input
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Associate with Entity */}
          <div className="space-y-2">
            <Label>Associate with (Optional)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a lead or applicant..."
                value={entitySearchQuery}
                onChange={(e) => setEntitySearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {entitySearchQuery && entityResults.length > 0 && (
              <div className="border rounded-lg max-h-32 overflow-y-auto">
                {entityResults.map((entity) => (
                  <button
                    key={`${entity.type}-${entity.id}`}
                    onClick={() => selectEntity(entity)}
                    className="w-full p-2 text-left hover:bg-muted/50 flex items-center space-x-2 border-b last:border-b-0"
                  >
                    <User className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{entity.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
                        {entity.email && ` • ${entity.email}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedEntity && (
              <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                <User className="h-4 w-4" />
                <span className="text-sm">
                  Associated with: <strong>{selectedEntity.name}</strong> ({selectedEntity.type})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEntity(null)}
                  className="ml-auto h-6 px-2"
                >
                  ×
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${p.color}`} />
                        <span>{p.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select value={assignee} onValueChange={setAssignee} disabled={loadingTeam}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingTeam ? "Loading..." : "Assign to team member"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Assign to myself</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          {member.role && (
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button onClick={addTag} size="sm" variant="outline">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button 
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Priority Indicator */}
          {priority && (
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                This task will be marked as <strong>{priorities.find(p => p.value === priority)?.label}</strong> priority
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isSubmitting} className="flex items-center space-x-2">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>{isSubmitting ? "Creating..." : "Create Task"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
