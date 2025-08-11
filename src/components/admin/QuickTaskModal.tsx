import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Clock, 
  User, 
  Target, 
  AlertCircle, 
  Calendar,
  Tag,
  Users
} from "lucide-react";
import { toast } from "sonner";

interface QuickTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickTaskModal({ open, onOpenChange }: QuickTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const taskTemplates = [
    { id: "follow-up", title: "Follow up with lead", category: "lead_management" },
    { id: "document-review", title: "Review application documents", category: "admissions" },
    { id: "payment-follow", title: "Follow up on payment", category: "finance" },
    { id: "meeting-prep", title: "Prepare for consultation meeting", category: "meetings" },
    { id: "data-entry", title: "Update student records", category: "administration" }
  ];

  const teamMembers = [
    { id: "1", name: "Sarah Johnson", role: "Admissions Officer" },
    { id: "2", name: "Mike Davis", role: "Financial Advisor" },
    { id: "3", name: "Emma Wilson", role: "Program Coordinator" },
    { id: "4", name: "James Brown", role: "Student Advisor" }
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "urgent", label: "Urgent", color: "bg-red-500" }
  ];

  const categories = [
    "lead_management",
    "admissions",
    "finance",
    "meetings",
    "administration",
    "communication",
    "documentation"
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

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    if (!priority) {
      toast.error("Please select a priority level");
      return;
    }

    toast.success("Task created successfully!");
    
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("");
    setAssignee("");
    setDueDate("");
    setCategory("");
    setTags([]);
    setTagInput("");
    onOpenChange(false);
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
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Assign to myself</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
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
                    <SelectItem key={cat} value={cat}>
                      {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}