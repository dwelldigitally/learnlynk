import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ComposeMessageModal } from './ComposeMessageModal';
import { LeadSelector } from './LeadSelector';
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { MessageDetailModal } from './modals/MessageDetailModal';
import { AutomationBuilderModal } from './modals/AutomationBuilderModal';
import { CommunicationSettingsModal } from './modals/CommunicationSettingsModal';
import { AITemplateAssistant } from './AITemplateAssistant';
import { 
  MessageSquare, 
  Send, 
  Mail, 
  Phone,
  Search,
  Plus,
  Settings,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
  Zap,
  FileText,
  Copy,
  Trash2,
  Code,
  Sparkles,
  Wand2,
  Reply
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConditionalCommunications } from "@/hooks/useConditionalCommunications";
import { ConditionalDataWrapper } from "./ConditionalDataWrapper";
import { CommunicationTemplate, TemplateFormData, TEMPLATE_VARIABLES, AttachmentMetadata } from '@/types/leadEnhancements';
import { CommunicationTemplateService } from '@/services/communicationTemplateService';
import { EmailContentEditor } from './templates/EmailContentEditor';
import { AttachmentUploader } from './templates/AttachmentUploader';
import { EmailPreviewModal } from './templates/EmailPreviewModal';
import { supabase } from '@/integrations/supabase/client';

const CommunicationHub: React.FC = () => {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [selectedAutomation, setSelectedAutomation] = useState<any>(null);
  const [messageDetailOpen, setMessageDetailOpen] = useState(false);
  const [automationBuilderOpen, setAutomationBuilderOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showLeadSelector, setShowLeadSelector] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Template management state
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'generate' | 'improve'>('generate');
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<CommunicationTemplate | null>(null);
  const [activeTemplateTab, setActiveTemplateTab] = useState('email');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const { toast } = useToast();
  
  const { data: communications, isLoading: commsLoading, showEmptyState, hasDemoAccess, hasRealData } = useConditionalCommunications();

  const { register, handleSubmit, reset, setValue, watch } = useForm<TemplateFormData>({
    defaultValues: {
      type: 'email',
      content_format: 'plain',
      attachments: [],
    }
  });

  const watchedContent = watch('content');
  const watchedHtmlContent = watch('html_content');
  const watchedContentFormat = watch('content_format') || 'plain';
  const watchedAttachments = watch('attachments') || [];
  const watchedSubject = watch('subject');
  const watchedType = watch('type');

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    loadUser();
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await CommunicationTemplateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Transform communications data to match expected message format
  const messages = communications.map(comm => ({
    id: comm.id,
    studentName: comm.studentId || "Student",
    subject: comm.subject,
    message: comm.content,
    timestamp: new Date(comm.sentAt || Date.now()).toISOString(),
    status: comm.status,
    priority: "normal", // Default priority
    assignedTo: "System",
    program: "Unknown",
    channel: comm.type
  }));

  const automations = [
    {
      id: "1",
      name: "Welcome Email Sequence",
      trigger: "New application submitted",
      status: "active",
      lastSent: "2 hours ago",
      recipients: 25
    },
    {
      id: "2",
      name: "Document Reminder",
      trigger: "7 days after document request",
      status: "active", 
      lastSent: "1 day ago",
      recipients: 12
    },
    {
      id: "3",
      name: "Payment Due Reminder",
      trigger: "3 days before payment deadline",
      status: "paused",
      lastSent: "5 days ago",
      recipients: 0
    }
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
    setMessageDetailOpen(true);
  };

  const handleCreateAutomation = () => {
    setSelectedAutomation(null);
    setAutomationBuilderOpen(true);
  };

  const handleEditAutomation = (automation: any) => {
    setSelectedAutomation(automation);
    setAutomationBuilderOpen(true);
  };

  const handleBulkAction = (action: string) => {
    if (selectedMessages.length === 0) {
      toast({
        title: "No messages selected",
        description: "Please select messages to perform bulk actions.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Bulk Action Applied",
      description: `${action} applied to ${selectedMessages.length} messages.`
    });
    
    setSelectedMessages([]);
  };

  const handleLeadSelect = (lead: any) => {
    console.log('handleLeadSelect called with lead:', lead);
    setSelectedLead(lead);
    setShowLeadSelector(false);
    setShowComposeModal(true);
  };

  // Template management functions
  const onSubmit = async (data: TemplateFormData) => {
    setIsCreating(true);
    try {
      if (editingTemplate) {
        const updatedTemplate = await CommunicationTemplateService.updateTemplate(editingTemplate.id, data);
        setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        setEditingTemplate(null);
      } else {
        const newTemplate = await CommunicationTemplateService.createTemplate(data);
        setTemplates(prev => [newTemplate, ...prev]);
      }
      setShowCreateDialog(false);
      reset();
      toast({
        title: "Success",
        description: editingTemplate ? "Template updated successfully" : "Template created successfully",
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTemplate = (template: CommunicationTemplate) => {
    setEditingTemplate(template);
    setValue('name', template.name);
    setValue('type', template.type);
    setValue('subject', template.subject || '');
    setValue('content', template.content);
    setValue('html_content', (template as any).html_content || '');
    setValue('content_format', (template as any).content_format || 'plain');
    setValue('attachments', ((template as any).attachments as AttachmentMetadata[]) || []);
    setShowCreateDialog(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await CommunicationTemplateService.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateTemplate = async (template: CommunicationTemplate) => {
    try {
      const duplicateData: TemplateFormData = {
        name: `${template.name} (Copy)`,
        type: template.type,
        subject: template.subject || '',
        content: template.content,
      };
      const newTemplate = await CommunicationTemplateService.createTemplate(duplicateData);
      setTemplates(prev => [newTemplate, ...prev]);
      toast({
        title: "Success",
        description: "Template duplicated successfully",
      });
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive",
      });
    }
  };

  const insertVariable = (variable: string) => {
    const content = watchedContent || '';
    const newContent = content + (content ? ' ' : '') + variable;
    setValue('content', newContent);
  };

  const handleAIGenerate = () => {
    setAiMode('generate');
    setEditingTemplate(null);
    setIsAIAssistantOpen(true);
  };

  const handleAIImprove = (template: CommunicationTemplate) => {
    setAiMode('improve');
    setEditingTemplate(template);
    setIsAIAssistantOpen(true);
  };

  const handleAISave = async (templateData: any) => {
    try {
      if (editingTemplate && aiMode === 'improve') {
        await CommunicationTemplateService.updateTemplate(editingTemplate.id, templateData);
        toast({
          title: "Success",
          description: "Template improved successfully!",
        });
      } else {
        await CommunicationTemplateService.createTemplate(templateData);
        toast({
          title: "Success",
          description: "AI template created successfully!",
        });
      }
      loadTemplates();
    } catch (error) {
      console.error('Error saving AI template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread": return "destructive";
      case "replied": return "default";
      case "in-progress": return "secondary";
      case "resolved": return "outline";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "normal": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const emailTemplates = templates.filter(t => t.type === 'email');
  const smsTemplates = templates.filter(t => t.type === 'sms');

  return (
    <div className="space-y-6 px-6">{/* Added padding to communication hub */}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Communication Hub</h1>
          <p className="text-muted-foreground">Manage messages, templates, and automations in one place</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => setShowLeadSelector(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/admin/communication/ai-emails'}
          className="mb-4"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Go to AI Email Management
        </Button>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search messages..." 
                        className="pl-10" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedMessages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('Mark as Read')}
                    >
                      Mark as Read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('Assign')}
                    >
                      Assign
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Messages ({filteredMessages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ConditionalDataWrapper
                isLoading={commsLoading}
                showEmptyState={showEmptyState}
                hasDemoAccess={hasDemoAccess}
                hasRealData={hasRealData}
                emptyTitle="No Communications"
                emptyDescription="Student communications will appear here."
                loadingRows={5}
              >
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow 
                      key={message.id} 
                      className={`cursor-pointer hover:bg-accent/50 ${message.status === 'unread' ? 'bg-blue-50' : ''}`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMessages([...selectedMessages, message.id]);
                            } else {
                              setSelectedMessages(selectedMessages.filter(id => id !== message.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{message.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{message.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{message.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{message.message}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {message.channel === 'email' ? (
                            <Mail className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          )}
                          <span className="text-sm capitalize">{message.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(message.status)}>
                          {message.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(message.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </ConditionalDataWrapper>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleAIGenerate}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={(open) => {
                setShowCreateDialog(open);
                if (!open) {
                  setEditingTemplate(null);
                  reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTemplate ? 'Edit Template' : 'Create New Template'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Template Name</Label>
                            <Input 
                              {...register('name', { required: true })}
                              placeholder="Enter template name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">Type</Label>
                            <Select onValueChange={(value) => setValue('type', value as any)} defaultValue="email">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {watch('type') === 'email' && (
                          <div>
                            <Label htmlFor="subject">Subject Line</Label>
                            <Input 
                              {...register('subject')}
                              placeholder="Email subject (can include variables)"
                            />
                          </div>
                        )}

                        {watch('type') === 'email' ? (
                          <>
                            <EmailContentEditor
                              content={watchedContent || ''}
                              htmlContent={watchedHtmlContent}
                              contentFormat={watchedContentFormat}
                              onContentChange={(content, htmlContent, format) => {
                                setValue('content', content);
                                if (htmlContent !== undefined) setValue('html_content', htmlContent);
                                if (format) setValue('content_format', format);
                              }}
                              onPreview={() => setShowPreviewModal(true)}
                            />

                            {currentUserId && (
                              <AttachmentUploader
                                attachments={watchedAttachments}
                                onAttachmentsChange={(attachments) => setValue('attachments', attachments)}
                                userId={currentUserId}
                              />
                            )}
                          </>
                        ) : (
                          <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea 
                              {...register('content', { required: true })}
                              placeholder="Template content (use variables like {{first_name}})"
                              rows={10}
                            />
                          </div>
                        )}

                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isCreating}>
                            {isCreating ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
                          </Button>
                        </div>
                      </form>
                    </div>

                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Available Variables
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {TEMPLATE_VARIABLES.map((variable) => (
                            <div key={variable.key} className="space-y-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-xs h-auto py-2"
                                onClick={() => insertVariable(variable.key)}
                              >
                                <span className="font-mono">{variable.key}</span>
                              </Button>
                              <p className="text-xs text-muted-foreground px-2">
                                {variable.description}
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs value={activeTemplateTab} onValueChange={setActiveTemplateTab}>
            <TabsList>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Templates ({emailTemplates.length})
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS Templates ({smsTemplates.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emailTemplates.map((template) => (
                  <Card key={template.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          {template.subject && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Subject: {template.subject}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Used {template.usage_count} times
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {template.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.ai_generated && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                        {template.variables?.map((variable, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAIImprove(template)}
                        >
                          <Wand2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {emailTemplates.length === 0 && (
                  <Card className="col-span-full">
                    <CardContent className="p-8 text-center">
                      <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No email templates yet. Create your first template to get started.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sms" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smsTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          Used {template.usage_count} times
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {template.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.ai_generated && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                        {template.variables?.map((variable, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAIImprove(template)}
                        >
                          <Wand2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {smsTemplates.length === 0 && (
                  <Card className="col-span-full">
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No SMS templates yet. Create your first SMS template to get started.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Communication Automations</CardTitle>
                <Button onClick={handleCreateAutomation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Automation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automations.map((automation) => (
                  <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                    <div>
                      <h3 className="font-medium">{automation.name}</h3>
                      <p className="text-sm text-muted-foreground">Trigger: {automation.trigger}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last sent: {automation.lastSent} • {automation.recipients} recipients
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                        {automation.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAutomation(automation);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Modals */}
      <EmailPreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        subject={watchedSubject}
        content={watchedContent || ''}
        htmlContent={watchedHtmlContent}
        contentFormat={watchedContentFormat}
        attachments={watchedAttachments}
      />

      {messageDetailOpen && selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          isOpen={messageDetailOpen}
          onClose={() => setMessageDetailOpen(false)}
        />
      )}

      {automationBuilderOpen && (
        <AutomationBuilderModal
          automation={selectedAutomation}
          isOpen={automationBuilderOpen}
          onClose={() => setAutomationBuilderOpen(false)}
        />
      )}

      {settingsOpen && (
        <CommunicationSettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {isAIAssistantOpen && (
        <AITemplateAssistant
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          mode={aiMode}
          onSave={handleAISave}
          existingTemplate={editingTemplate || undefined}
        />
      )}

      {showComposeModal && (
        <ComposeMessageModal
          isOpen={showComposeModal}
          onClose={() => setShowComposeModal(false)}
          selectedLead={selectedLead}
        />
      )}

      {showLeadSelector && (
        <LeadSelector
          isOpen={showLeadSelector}
          onClose={() => setShowLeadSelector(false)}
          onSelectLead={handleLeadSelect}
        />
      )}
    </div>
  );
};

export default CommunicationHub;