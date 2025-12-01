// HotSheet Color Mapping Utilities

export type PastelColor = 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'indigo' | 'slate' | 'mint' | 'peach' | 'primary';

export const pastelColorClasses: Record<PastelColor, { bg: string; text: string; border: string }> = {
  sky: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  mint: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  peach: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
};

// Lead status to color mapping
export const getLeadStatusColor = (status: string): PastelColor => {
  const statusMap: Record<string, PastelColor> = {
    new: 'sky',
    contacted: 'amber',
    qualified: 'indigo',
    proposal: 'violet',
    negotiation: 'peach',
    won: 'emerald',
    lost: 'rose',
    nurturing: 'mint',
    unresponsive: 'slate',
  };
  return statusMap[status?.toLowerCase()] || 'slate';
};

// Campaign status to color mapping
export const getCampaignStatusColor = (status: string): PastelColor => {
  const statusMap: Record<string, PastelColor> = {
    draft: 'slate',
    active: 'emerald',
    paused: 'amber',
    completed: 'sky',
    scheduled: 'indigo',
    archived: 'rose',
  };
  return statusMap[status?.toLowerCase()] || 'slate';
};

// Communication channel to color mapping
export const getChannelColor = (channel: string): PastelColor => {
  const channelMap: Record<string, PastelColor> = {
    email: 'sky',
    sms: 'emerald',
    call: 'violet',
    whatsapp: 'mint',
    chat: 'indigo',
  };
  return channelMap[channel?.toLowerCase()] || 'slate';
};

// Priority to color mapping
export const getPriorityColor = (priority: string): PastelColor => {
  const priorityMap: Record<string, PastelColor> = {
    high: 'rose',
    critical: 'rose',
    medium: 'amber',
    low: 'emerald',
    normal: 'sky',
  };
  return priorityMap[priority?.toLowerCase()] || 'slate';
};

// Score to color mapping (0-100)
export const getScoreColor = (score: number): PastelColor => {
  if (score >= 80) return 'emerald';
  if (score >= 60) return 'sky';
  if (score >= 40) return 'amber';
  if (score >= 20) return 'peach';
  return 'rose';
};

// Trend direction to color mapping
export const getTrendColor = (trend: 'up' | 'down' | 'neutral'): PastelColor => {
  const trendMap: Record<string, PastelColor> = {
    up: 'emerald',
    down: 'rose',
    neutral: 'slate',
  };
  return trendMap[trend] || 'slate';
};

// Message status to color mapping
export const getMessageStatusColor = (status: string): PastelColor => {
  const statusMap: Record<string, PastelColor> = {
    pending: 'amber',
    sent: 'sky',
    delivered: 'indigo',
    read: 'emerald',
    failed: 'rose',
    replied: 'emerald',
  };
  return statusMap[status?.toLowerCase()] || 'slate';
};

// Application status to color mapping
export const getApplicationStatusColor = (status: string): PastelColor => {
  const statusMap: Record<string, PastelColor> = {
    pending: 'amber',
    reviewing: 'sky',
    approved: 'emerald',
    rejected: 'rose',
    waitlisted: 'violet',
    withdrawn: 'slate',
  };
  return statusMap[status?.toLowerCase()] || 'slate';
};

// Urgency to color mapping (for priority actions)
export const getUrgencyColor = (urgency: 'critical' | 'high' | 'medium'): PastelColor => {
  const urgencyMap: Record<string, PastelColor> = {
    critical: 'rose',
    high: 'peach',
    medium: 'amber',
  };
  return urgencyMap[urgency] || 'slate';
};

// Impact to color mapping (for AI recommendations)
export const getImpactColor = (impact: 'high' | 'medium' | 'low'): PastelColor => {
  const impactMap: Record<string, PastelColor> = {
    high: 'emerald',
    medium: 'sky',
    low: 'slate',
  };
  return impactMap[impact] || 'slate';
};

// Activity type to color mapping
export const getActivityTypeColor = (type: string): PastelColor => {
  const typeMap: Record<string, PastelColor> = {
    lead: 'sky',
    application: 'violet',
    payment: 'emerald',
    task: 'peach',
    communication: 'rose',
    system: 'slate',
  };
  return typeMap[type?.toLowerCase()] || 'slate';
};
