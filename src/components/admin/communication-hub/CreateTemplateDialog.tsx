import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HotSheetCard, PastelBadge, PillButton } from '@/components/hotsheet';
import { EmailContentEditor } from '../templates/EmailContentEditor';
import { AttachmentUploader } from '../templates/AttachmentUploader';
import { Code, Mail, MessageSquare } from 'lucide-react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, UseFormHandleSubmit } from 'react-hook-form';
import { TemplateFormData, TEMPLATE_VARIABLES, AttachmentMetadata } from '@/types/leadEnhancements';

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isCreating: boolean;
  currentUserId: string;
  register: UseFormRegister<TemplateFormData>;
  setValue: UseFormSetValue<TemplateFormData>;
  watch: UseFormWatch<TemplateFormData>;
  handleSubmit: UseFormHandleSubmit<TemplateFormData>;
  onSubmit: (data: TemplateFormData) => Promise<void>;
  onPreview: () => void;
  onReset: () => void;
}

export function CreateTemplateDialog({
  open,
  onOpenChange,
  isEditing,
  isCreating,
  currentUserId,
  register,
  setValue,
  watch,
  handleSubmit,
  onSubmit,
  onPreview,
  onReset,
}: CreateTemplateDialogProps) {
  const watchedContent = watch('content');
  const watchedHtmlContent = watch('html_content');
  const watchedContentFormat = watch('content_format') || 'plain';
  const watchedAttachments = watch('attachments') || [];
  const watchedType = watch('type');

  const insertVariable = (variable: string) => {
    const content = watchedContent || '';
    const newContent = content + (content ? ' ' : '') + variable;
    setValue('content', newContent);
  };

  const handleClose = (openState: boolean) => {
    if (!openState) {
      onReset();
    }
    onOpenChange(openState);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border/40">
        <DialogHeader className="border-b border-border/30 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input 
                    {...register('name', { required: true })}
                    placeholder="Enter template name"
                    className="border-border/40 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    onValueChange={(value) => setValue('type', value as 'email' | 'sms')} 
                    defaultValue="email"
                  >
                    <SelectTrigger className="border-border/40 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          SMS
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {watchedType === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input 
                    {...register('subject')}
                    placeholder="Email subject (can include variables)"
                    className="border-border/40 rounded-xl"
                  />
                </div>
              )}

              {watchedType === 'email' ? (
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
                    onPreview={onPreview}
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
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    {...register('content', { required: true })}
                    placeholder="Template content (use variables like {{first_name}})"
                    rows={10}
                    className="border-border/40 rounded-xl resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {(watchedContent || '').length}/160 characters
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <PillButton 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleClose(false)}
                >
                  Cancel
                </PillButton>
                <PillButton 
                  type="submit" 
                  variant="primary"
                  disabled={isCreating}
                >
                  {isCreating ? 'Saving...' : isEditing ? 'Update Template' : 'Create Template'}
                </PillButton>
              </div>
            </form>
          </div>

          {/* Variables Panel */}
          <div className="lg:col-span-1">
            <HotSheetCard padding="md" className="sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Available Variables</h3>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {TEMPLATE_VARIABLES.map((variable) => (
                  <div key={variable.key} className="space-y-1">
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-xs font-mono text-primary border border-border/30"
                      onClick={() => insertVariable(variable.key)}
                    >
                      {variable.key}
                    </button>
                    <p className="text-xs text-muted-foreground px-1">
                      {variable.description}
                    </p>
                  </div>
                ))}
              </div>
            </HotSheetCard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
