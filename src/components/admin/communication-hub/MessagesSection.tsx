import React from 'react';
import { HotSheetCard, PastelBadge, PillButton, IconContainer } from '@/components/hotsheet';
import { getChannelColor, getMessageStatusColor } from '@/components/hotsheet/utils';
import { Input } from '@/components/ui/input';
import { ConditionalDataWrapper } from '../ConditionalDataWrapper';
import { 
  Search, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Reply, 
  Eye,
  Inbox
} from 'lucide-react';

interface Message {
  id: string;
  studentName: string;
  subject: string;
  message: string;
  timestamp: string;
  status: string;
  priority: string;
  assignedTo: string;
  program: string;
  channel: string;
}

interface MessagesSectionProps {
  messages: Message[];
  filteredMessages: Message[];
  selectedMessages: string[];
  setSelectedMessages: (messages: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onMessageClick: (message: Message) => void;
  onBulkAction: (action: string) => void;
  isLoading: boolean;
  showEmptyState: boolean;
  hasDemoAccess: boolean;
  hasRealData: boolean;
}

export function MessagesSection({
  messages,
  filteredMessages,
  selectedMessages,
  setSelectedMessages,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onMessageClick,
  onBulkAction,
  isLoading,
  showEmptyState,
  hasDemoAccess,
  hasRealData,
}: MessagesSectionProps) {
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  const handleCheckboxChange = (messageId: string, checked: boolean) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, messageId]);
    } else {
      setSelectedMessages(selectedMessages.filter(id => id !== messageId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Panel */}
      <HotSheetCard padding="lg">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            className="pl-10 bg-background border-border/40 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === 'unread' 
                ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => setStatusFilter(statusFilter === 'unread' ? 'all' : 'unread')}
          >
            <Mail className="w-3 h-3 inline mr-1.5" />
            Unread ({unreadCount})
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === 'replied' 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => setStatusFilter(statusFilter === 'replied' ? 'all' : 'replied')}
          >
            <CheckCircle className="w-3 h-3 inline mr-1.5" />
            Replied
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === 'all' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            All Messages
          </button>
        </div>

        {selectedMessages.length > 0 && (
          <div className="flex items-center gap-3 pt-4 border-t border-border/30">
            <PastelBadge color="primary" size="sm">
              {selectedMessages.length} selected
            </PastelBadge>
            <PillButton
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('Mark as Read')}
            >
              Mark as Read
            </PillButton>
            <PillButton
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('Assign')}
            >
              Assign
            </PillButton>
          </div>
        )}
      </HotSheetCard>

      {/* Messages List */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Student Messages</h3>
          <PastelBadge color="sky" size="sm">
            {filteredMessages.length} messages
          </PastelBadge>
        </div>

        <ConditionalDataWrapper
          isLoading={isLoading}
          showEmptyState={showEmptyState}
          hasDemoAccess={hasDemoAccess}
          hasRealData={hasRealData}
          emptyTitle="No Communications"
          emptyDescription="Student communications will appear here."
          loadingRows={5}
        >
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <HotSheetCard
                key={message.id}
                hover
                padding="lg"
                className={`cursor-pointer group ${
                  message.status === 'unread' ? 'border-l-4 border-l-primary' : ''
                }`}
                onClick={() => onMessageClick(message)}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div 
                    className="flex-shrink-0 pt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={(e) => handleCheckboxChange(message.id, e.target.checked)}
                      className="w-4 h-4 rounded border-border/60"
                    />
                  </div>

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                      {message.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{message.studentName}</h4>
                        <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <PastelBadge 
                          color={getChannelColor(message.channel)} 
                          size="sm"
                          icon={message.channel === 'email' ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                        >
                          {message.channel}
                        </PastelBadge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {message.message}
                    </p>

                    <PastelBadge 
                      color={getMessageStatusColor(message.status)} 
                      size="sm"
                      dot
                    >
                      {message.status.replace('-', ' ')}
                    </PastelBadge>
                  </div>

                  {/* Quick Actions */}
                  <div 
                    className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PillButton variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Reply className="w-4 h-4" />
                    </PillButton>
                    <PillButton variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </PillButton>
                  </div>
                </div>
              </HotSheetCard>
            ))}
          </div>
        </ConditionalDataWrapper>

        {filteredMessages.length === 0 && !isLoading && !showEmptyState && (
          <HotSheetCard padding="xl" className="flex flex-col items-center justify-center py-16">
            <IconContainer color="sky" size="xl" className="mb-6">
              <Inbox className="w-8 h-8" />
            </IconContainer>
            <h3 className="text-xl font-semibold text-foreground mb-2">No messages found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Try adjusting your search or filters
            </p>
          </HotSheetCard>
        )}
      </div>
    </div>
  );
}
