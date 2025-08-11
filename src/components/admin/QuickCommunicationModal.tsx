import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MessageSquare, 
  Users, 
  Send, 
  Plus, 
  X,
  FileText,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface QuickCommunicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickCommunicationModal({ open, onOpenChange }: QuickCommunicationModalProps) {
  const [activeTab, setActiveTab] = useState("email");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("");
  const [scheduleFor, setScheduleFor] = useState("");

  const emailTemplates = [
    { id: "welcome", name: "Welcome Message", content: "Welcome to our program! We're excited to have you." },
    { id: "reminder", name: "Payment Reminder", content: "This is a friendly reminder about your upcoming payment." },
    { id: "followup", name: "Follow-up", content: "Thank you for your interest. Let's schedule a meeting to discuss next steps." }
  ];

  const recipientGroups = [
    { id: "all-students", name: "All Students", count: 245 },
    { id: "new-leads", name: "New Leads", count: 18 },
    { id: "pending-apps", name: "Pending Applications", count: 32 },
    { id: "overdue", name: "Overdue Payments", count: 7 }
  ];

  const addRecipient = () => {
    if (recipientInput.trim() && !recipients.includes(recipientInput.trim())) {
      setRecipients([...recipients, recipientInput.trim()]);
      setRecipientInput("");
    }
  };

  const removeRecipient = (recipient: string) => {
    setRecipients(recipients.filter(r => r !== recipient));
  };

  const loadTemplate = (templateId: string) => {
    const selectedTemplate = emailTemplates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setSubject(selectedTemplate.name);
      setMessage(selectedTemplate.content);
    }
  };

  const handleSend = () => {
    if (recipients.length === 0) {
      toast.error("Please add at least one recipient");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const action = scheduleFor ? "scheduled" : "sent";
    toast.success(`${activeTab === "email" ? "Email" : "SMS"} ${action} successfully to ${recipients.length} recipient(s)`);
    
    // Reset form
    setRecipients([]);
    setSubject("");
    setMessage("");
    setTemplate("");
    setScheduleFor("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Quick Communication</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>SMS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            {/* Recipients */}
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter email address"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                />
                <Button onClick={addRecipient} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick recipient groups */}
              <div className="flex flex-wrap gap-2">
                {recipientGroups.map((group) => (
                  <Button
                    key={group.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setRecipients([...recipients, group.name])}
                    className="text-xs"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {group.name} ({group.count})
                  </Button>
                ))}
              </div>

              {/* Selected recipients */}
              {recipients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipients.map((recipient) => (
                    <Badge key={recipient} variant="secondary" className="flex items-center space-x-1">
                      <span>{recipient}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeRecipient(recipient)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Use Template (Optional)</Label>
              <Select value={template} onValueChange={(value) => {
                setTemplate(value);
                loadTemplate(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <Label>Schedule (Optional)</Label>
              <Input
                type="datetime-local"
                value={scheduleFor}
                onChange={(e) => setScheduleFor(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            {/* Recipients for SMS */}
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter phone number"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                />
                <Button onClick={addRecipient} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick recipient groups for SMS */}
              <div className="flex flex-wrap gap-2">
                {recipientGroups.map((group) => (
                  <Button
                    key={group.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setRecipients([...recipients, group.name])}
                    className="text-xs"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {group.name} ({group.count})
                  </Button>
                ))}
              </div>

              {/* Selected recipients */}
              {recipients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipients.map((recipient) => (
                    <Badge key={recipient} variant="secondary" className="flex items-center space-x-1">
                      <span>{recipient}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeRecipient(recipient)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* SMS Message */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Enter your SMS message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/160 characters
              </p>
            </div>

            {/* Schedule for SMS */}
            <div className="space-y-2">
              <Label>Schedule (Optional)</Label>
              <Input
                type="datetime-local"
                value={scheduleFor}
                onChange={(e) => setScheduleFor(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} className="flex items-center space-x-2">
            {scheduleFor ? <Clock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            <span>{scheduleFor ? "Schedule" : "Send"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}