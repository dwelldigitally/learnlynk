export type AIAgentType = 'finance' | 'admissions' | 'student-services' | 'academic-support' | 'general';

export interface AIAgent {
  id: AIAgentType;
  name: string;
  description: string;
  avatar: string;
  color: string;
  capabilities: string[];
  greeting: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  agentId?: AIAgentType;
  attachments?: MessageAttachment[];
  messageType?: 'text' | 'quick-reply' | 'document-request' | 'system';
  quickReplies?: string[];
  isTyping?: boolean;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'file';
  url: string;
  size?: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  agentId: AIAgentType;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  status: 'active' | 'resolved' | 'pending';
}

export interface ChatContext {
  leadId?: string;
  applicationId?: string;
  documentIds?: string[];
  previousConversations?: string[];
  userProfile?: {
    name: string;
    email: string;
    program?: string;
    stage?: string;
  };
}