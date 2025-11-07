import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface Template {
  id?: string;
  template_name: string;
  template_type: string;
  subject?: string;
  body: string;
  is_active: boolean;
  usage_count?: number;
}

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Omit<Template, 'id' | 'usage_count'>) => void;
  template?: Template;
}

export const TemplateDialog = ({ open, onOpenChange, onSave, template }: TemplateDialogProps) => {
  const [formData, setFormData] = useState<Omit<Template, 'id' | 'usage_count'>>({
    template_name: '',
    template_type: 'email',
    subject: '',
    body: '',
    is_active: true,
  });

  useEffect(() => {
    if (template) {
      setFormData({
        template_name: template.template_name,
        template_type: template.template_type,
        subject: template.subject || '',
        body: template.body,
        is_active: template.is_active,
      });
    } else {
      setFormData({
        template_name: '',
        template_type: 'email',
        subject: '',
        body: '',
        is_active: true,
      });
    }
  }, [template, open]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit Template' : 'Create Communication Template'}</DialogTitle>
          <DialogDescription>
            Create reusable templates for communicating with students.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template_name">Template Name</Label>
              <Input
                id="template_name"
                value={formData.template_name}
                onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                placeholder="Welcome Email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template_type">Type</Label>
              <Select value={formData.template_type} onValueChange={(value) => setFormData({ ...formData, template_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="notification">Portal Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.template_type === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Welcome to our portal!"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Body</Label>
            <RichTextEditor
              content={formData.body}
              onChange={(content) => setFormData({ ...formData, body: content })}
              placeholder="Enter your message template here..."
            />
            <p className="text-xs text-muted-foreground">
              You can use variables: {'{student_name}'}, {'{portal_url}'}, {'{institution_name}'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active</Label>
              <p className="text-sm text-muted-foreground">Make this template available for use</p>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {template ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
