import React from 'react';
import { HotSheetCard, PastelBadge, PillButton, IconContainer } from '@/components/hotsheet';
import { TemplateCard } from './TemplateCard';
import { Mail, Plus, Sparkles } from 'lucide-react';
import { CommunicationTemplate } from '@/types/leadEnhancements';

interface EmailTemplatesSectionProps {
  templates: CommunicationTemplate[];
  onEdit: (template: CommunicationTemplate) => void;
  onDelete: (templateId: string) => void;
  onDuplicate: (template: CommunicationTemplate) => void;
  onAIImprove: (template: CommunicationTemplate) => void;
  onAIGenerate: () => void;
  onCreateNew: () => void;
}

export function EmailTemplatesSection({
  templates,
  onEdit,
  onDelete,
  onDuplicate,
  onAIImprove,
  onAIGenerate,
  onCreateNew,
}: EmailTemplatesSectionProps) {
  if (templates.length === 0) {
    return (
      <HotSheetCard padding="xl" className="flex flex-col items-center justify-center py-16">
        <IconContainer color="sky" size="xl" className="mb-6">
          <Mail className="w-8 h-8" />
        </IconContainer>
        <h3 className="text-xl font-semibold text-foreground mb-2">No email templates yet</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Create your first email template to streamline your communications
        </p>
        <div className="flex items-center gap-3">
          <PillButton variant="primary" onClick={onCreateNew}>
            <Plus className="w-4 h-4" />
            Create Template
          </PillButton>
          <PillButton variant="soft" onClick={onAIGenerate}>
            <Sparkles className="w-4 h-4" />
            AI Generate
          </PillButton>
        </div>
      </HotSheetCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">Email Templates</h3>
          <PastelBadge color="sky" size="sm">
            {templates.length} templates
          </PastelBadge>
        </div>
        <div className="flex items-center gap-2">
          <PillButton variant="soft" size="sm" onClick={onAIGenerate}>
            <Sparkles className="w-4 h-4" />
            AI Generate
          </PillButton>
          <PillButton variant="outline" size="sm" onClick={onCreateNew}>
            <Plus className="w-4 h-4" />
            Create New
          </PillButton>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onAIImprove={onAIImprove}
          />
        ))}
      </div>
    </div>
  );
}
