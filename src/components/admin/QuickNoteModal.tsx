import React, { useState } from "react";
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
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface QuickNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickNoteModal({ open, onOpenChange }: QuickNoteModalProps) {
  const [content, setContent] = useState("");
  const [associatedWith, setAssociatedWith] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [noteType, setNoteType] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

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

  const searchResults = [
    { id: "1", name: "Sarah Johnson", type: "Lead", email: "sarah@example.com" },
    { id: "2", name: "Mike Davis", type: "Student", program: "MBA" },
    { id: "3", name: "Biology Program", type: "Program", intake: "Fall 2024" },
    { id: "4", name: "Jane Smith", type: "Lead", email: "jane@example.com" }
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

  const handleSave = () => {
    if (!content.trim()) {
      toast.error("Please enter note content");
      return;
    }

    toast.success("Note saved successfully!");
    
    // Reset form
    setContent("");
    setAssociatedWith("");
    setSearchQuery("");
    setNoteType("");
    setIsPrivate(false);
    setTags([]);
    setTagInput("");
    onOpenChange(false);
  };

  const filteredResults = searchResults.filter(result => 
    result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  placeholder="Search for student, lead, or program..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {searchQuery && (
                <div className="border rounded-lg max-h-32 overflow-y-auto">
                  {filteredResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setAssociatedWith(result.name);
                        setSearchQuery("");
                      }}
                      className="w-full p-2 text-left hover:bg-muted/50 flex items-center space-x-2 border-b last:border-b-0"
                    >
                      <User className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{result.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.type} {result.email && `• ${result.email}`} {result.program && `• ${result.program}`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {associatedWith && (
                <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Associated with: <strong>{associatedWith}</strong></span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAssociatedWith("")}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Note</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}