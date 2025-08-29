import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { StudentPortalIntegrationService } from '@/services/studentPortalIntegrationService';
import { toast } from '@/hooks/use-toast';

// Session hooks
export function useStudentSession(accessToken: string | null) {
  return useQuery({
    queryKey: ['student-session', accessToken],
    queryFn: () => accessToken ? StudentPortalIntegrationService.getCurrentSession(accessToken) : null,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Document hooks
export function useStudentDocuments(sessionId: string | null) {
  return useQuery({
    queryKey: ['student-documents', sessionId],
    queryFn: () => sessionId ? StudentPortalIntegrationService.getStudentDocuments(sessionId) : [],
    enabled: !!sessionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useDocumentUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, leadId, documentData }: {
      sessionId: string;
      leadId: string;
      documentData: {
        document_name: string;
        document_type: string;
        file_size?: number;
        file_path?: string;
        requirement_id?: string;
        metadata?: any;
      };
    }) => StudentPortalIntegrationService.uploadDocument(sessionId, leadId, documentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-documents'] });
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully and is under review.",
      });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Communication hooks
export function useStudentCommunications(leadId: string | null) {
  return useQuery({
    queryKey: ['student-communications', leadId],
    queryFn: () => leadId ? StudentPortalIntegrationService.getStudentCommunications(leadId) : [],
    enabled: !!leadId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, sessionId, messageData }: {
      leadId: string;
      sessionId: string;
      messageData: {
        message_type?: string;
        subject?: string;
        message: string;
        attachments?: any;
        priority?: string;
      };
    }) => StudentPortalIntegrationService.sendMessage(leadId, sessionId, messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-communications'] });
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Send Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => StudentPortalIntegrationService.markMessageAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-communications'] });
    },
  });
}

// Application Progress hooks
export function useApplicationProgress(leadId: string | null) {
  return useQuery({
    queryKey: ['application-progress', leadId],
    queryFn: () => leadId ? StudentPortalIntegrationService.getApplicationProgress(leadId) : null,
    enabled: !!leadId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUpdateApplicationProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, leadId, progressData }: {
      sessionId: string;
      leadId: string;
      progressData: {
        stage?: string;
        substage?: string;
        progress_percentage?: number;
        status?: string;
    requirements_completed?: any;
    requirements_pending?: any;
      };
    }) => StudentPortalIntegrationService.updateApplicationProgress(sessionId, leadId, progressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-progress'] });
      toast({
        title: "Progress Updated",
        description: "Your application progress has been updated.",
      });
    },
  });
}

// Academic Planning hooks
export function useAcademicPlan(leadId: string | null) {
  return useQuery({
    queryKey: ['academic-plan', leadId],
    queryFn: () => leadId ? StudentPortalIntegrationService.getAcademicPlan(leadId) : null,
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateAcademicPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, leadId, planData }: {
      sessionId: string;
      leadId: string;
      planData: {
        program_name?: string;
        intake_date?: string;
        academic_level?: string;
        course_selections?: any;
        prerequisites_status?: any;
        status?: string;
      };
    }) => StudentPortalIntegrationService.updateAcademicPlan(sessionId, leadId, planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-plan'] });
      toast({
        title: "Academic Plan Updated",
        description: "Your academic plan has been updated successfully.",
      });
    },
  });
}

// Fee Payment hooks
export function useStudentPayments(leadId: string | null) {
  return useQuery({
    queryKey: ['student-payments', leadId],
    queryFn: () => leadId ? StudentPortalIntegrationService.getStudentPayments(leadId) : [],
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, leadId, paymentData }: {
      sessionId: string;
      leadId: string;
      paymentData: {
        payment_type: string;
        amount: number;
        currency?: string;
        payment_method?: string;
        payment_reference?: string;
        due_date?: string;
        payment_data?: any;
      };
    }) => StudentPortalIntegrationService.createPayment(sessionId, leadId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-payments'] });
      toast({
        title: "Payment Submitted",
        description: "Your payment has been submitted for processing.",
      });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Notifications hooks
export function useStudentNotifications(leadId: string | null) {
  return useQuery({
    queryKey: ['student-notifications', leadId],
    queryFn: () => leadId ? StudentPortalIntegrationService.getStudentNotifications(leadId) : [],
    enabled: !!leadId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => StudentPortalIntegrationService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notifications'] });
    },
  });
}

// Real-time updates hook
export function useStudentPortalRealtime(leadId: string | null) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!leadId) return;

    const channel = StudentPortalIntegrationService.subscribeToStudentData(
      leadId,
      (payload) => {
        console.log('Real-time update:', payload);
        
        // Invalidate relevant queries based on the table that changed
        switch (payload.table) {
          case 'student_document_uploads':
            queryClient.invalidateQueries({ queryKey: ['student-documents'] });
            break;
          case 'student_portal_communications':
            queryClient.invalidateQueries({ queryKey: ['student-communications'] });
            break;
          case 'student_application_progress':
            queryClient.invalidateQueries({ queryKey: ['application-progress'] });
            break;
          case 'student_portal_notifications':
            queryClient.invalidateQueries({ queryKey: ['student-notifications'] });
            break;
        }
      }
    );

    // Set connection status - just check if channel exists
    setIsConnected(!!channel);

    return () => {
      channel.unsubscribe();
      setIsConnected(false);
    };
  }, [leadId, queryClient]);

  return { isConnected };
}

// Activity tracking hook
export function useActivityTracking(sessionId: string | null) {
  useEffect(() => {
    if (!sessionId) return;

    const updateActivity = () => {
      StudentPortalIntegrationService.updateSessionActivity(sessionId);
    };

    // Update activity every 5 minutes
    const interval = setInterval(updateActivity, 5 * 60 * 1000);

    // Update on user interaction
    const events = ['click', 'keydown', 'scroll', 'mousemove'];
    let lastActivity = Date.now();

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivity > 60 * 1000) { // Update at most once per minute
        updateActivity();
        lastActivity = now;
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [sessionId]);
}