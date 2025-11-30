import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ComposeMessageModal } from './ComposeMessageModal';
import { LeadSelector } from './LeadSelector';
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { MessageDetailModal } from './modals/MessageDetailModal';
import { CommunicationSettingsModal } from './modals/CommunicationSettingsModal';
import { AITemplateAssistant } from './AITemplateAssistant';
import { PageHeader } from '@/components/modern/PageHeader';
import { EmailPreviewModal } from './templates/EmailPreviewModal';
import { 
  HotSheetTabsList, 
  HotSheetTabsTrigger,
  PillButton,
} from '@/components/hotsheet';
import { 
  CommunicationHubStats,
  EmailTemplatesSection,
  SMSTemplatesSection,
  MessagesSection,
  CreateTemplateDialog,
} from './communication-hub';
import { 
  Send, 
  Mail, 
  MessageSquare,
  Settings,
  FileText,
  Sparkles,
} from "lucide-react";
import { useConditionalCommunications } from "@/hooks/useConditionalCommunications";
import { CommunicationTemplate, TemplateFormData, AttachmentMetadata } from '@/types/leadEnhancements';
import { CommunicationTemplateService } from '@/services/communicationTemplateService';
import { supabase } from '@/integrations/supabase/client';

const CommunicationHub: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [messageDetailOpen, setMessageDetailOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showLeadSelector, setShowLeadSelector] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Template management state
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'generate' | 'improve'>('generate');
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);
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
    priority: "normal",
    assignedTo: "System",
    program: "Unknown",
    channel: comm.type
  }));

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  const handleCreateNew = () => {
    setEditingTemplate(null);
    reset();
    setShowCreateDialog(true);
  };

  const handleDialogReset = () => {
    setEditingTemplate(null);
    reset();
  };

  const emailTemplates = templates.filter(t => t.type === 'email');
  const smsTemplates = templates.filter(t => t.type === 'sms');

  return (
    <div className="space-y-8 p-6 md:p-9">
      {/* Header */}
      <PageHeader
        title="Communication Hub"
        subtitle="Manage all student communications in one place"
        action={
          <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-3`}>
            <PillButton 
              variant="primary"
              className={isMobile ? 'w-full' : ''}
              onClick={() => setShowLeadSelector(true)}
            >
              <Send className="w-4 h-4" />
              Send Message
            </PillButton>
            <PillButton 
              variant="outline"
              className={isMobile ? 'w-full' : ''}
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </PillButton>
            <PillButton 
              variant="soft"
              className={isMobile ? 'w-full' : ''}
              onClick={() => window.location.href = '/admin/communication/ai-emails'}
            >
              <Sparkles className="w-4 h-4" />
              {isMobile ? 'AI Emails' : 'AI Email Management'}
            </PillButton>
          </div>
        }
      />

      {/* Stats Cards */}
      <CommunicationHubStats
        unreadCount={messages.filter(m => m.status === 'unread').length}
        totalMessages={messages.length}
        templatesCount={templates.length}
        repliedCount={messages.filter(m => m.status === 'replied').length}
      />

      {/* Main Tabs */}
      <Tabs defaultValue="messages" className="space-y-6">
        <HotSheetTabsList className={isMobile ? 'w-full' : 'w-auto'}>
          <HotSheetTabsTrigger value="messages">
            <Mail className="w-4 h-4" />
            Messages
          </HotSheetTabsTrigger>
          <HotSheetTabsTrigger value="email-templates">
            <FileText className="w-4 h-4" />
            Email Templates
          </HotSheetTabsTrigger>
          <HotSheetTabsTrigger value="sms-templates">
            <MessageSquare className="w-4 h-4" />
            SMS Templates
          </HotSheetTabsTrigger>
        </HotSheetTabsList>

        <TabsContent value="messages" className="mt-6">
          <MessagesSection
            messages={messages}
            filteredMessages={filteredMessages}
            selectedMessages={selectedMessages}
            setSelectedMessages={setSelectedMessages}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onMessageClick={handleMessageClick}
            onBulkAction={handleBulkAction}
            isLoading={commsLoading}
            showEmptyState={showEmptyState}
            hasDemoAccess={hasDemoAccess}
            hasRealData={hasRealData}
          />
        </TabsContent>

        <TabsContent value="email-templates" className="mt-6">
          <EmailTemplatesSection
            templates={emailTemplates}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            onDuplicate={handleDuplicateTemplate}
            onAIImprove={handleAIImprove}
            onAIGenerate={handleAIGenerate}
            onCreateNew={handleCreateNew}
          />
        </TabsContent>

        <TabsContent value="sms-templates" className="mt-6">
          <SMSTemplatesSection
            templates={smsTemplates}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            onDuplicate={handleDuplicateTemplate}
            onAIImprove={handleAIImprove}
            onAIGenerate={handleAIGenerate}
            onCreateNew={handleCreateNew}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateTemplateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        isEditing={!!editingTemplate}
        isCreating={isCreating}
        currentUserId={currentUserId}
        register={register}
        setValue={setValue}
        watch={watch}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onPreview={() => setShowPreviewModal(true)}
        onReset={handleDialogReset}
      />

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
