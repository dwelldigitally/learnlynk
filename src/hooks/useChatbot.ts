import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChatbotService } from '@/services/chatbotService';
import { AIAgentType, ChatMessage, ChatConversation, ChatContext } from '@/types/chatbot';
import { useToast } from '@/components/ui/use-toast';

export function useChatbot(leadId?: string) {
  const [internalLeadId, setInternalLeadId] = useState<string | undefined>(leadId);
  const [activeAgent, setActiveAgent] = useState<AIAgentType>('general');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Resolve effective leadId (prop or current user id)
  useEffect(() => {
    setInternalLeadId(leadId);
  }, [leadId]);

  useEffect(() => {
    if (!leadId) {
      supabase.auth.getUser()
        .then(({ data }) => {
          if (data?.user?.id) setInternalLeadId(data.user.id);
        })
        .catch(console.error);
    }
  }, [leadId]);

  // Get conversations
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['chatbot-conversations', internalLeadId],
    queryFn: () => ChatbotService.getConversations(internalLeadId),
    enabled: !!internalLeadId,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Get messages for active conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['chatbot-messages', internalLeadId, activeAgent],
    queryFn: () => internalLeadId ? ChatbotService.getMessages(internalLeadId, activeAgent) : Promise.resolve([]),
    enabled: !!internalLeadId,
    staleTime: 10 * 1000, // 10 seconds
  });

  // Search messages
  const { data: searchResults = [] } = useQuery({
    queryKey: ['chatbot-search', searchQuery, internalLeadId],
    queryFn: () => searchQuery ? ChatbotService.searchConversations(searchQuery, internalLeadId) : Promise.resolve([]),
    enabled: searchQuery.length > 2 && !!internalLeadId,
    staleTime: 60 * 1000, // 1 minute
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ message, context }: { message: string; context?: ChatContext }) => {
      if (!internalLeadId) throw new Error('Lead ID required');
      return ChatbotService.sendMessage(internalLeadId, activeAgent, message, context);
    },
    onMutate: async ({ message }) => {
      // Optimistic update - add user message immediately
      const tempMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        text: message,
        isUser: true,
        timestamp: new Date(),
        agentId: activeAgent,
        messageType: 'text'
      };

      await queryClient.cancelQueries({ queryKey: ['chatbot-messages', internalLeadId, activeAgent] });
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(['chatbot-messages', internalLeadId, activeAgent]);
      
      queryClient.setQueryData<ChatMessage[]>(['chatbot-messages', internalLeadId, activeAgent], old => [
        ...(old || []),
        tempMessage
      ]);

      setIsTyping(true);
      return { previousMessages };
    },
    onSuccess: () => {
      setIsTyping(false);
      // Refresh conversations and messages
      queryClient.invalidateQueries({ queryKey: ['chatbot-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chatbot-messages', internalLeadId, activeAgent] });
    },
    onError: (error, variables, context) => {
      setIsTyping(false);
      if (context?.previousMessages) {
        queryClient.setQueryData(['chatbot-messages', internalLeadId, activeAgent], context.previousMessages);
      }
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (messageIds: string[]) => ChatbotService.markAsRead(messageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-conversations'] });
    },
  });

  // Switch agent
  const switchAgent = useCallback((agentId: AIAgentType) => {
    setActiveAgent(agentId);
    setSearchQuery('');
  }, []);

  // Send message
  const sendMessage = useCallback((message: string, context?: ChatContext) => {
    if (!message.trim()) return;
    sendMessageMutation.mutate({ message, context });
  }, [sendMessageMutation]);

  // Mark conversation as read
  const markConversationAsRead = useCallback((conversationId?: string) => {
    const unreadMessages = messages.filter(msg => !msg.isUser && !msg.id.startsWith('temp-'));
    if (unreadMessages.length > 0) {
      markAsReadMutation.mutate(unreadMessages.map(msg => msg.id));
    }
  }, [messages, markAsReadMutation]);

  // Auto-mark as read when viewing conversation
  useEffect(() => {
    if (messages.length > 0 && internalLeadId) {
      const timer = setTimeout(() => {
        markConversationAsRead();
      }, 2000); // Mark as read after 2 seconds of viewing

      return () => clearTimeout(timer);
    }
  }, [messages, internalLeadId, markConversationAsRead]);

  // Real-time updates via Supabase subscription
  useEffect(() => {
    if (!internalLeadId) return;

    const channel = supabase
      .channel(`chatbot-${internalLeadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'student_portal_communications',
          filter: `lead_id=eq.${internalLeadId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chatbot-conversations'] });
          queryClient.invalidateQueries({ queryKey: ['chatbot-messages', internalLeadId, activeAgent] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [internalLeadId, activeAgent, queryClient]);

  return {
    // Data
    conversations,
    messages,
    searchResults,
    activeAgent,
    searchQuery,
    isTyping,
    
    // Loading states
    loadingConversations,
    loadingMessages,
    sendingMessage: sendMessageMutation.isPending,
    
    // Actions
    switchAgent,
    sendMessage,
    markConversationAsRead,
    setSearchQuery,
    
    // Utils
    unreadCount: conversations.reduce((acc, conv) => acc + conv.unreadCount, 0),
    activeConversation: conversations.find(conv => conv.agentId === activeAgent),
  };
}