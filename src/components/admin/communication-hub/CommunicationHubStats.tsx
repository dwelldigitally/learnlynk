import React from 'react';
import { HotSheetStatCard } from '@/components/hotsheet';
import { IconContainer } from '@/components/hotsheet';
import { Mail, MessageSquare, FileText, CheckCircle, Send, TrendingUp } from 'lucide-react';

interface CommunicationHubStatsProps {
  unreadCount: number;
  totalMessages: number;
  templatesCount: number;
  repliedCount: number;
  sentToday?: number;
  responseRate?: number;
}

export function CommunicationHubStats({
  unreadCount,
  totalMessages,
  templatesCount,
  repliedCount,
  sentToday = 0,
  responseRate = 0,
}: CommunicationHubStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <HotSheetStatCard
        title="Unread Messages"
        value={unreadCount}
        icon={
          <IconContainer color="rose" size="lg">
            <Mail className="w-5 h-5" />
          </IconContainer>
        }
      />
      <HotSheetStatCard
        title="Total Messages"
        value={totalMessages}
        icon={
          <IconContainer color="sky" size="lg">
            <MessageSquare className="w-5 h-5" />
          </IconContainer>
        }
      />
      <HotSheetStatCard
        title="Templates"
        value={templatesCount}
        icon={
          <IconContainer color="violet" size="lg">
            <FileText className="w-5 h-5" />
          </IconContainer>
        }
      />
      <HotSheetStatCard
        title="Replied"
        value={repliedCount}
        icon={
          <IconContainer color="emerald" size="lg">
            <CheckCircle className="w-5 h-5" />
          </IconContainer>
        }
      />
    </div>
  );
}
