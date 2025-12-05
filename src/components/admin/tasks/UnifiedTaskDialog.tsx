import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2, Search, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useEntitySearch, SearchEntity } from '@/hooks/useEntitySearch';

interface UnifiedTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId?: string;
  onTaskCreated?: () => void;
  showEntitySearch?: boolean;
}

const quickTemplates = [
  { label: 'Follow up with lead', title: 'Follow up with lead', description: 'Schedule follow-up call or email', taskType: 'follow_up' },
  { label: 'Review application documents', title: 'Review application documents', description: 'Check all submitted documents', taskType: 'research' },
  { label: 'Follow up on payment', title: 'Follow up on payment', description: 'Check payment status and follow up', taskType: 'follow_up' },
  { label: 'Prepare for consultation meeting', title: 'Prepare for consultation meeting', description: 'Prepare materials for consultation', taskType: 'meeting' },
  { label: 'Update student records', title: 'Update student records', description: 'Update lead information in system', taskType: 'other' }
];

export function UnifiedTaskDialog({ 
  open, 
  onOpenChange, 
  leadId,
  onTaskCreated,
  showEntitySearch = false
}: UnifiedTaskDialogProps) {
  const { toast } = useToast();
  const { teamMembers } = useTeamMembers();
  const { results: entityResults, search: searchEntities, clearResults } = useEntitySearch();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [entitySearchQuery, setEntitySearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<SearchEntity | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    task_type: '',
    due_date: '',
    assigned_to: ''
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        setFormData(prev => ({ ...prev, assigned_to: user.id }));
      }
    };
    if (open) {
      fetchCurrentUser();
    }
  }, [open]);

  useEffect(() => {
    if (entitySearchQuery.length >= 2) {
      searchEntities(entitySearchQuery);
    } else {
      clearResults();
    }
  }, [entitySearchQuery, searchEntities, clearResults]);

  const handleTemplateClick = (template: typeof quickTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      task_type: template.taskType
    }));
  };

  const selectEntity = (entity: SearchEntity) => {
    setSelectedEntity(entity);
    setEntitySearchQuery('');
    clearResults();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: '',
      task_type: '',
      due_date: '',
      assigned_to: currentUserId
    });
    setSelectedEntity(null);
    setEntitySearchQuery('');
  };

  const handleCreateTask = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Determine effective leadId (prop or selected entity)
      const effectiveLeadId = leadId || (selectedEntity?.type === 'lead' ? selectedEntity.id : null);

      if (effectiveLeadId) {
        // Create lead-specific task in lead_tasks table
        const { error } = await supabase
          .from('lead_tasks')
          .insert({
            lead_id: effectiveLeadId,
            user_id: user.id,
            title: formData.title,
            description: formData.description || null,
            priority: formData.priority || 'medium',
            task_type: formData.task_type || 'general',
            due_date: formData.due_date || null,
            assigned_to: formData.assigned_to || null,
            status: 'pending'
          });

        if (error) throw error;
      } else {
        // Create universal task in tasks table
        const { error } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            title: formData.title,
            description: formData.description || null,
            category: formData.task_type || 'general',
            priority: formData.priority || 'medium',
            entity_type: selectedEntity?.type || null,
            entity_id: selectedEntity?.id || null,
            due_date: formData.due_date || null,
            assigned_to: formData.assigned_to || null,
            status: 'pending'
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      resetForm();
      onOpenChange(false);
      onTaskCreated?.();
    } catch (err) {
      console.error('Error creating task:', err);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Quick Templates */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              {quickTemplates.map((template, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleTemplateClick(template)}
                  type="button"
                >
                  {template.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Task Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Entity Search (optional) */}
          {showEntitySearch && !leadId && (
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
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
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

            {/* Task Type */}
            <div className="space-y-2">
              <Label>Task Type</Label>
              <Select value={formData.task_type} onValueChange={(value) => setFormData({ ...formData, task_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              <SelectContent>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select value={formData.assigned_to} onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCreateTask} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
