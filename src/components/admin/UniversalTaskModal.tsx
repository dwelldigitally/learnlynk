import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Search, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UniversalTaskService } from "@/services/universalTaskService";
import { TaskFormData, TaskEntityType, TASK_CATEGORIES, EntityOption } from "@/types/universalTask";

interface UniversalTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: () => void;
  defaultEntityType?: TaskEntityType;
  defaultEntityId?: string;
}

export function UniversalTaskModal({
  open,
  onOpenChange,
  onTaskCreated,
  defaultEntityType,
  defaultEntityId,
}: UniversalTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [entitySearch, setEntitySearch] = useState("");
  const [entityOptions, setEntityOptions] = useState<EntityOption[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<EntityOption | null>(null);
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      category: "general",
      priority: "medium",
      entity_type: defaultEntityType || "lead",
      entity_id: defaultEntityId || "",
      notes: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (open) {
      loadTeamMembers();
      if (defaultEntityId && defaultEntityType) {
        // Set the default entity if provided
        form.setValue("entity_type", defaultEntityType);
        form.setValue("entity_id", defaultEntityId);
      }
    }
  }, [open, defaultEntityId, defaultEntityType]);

  useEffect(() => {
    if (entitySearch && entitySearch.length > 2) {
      searchEntities();
    } else {
      setEntityOptions([]);
    }
  }, [entitySearch, form.watch("entity_type")]);

  const loadTeamMembers = async () => {
    try {
      const members = await UniversalTaskService.getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error("Error loading team members:", error);
    }
  };

  const searchEntities = async () => {
    try {
      const results = await UniversalTaskService.searchEntities(
        entitySearch,
        form.watch("entity_type")
      );
      setEntityOptions(results);
    } catch (error) {
      console.error("Error searching entities:", error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      if (!selectedEntity && !defaultEntityId) {
        toast.error("Please select an entity for this task");
        return;
      }

      const taskData = {
        ...data,
        entity_id: selectedEntity?.id || defaultEntityId || "",
        tags,
      };

      await UniversalTaskService.createTask(taskData);
      
      toast.success("Task created successfully!");
      onTaskCreated?.();
      onOpenChange(false);
      
      // Reset form
      form.reset();
      setSelectedEntity(null);
      setEntitySearch("");
      setTags([]);
      setTagInput("");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a task for any lead, student, or applicant in your system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                {...form.register("title", { required: "Title is required" })}
                placeholder="Enter task title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Enter task description"
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={form.watch("priority")}
                  onValueChange={(value) => form.setValue("priority", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Entity Selection */}
          {!defaultEntityId && (
            <div className="space-y-4">
              <div>
                <Label>Entity Type *</Label>
                <Select
                  value={form.watch("entity_type")}
                  onValueChange={(value) => {
                    form.setValue("entity_type", value as TaskEntityType);
                    setSelectedEntity(null);
                    setEntitySearch("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="applicant">Applicant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select {form.watch("entity_type")} *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={`Search for a ${form.watch("entity_type")}...`}
                    value={entitySearch}
                    onChange={(e) => setEntitySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {entityOptions.length > 0 && (
                  <div className="border border-border rounded-md mt-1 max-h-40 overflow-y-auto bg-background">
                    {entityOptions.map((entity) => (
                      <div
                        key={entity.id}
                        className="p-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedEntity(entity);
                          form.setValue("entity_id", entity.id);
                          setEntitySearch("");
                          setEntityOptions([]);
                        }}
                      >
                        {entity.label}
                      </div>
                    ))}
                  </div>
                )}
                {selectedEntity && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-sm">
                      Selected: {selectedEntity.label}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assignment and Scheduling */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="assigned_to">Assign To</Label>
              <Select
                value={form.watch("assigned_to")}
                onValueChange={(value) => form.setValue("assigned_to", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("due_date") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("due_date") ? (
                        format(new Date(form.watch("due_date")), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("due_date") ? new Date(form.watch("due_date")) : undefined}
                      onSelect={(date) => form.setValue("due_date", date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Reminder Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("reminder_at") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("reminder_at") ? (
                        format(new Date(form.watch("reminder_at")), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("reminder_at") ? new Date(form.watch("reminder_at")) : undefined}
                      onSelect={(date) => form.setValue("reminder_at", date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Tags and Notes */}
          <div className="space-y-4">
            <div>
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" size="sm" onClick={handleAddTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                placeholder="Additional notes or comments"
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}