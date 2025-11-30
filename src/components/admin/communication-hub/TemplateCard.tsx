import React from 'react';
import { HotSheetCard, PastelBadge, PillIconButton, IconContainer } from '@/components/hotsheet';
import { Mail, MessageSquare, Sparkles, Edit, Copy, Trash2, Wand2 } from 'lucide-react';
import { CommunicationTemplate } from '@/types/leadEnhancements';

interface TemplateCardProps {
  template: CommunicationTemplate;
  onEdit: (template: CommunicationTemplate) => void;
  onDelete: (templateId: string) => void;
  onDuplicate: (template: CommunicationTemplate) => void;
  onAIImprove: (template: CommunicationTemplate) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDelete,
  onDuplicate,
  onAIImprove,
}: TemplateCardProps) {
  const isEmail = template.type === 'email';
  const channelColor = isEmail ? 'sky' : 'emerald';
  const ChannelIcon = isEmail ? Mail : MessageSquare;

  return (
    <HotSheetCard hover padding="lg" className="group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-2 truncate">
            {template.name}
          </h3>
          {template.subject && (
            <p className="text-xs text-muted-foreground mb-2 truncate">
              Subject: {template.subject}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <PastelBadge color={channelColor} size="sm" icon={<ChannelIcon className="w-3 h-3" />}>
              {isEmail ? 'Email' : 'SMS'}
            </PastelBadge>
            {template.ai_generated && (
              <PastelBadge color="violet" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                AI
              </PastelBadge>
            )}
          </div>
        </div>
        <IconContainer color={channelColor} size="md">
          <ChannelIcon className="w-5 h-5" />
        </IconContainer>
      </div>

      {/* Content Preview */}
      <div className="mb-4 p-4 bg-muted/30 rounded-xl">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {template.content}
        </p>
      </div>

      {/* Variables */}
      {template.variables && template.variables.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {template.variables.slice(0, 3).map((variable, idx) => (
            <PastelBadge key={idx} color="indigo" size="sm">
              {variable}
            </PastelBadge>
          ))}
          {template.variables.length > 3 && (
            <PastelBadge color="slate" size="sm">
              +{template.variables.length - 3} more
            </PastelBadge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <PastelBadge color="slate" size="sm">
          Used {template.usage_count || 0} times
        </PastelBadge>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <PillIconButton
            icon={<Edit className="w-3.5 h-3.5" />}
            size="sm"
            variant="ghost"
            label="Edit template"
            onClick={() => onEdit(template)}
          />
          <PillIconButton
            icon={<Wand2 className="w-3.5 h-3.5" />}
            size="sm"
            variant="ghost"
            label="AI improve"
            onClick={() => onAIImprove(template)}
          />
          <PillIconButton
            icon={<Copy className="w-3.5 h-3.5" />}
            size="sm"
            variant="ghost"
            label="Duplicate template"
            onClick={() => onDuplicate(template)}
          />
          <PillIconButton
            icon={<Trash2 className="w-3.5 h-3.5" />}
            size="sm"
            variant="ghost"
            label="Delete template"
            onClick={() => onDelete(template.id)}
          />
        </div>
      </div>
    </HotSheetCard>
  );
}
