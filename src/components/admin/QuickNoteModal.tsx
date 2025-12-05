import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  StickyNote, 
  Save, 
  User, 
  Lock, 
  Globe, 
  Tag,
  Search,
  Clock,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useEntitySearch, SearchEntity } from "@/hooks/useEntitySearch";
import { LeadNotesService } from "@/services/leadNotesService";
import { supabase } from "@/integrations/supabase/client";

interface QuickNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteCreated?: () => void;
}

export function QuickNoteModal({ open, onOpenChange, onNoteCreated }: QuickNoteModalProps) {
  const [content, setContent] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<SearchEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteType, setNoteType] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { results: entityResults, search: searchEntities, clearResults } = useEntitySearch();

  // Search entities when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchEntities(searchQuery);
    } else {
      clearResults();
    }
  }, [searchQuery, searchEntities, clearResults]);

  const noteTypes = [
    { value: "general", label: "General Note" },
    { value: "qualification", label: "Qualification Note" },
    { value: "objection", label: "Objection Handling" },
    { value: "interest", label: "Interest Level" },
    { value: "follow_up", label: "Follow-up Required" },
    { value: "meeting", label: "Meeting Notes" },
    { value: "phone_call", label: "Phone Call Notes" }
  ];

  const quickNoteTemplates = [
    "Student showed high interest in program",
    "Needs more information about tuition payment options",
    "Scheduled follow-up call for next week",
    "Documents are complete and ready for review",
    "Requires additional documentation",
    "Payment plan discussed and agreed upon"
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

  const selectTemplate = (template: string) => {
    setContent(template);
  };

  const selectEntity = (entity: SearchEntity) => {
    setSelectedEntity(entity);
    setSearchQuery("");
    clearResults();
  };

  const resetForm = () => {
    setContent("");
    setSelectedEntity(null);
    setSearchQuery("");
    setNoteType("");
    setIsPrivate(false);
    setTags([]);
    setTagInput("");
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please enter note content");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      if (selectedEntity?.type === 'lead' && selectedEntity.id) {
        // Create lead note using LeadNotesService
        await LeadNotesService.createNote(selectedEntity.id, {
          content,
          note_type: (noteType || 'general') as any,
        });
      } else {
        // For non-lead entities or standalone notes, create in lead_notes with null lead_id
        // Or we could create a universal notes table - for now, just show a message
        if (selectedEntity) {
          toast.info("Notes for applicants will be associated when viewing the applicant");
        }
        
        // Create a general note (could be linked to any entity via metadata)
        const { error } = await supabase
          .from('lead_notes')
          .insert({
            lead_id: selectedEntity?.type === 'lead' ? selectedEntity.id : null,
            user_id: user.id,
            content,
            note_type: noteType || 'general',
            is_pinned: false
          });

        if (error) throw error;
      }

      toast.success("Note saved successfully!");
      resetForm();
      onOpenChange(false);
      onNoteCreated?.();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error("Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <StickyNote className="h-5 w-5" />
            <span>Quick Note</span>
            <Badge variant="outline" className="ml-2 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Auto-saved
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Templates */}
          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <div className="grid grid-cols-1 gap-2">
              {quickNoteTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => selectTemplate(template)}
                  className="text-left justify-start text-xs h-auto py-2 px-3"
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>

          {/* Associate with */}
          <div className="space-y-2">
            <Label>Associate with (Optional)</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for student, lead, or applicant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {searchQuery && entityResults.length > 0 && (
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
                          {entity.program && ` • ${entity.program}`}
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
          </div>

          {/* Note Type */}
          <div className="space-y-2">
            <Label>Note Type</Label>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger>
                <SelectValue placeholder="Select note type" />
              </SelectTrigger>
              <SelectContent>
                {noteTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note Content */}
          <div className="space-y-2">
            <Label>Note Content *</Label>
            <Textarea
              placeholder="Enter your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {content.length} characters
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add tag and press Enter"
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

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-2">
              {isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              <div>
                <p className="text-sm font-medium">
                  {isPrivate ? "Private Note" : "Shared Note"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPrivate 
                    ? "Only you can see this note" 
                    : "Visible to team members with access"
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="flex items-center space-x-2">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSubmitting ? "Saving..." : "Save Note"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
