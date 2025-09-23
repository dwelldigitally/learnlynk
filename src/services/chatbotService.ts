import { supabase } from '@/integrations/supabase/client';
import { AIAgentType, ChatMessage, ChatConversation, ChatContext } from '@/types/chatbot';

export class ChatbotService {
  /**
   * Get chat conversations for the current user
   */
  static async getConversations(leadId?: string): Promise<ChatConversation[]> {
    const { data, error } = await supabase
      .from('student_portal_communications')
      .select('*')
      .eq(leadId ? 'lead_id' : 'id', leadId || '')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    // Group messages by conversation/agent
    const conversations: Record<string, ChatConversation> = {};
    
    data?.forEach(msg => {
      const agentId = (msg.sender_name?.includes('Finance') ? 'finance' : 
                      msg.sender_name?.includes('Admissions') ? 'admissions' :
                      msg.sender_name?.includes('Student Services') ? 'student-services' :
                      msg.sender_name?.includes('Academic') ? 'academic-support' : 'general') as AIAgentType;
      const conversationId = `${msg.lead_id}-${agentId}`;
      
      if (!conversations[conversationId]) {
        conversations[conversationId] = {
          id: conversationId,
          title: `${this.getAgentName(agentId)} Conversation`,
          agentId,
          lastMessage: msg.message,
          lastMessageAt: new Date(msg.created_at || Date.now()),
          unreadCount: 0,
          status: 'active'
        };
      }
      
      if (!msg.is_read) {
        conversations[conversationId].unreadCount++;
      }
    });

    return Object.values(conversations);
  }

  /**
   * Get messages for a specific conversation
   */
  static async getMessages(leadId: string, agentId: AIAgentType): Promise<ChatMessage[]> {
    const agentName = this.getAgentName(agentId);
    const { data, error } = await supabase
      .from('student_portal_communications')
      .select('*')
      .eq('lead_id', leadId)
      .ilike('sender_name', `%${agentName}%`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return (data || []).map(msg => ({
      id: msg.id,
      text: msg.message,
      isUser: msg.sender_type === 'student',
      timestamp: new Date(msg.created_at || Date.now()),
      agentId: agentId,
      attachments: msg.attachments ? JSON.parse(msg.attachments as string) : undefined,
      messageType: (msg.message_type as 'text' | 'quick-reply' | 'document-request' | 'system') || 'text'
    }));
  }

  /**
   * Send a message to an AI agent
   */
  static async sendMessage(
    leadId: string,
    agentId: AIAgentType,
    message: string,
    context?: ChatContext
  ): Promise<ChatMessage> {
    // Save user message
    const userMessage = await this.saveMessage(leadId, agentId, message, 'student');
    
    // Generate AI response
    const aiResponse = await this.generateAIResponse(agentId, message, context);
    
    // Save AI response
    const aiMessage = await this.saveMessage(leadId, agentId, aiResponse, 'agent');
    
    return aiMessage;
  }

  /**
   * Save a message to the database
   */
  private static async saveMessage(
    leadId: string,
    agentId: AIAgentType,
    message: string,
    senderType: 'student' | 'agent'
  ): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('student_portal_communications')
      .insert({
        lead_id: leadId,
        message,
        sender_type: senderType,
        sender_name: senderType === 'agent' ? this.getAgentName(agentId) : 'Student',
        recipient_type: senderType === 'student' ? 'agent' : 'student',
        message_type: 'text',
        priority: 'normal',
        is_read: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }

    return {
      id: data.id,
      text: data.message,
      isUser: data.sender_type === 'student',
      timestamp: new Date(data.created_at || Date.now()),
      agentId: agentId,
      messageType: 'text' as const
    };
  }

  /**
   * Generate AI response based on agent type and context
   */
  private static async generateAIResponse(
    agentId: AIAgentType,
    userMessage: string,
    context?: ChatContext
  ): Promise<string> {
    // This would integrate with your AI service (OpenAI, etc.)
    // For now, return agent-specific responses
    const responses = this.getAgentResponses(agentId, userMessage, context);
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Get agent-specific responses
   */
  private static getAgentResponses(
    agentId: AIAgentType,
    userMessage: string,
    context?: ChatContext
  ): string[] {
    const message = userMessage.toLowerCase();
    
    switch (agentId) {
      case 'finance':
        if (message.includes('payment') || message.includes('fee')) {
          return [
            "I can help you with payment information. Your current balance is $2,500. Would you like to set up a payment plan?",
            "Let me check your payment status. You have an outstanding balance for tuition. I can help you explore payment options."
          ];
        }
        if (message.includes('scholarship') || message.includes('aid')) {
          return [
            "I'd be happy to help with financial aid information. You may be eligible for several scholarship programs. Let me provide details.",
            "Financial aid applications are currently open. Based on your profile, you might qualify for merit-based scholarships."
          ];
        }
        return [
          "I'm here to help with all your financial questions. I can assist with payments, scholarships, financial aid, and payment plans.",
          "Hello! I can help you understand your tuition costs, payment options, and available financial assistance programs."
        ];

      case 'admissions':
        if (message.includes('application') || message.includes('status')) {
          return [
            "Your application status is currently under review. You've completed 80% of the requirements. You still need to submit your transcript.",
            "Let me check your application progress. You're missing a few documents - I can help you identify exactly what's needed."
          ];
        }
        if (message.includes('program') || message.includes('course')) {
          return [
            "I can provide detailed information about our programs. Which field of study interests you most?",
            "Our programs are designed to meet industry demands. Would you like to know about specific program requirements or career outcomes?"
          ];
        }
        return [
          "Welcome! I'm here to help with your admission journey. I can provide updates on your application, program information, and next steps.",
          "I can assist with application requirements, deadlines, program details, and admission processes. How can I help today?"
        ];

      case 'student-services':
        if (message.includes('housing') || message.includes('dorm')) {
          return [
            "I can help you with housing options. We have several residence halls available. Would you like to see available rooms?",
            "Housing applications are now open. I can show you different accommodation options and help with the application process."
          ];
        }
        if (message.includes('orientation') || message.includes('event')) {
          return [
            "Orientation is scheduled for next month. I'll send you the complete schedule and registration information.",
            "We have several upcoming events for new students. Let me share the calendar with you."
          ];
        }
        return [
          "I'm here to help with student services including housing, meal plans, campus events, and student support resources.",
          "Welcome! I can assist with campus life, student services, events, and connecting you with the right resources."
        ];

      case 'academic-support':
        if (message.includes('course') || message.includes('class')) {
          return [
            "I can help you plan your academic schedule. Based on your program, here are the recommended courses for your first semester.",
            "Let me assist with course selection. I can show you prerequisites, course descriptions, and create an optimal schedule."
          ];
        }
        if (message.includes('advisor') || message.includes('counseling')) {
          return [
            "I can connect you with an academic advisor. They can help with course planning, career guidance, and academic goals.",
            "Academic support services are available to help you succeed. Would you like to schedule a meeting with an advisor?"
          ];
        }
        return [
          "I'm here to support your academic success. I can help with course selection, academic planning, and connecting you with advisors.",
          "Welcome! I can assist with academic planning, course registration, study resources, and academic support services."
        ];

      default:
        return [
          "Hello! I'm here to help you with any questions. I can connect you with specialized agents for finance, admissions, student services, or academic support.",
          "Hi there! How can I assist you today? I can help directly or connect you with the right specialist for your needs."
        ];
    }
  }

  /**
   * Get agent name
   */
  private static getAgentName(agentId: AIAgentType): string {
    const names = {
      'finance': 'Financial Advisor',
      'admissions': 'Admissions Counselor',
      'student-services': 'Student Services',
      'academic-support': 'Academic Advisor',
      'general': 'Assistant'
    };
    return names[agentId];
  }

  /**
   * Mark messages as read
   */
  static async markAsRead(messageIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('student_portal_communications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .in('id', messageIds);

    if (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  /**
   * Search conversations
   */
  static async searchConversations(query: string, leadId?: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('student_portal_communications')
      .select('*')
      .eq(leadId ? 'lead_id' : 'id', leadId || '')
      .ilike('message', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error searching conversations:', error);
      return [];
    }

    return (data || []).map(msg => ({
      id: msg.id,
      text: msg.message,
      isUser: msg.sender_type === 'student',
      timestamp: new Date(msg.created_at || Date.now()),
      agentId: 'general' as AIAgentType,
      messageType: (msg.message_type as 'text' | 'quick-reply' | 'document-request' | 'system') || 'text'
    }));
  }
}