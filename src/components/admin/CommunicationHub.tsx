import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  const [messageDetailOpen, setMessageDetailOpen] = useState(false);
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
    <div className="space-y-8 p-9">
      {/* Hero Header with Glassmorphism */}
      <div className="bg-gradient-to-r from-card to-card/95 backdrop-blur-sm border border-border/50 rounded-3xl p-8 transition-all duration-500 hover:shadow-xl hover:border-border/80">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <Mail className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Communication Hub
            </h1>
            <p className="text-muted-foreground">Manage all student communications in one place</p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-foreground">
                  {messages.filter(m => m.status === 'unread').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-foreground">{messages.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold text-foreground">{templates.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Replied</p>
                <p className="text-2xl font-bold text-foreground">
                  {messages.filter(m => m.status === 'replied').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center gap-3">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
            onClick={() => setShowLeadSelector(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button 
            variant="outline" 
            className="border-border/50 hover:bg-accent/50"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            className="border-border/50 hover:bg-accent/50"
            onClick={() => window.location.href = '/admin/communication/ai-emails'}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Email Management
          </Button>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <Tabs defaultValue="messages" className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-muted/30 backdrop-blur-xl border border-border/50 rounded-xl">
          <TabsTrigger 
            value="messages" 
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg transition-all duration-300"
          >
            <Mail className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger 
            value="templates"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg transition-all duration-300"
          >
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6 p-9">
          {/* Filter Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-10 bg-background border-border/50 focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <div 
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors ${
                  statusFilter === 'unread' 
                    ? 'bg-primary/10 text-primary border-primary/20' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => setStatusFilter(statusFilter === 'unread' ? 'all' : 'unread')}
              >
                <Mail className="w-3 h-3 inline mr-1" />
                Unread ({messages.filter(m => m.status === 'unread').length})
              </div>
              <div 
                className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => setStatusFilter('replied')}
              >
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Replied
              </div>
              <div 
                className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => setStatusFilter('all')}
              >
                All Messages
              </div>
            </div>

            {selectedMessages.length > 0 && (
              <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                <span className="text-sm text-muted-foreground">{selectedMessages.length} selected</span>
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

          {/* Messages Card List */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Student Messages ({filteredMessages.length})
            </h2>
            <ConditionalDataWrapper
              isLoading={commsLoading}
              showEmptyState={showEmptyState}
              hasDemoAccess={hasDemoAccess}
              hasRealData={hasRealData}
              emptyTitle="No Communications"
              emptyDescription="Student communications will appear here."
              loadingRows={5}
            >
              <div className="space-y-3">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`
                      bg-white/80 backdrop-blur-sm rounded-xl border p-4
                      transition-all duration-300 cursor-pointer group
                      hover:shadow-lg hover:scale-[1.01] hover:border-primary/20
                      ${message.status === 'unread' ? 'border-l-4 border-l-primary bg-primary/5 border-border/50' : 'border-border/50'}
                    `}
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                          className="mt-1"
                        />
                      </div>

                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-medium shadow-sm">
                          {message.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="font-semibold text-foreground">{message.studentName}</h3>
                            <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <div className={`px-2 py-1 rounded-md border text-xs font-medium ${
                              message.channel === 'email' 
                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-600'
                                : 'bg-green-500/10 border-green-500/20 text-green-600'
                            }`}>
                              {message.channel === 'email' ? (
                                <Mail className="w-3 h-3 inline mr-1" />
                              ) : (
                                <MessageSquare className="w-3 h-3 inline mr-1" />
                              )}
                              {message.channel}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {message.message}
                        </p>

                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                            message.status === 'unread' 
                              ? 'bg-red-500/10 text-red-600'
                              : message.status === 'replied'
                              ? 'bg-green-500/10 text-green-600'
                              : message.status === 'in-progress'
                              ? 'bg-yellow-500/10 text-yellow-600'
                              : 'bg-gray-500/10 text-gray-600'
                          }`}>
                            {message.status.replace('-', ' ')}
                          </div>
                        </div>
                      </div>

                      <div 
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Reply className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ConditionalDataWrapper>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6 p-9">
          {/* Templates Header with Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Templates</h2>
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                  onClick={handleAIGenerate}
                >
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  AI Generate
                </Button>
                <Dialog open={showCreateDialog} onOpenChange={(open) => {
                  setShowCreateDialog(open);
                  if (!open) {
                    setEditingTemplate(null);
                    reset();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-border/50">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-border/50">
                    <DialogHeader className="border-b border-border/50 pb-4">
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
                                className="border-border/50"
                              />
                            </div>
                            <div>
                              <Label htmlFor="type">Type</Label>
                              <Select onValueChange={(value) => setValue('type', value as any)} defaultValue="email">
                                <SelectTrigger className="border-border/50">
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
                                className="border-border/50"
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
                                className="border-border/50"
                              />
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={isCreating} className="bg-primary text-primary-foreground">
                              {isCreating ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
                            </Button>
                          </div>
                        </form>
                      </div>

                      <div className="lg:col-span-1">
                        <div className="bg-muted/30 backdrop-blur-sm rounded-xl border border-border/50 p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Code className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-semibold">Available Variables</h3>
                          </div>
                          <div className="space-y-2">
                            {TEMPLATE_VARIABLES.map((variable) => (
                              <div key={variable.key} className="space-y-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start text-xs h-auto py-2 font-mono"
                                  onClick={() => insertVariable(variable.key)}
                                >
                                  {variable.key}
                                </Button>
                                <p className="text-xs text-muted-foreground px-2">
                                  {variable.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Template Type Tabs */}
          <Tabs value={activeTemplateTab} onValueChange={setActiveTemplateTab}>
            <TabsList className="bg-muted/30 backdrop-blur-xl border border-border/50 rounded-xl">
              <TabsTrigger 
                value="email" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg"
              >
                <Mail className="h-4 w-4" />
                Email Templates ({emailTemplates.length})
              </TabsTrigger>
              <TabsTrigger 
                value="sms" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg"
              >
                <MessageSquare className="h-4 w-4" />
                SMS Templates ({smsTemplates.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emailTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:shadow-xl hover:scale-[1.02] hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {template.name}
                        </h3>
                        {template.subject && (
                          <p className="text-xs text-muted-foreground mb-2">
                            Subject: {template.subject}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-medium">
                            <Mail className="w-3 h-3 inline mr-1" />
                            Email
                          </div>
                          {template.ai_generated && (
                            <div className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-medium">
                              <Sparkles className="w-3 h-3 inline mr-1" />
                              AI
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/30">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {template.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.variables?.slice(0, 3).map((variable, idx) => (
                        <div 
                          key={idx}
                          className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono"
                        >
                          {variable}
                        </div>
                      ))}
                      {template.variables && template.variables.length > 3 && (
                        <div className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                          +{template.variables.length - 3} more
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          Used {template.usage_count || 0} times
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleAIImprove(template)}
                        >
                          <Wand2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {emailTemplates.length === 0 && (
                  <div className="col-span-full">
                    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white/80 backdrop-blur-sm rounded-xl border border-border/50">
                      <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                        <Mail className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">No email templates yet</h3>
                      <p className="text-muted-foreground text-center max-w-md mb-6">
                        Create your first email template to streamline your communications.
                      </p>
                      <Button className="bg-primary text-primary-foreground" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Template
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sms" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {smsTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 hover:shadow-xl hover:scale-[1.02] hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {template.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-medium">
                            <MessageSquare className="w-3 h-3 inline mr-1" />
                            SMS
                          </div>
                          {template.ai_generated && (
                            <div className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-medium">
                              <Sparkles className="w-3 h-3 inline mr-1" />
                              AI
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/30">
                      <p className="text-sm text-muted-foreground">
                        {template.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.variables?.slice(0, 3).map((variable, idx) => (
                        <div 
                          key={idx}
                          className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono"
                        >
                          {variable}
                        </div>
                      ))}
                      {template.variables && template.variables.length > 3 && (
                        <div className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                          +{template.variables.length - 3} more
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          Used {template.usage_count || 0} times
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleAIImprove(template)}
                        >
                          <Wand2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {smsTemplates.length === 0 && (
                  <div className="col-span-full">
                    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white/80 backdrop-blur-sm rounded-xl border border-border/50">
                      <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                        <MessageSquare className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">No SMS templates yet</h3>
                      <p className="text-muted-foreground text-center max-w-md mb-6">
                        Create your first SMS template to streamline your text communications.
                      </p>
                      <Button className="bg-primary text-primary-foreground" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Template
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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