import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RecruiterPortalService } from '@/services/recruiterPortalService';
import { useToast } from '@/hooks/use-toast';
import type { RecruiterPortalContent, RecruiterPortalMessage, RecruiterPortalConfig } from '@/types/recruiterPortal';

// Content hooks
export const useRecruiterPortalContent = () => {
  return useQuery({
    queryKey: ['recruiterPortalContent'],
    queryFn: RecruiterPortalService.getPortalContent,
  });
};

export const usePublishedRecruiterContent = () => {
  return useQuery({
    queryKey: ['publishedRecruiterContent'],
    queryFn: RecruiterPortalService.getPublishedContent,
  });
};

export const useRecruiterContentMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createContent = useMutation({
    mutationFn: RecruiterPortalService.createPortalContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalContent'] });
      queryClient.invalidateQueries({ queryKey: ['publishedRecruiterContent'] });
      toast({
        title: "Success",
        description: "Content created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    },
  });

  const updateContent = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<RecruiterPortalContent> }) =>
      RecruiterPortalService.updatePortalContent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalContent'] });
      queryClient.invalidateQueries({ queryKey: ['publishedRecruiterContent'] });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    },
  });

  const deleteContent = useMutation({
    mutationFn: RecruiterPortalService.deletePortalContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalContent'] });
      queryClient.invalidateQueries({ queryKey: ['publishedRecruiterContent'] });
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    },
  });

  return { createContent, updateContent, deleteContent };
};

// Message hooks
export const useRecruiterPortalMessages = () => {
  return useQuery({
    queryKey: ['recruiterPortalMessages'],
    queryFn: RecruiterPortalService.getPortalMessages,
  });
};

export const useRecruiterMessageMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMessage = useMutation({
    mutationFn: RecruiterPortalService.createPortalMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalMessages'] });
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const updateMessage = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<RecruiterPortalMessage> }) =>
      RecruiterPortalService.updatePortalMessage(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalMessages'] });
      toast({
        title: "Success",
        description: "Message updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: RecruiterPortalService.deletePortalMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalMessages'] });
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    },
  });

  const markAsRead = useMutation({
    mutationFn: ({ id, readBy }: { id: string; readBy: string }) =>
      RecruiterPortalService.markMessageAsRead(id, readBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalMessages'] });
    },
  });

  return { createMessage, updateMessage, deleteMessage, markAsRead };
};

// Configuration hooks
export const useRecruiterPortalConfig = () => {
  return useQuery({
    queryKey: ['recruiterPortalConfig'],
    queryFn: RecruiterPortalService.getPortalConfig,
  });
};

export const useRecruiterConfigMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveConfig = useMutation({
    mutationFn: RecruiterPortalService.createOrUpdatePortalConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalConfig'] });
      toast({
        title: "Success",
        description: "Configuration saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    },
  });

  return { saveConfig };
};

// Real-time updates
export const useRealTimeRecruiterPortalUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const contentChannel = RecruiterPortalService.subscribeToContentChanges(() => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalContent'] });
      queryClient.invalidateQueries({ queryKey: ['publishedRecruiterContent'] });
    });

    const messageChannel = RecruiterPortalService.subscribeToMessageChanges(() => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalMessages'] });
    });

    const configChannel = RecruiterPortalService.subscribeToConfigChanges(() => {
      queryClient.invalidateQueries({ queryKey: ['recruiterPortalConfig'] });
    });

    return () => {
      contentChannel.unsubscribe();
      messageChannel.unsubscribe();
      configChannel.unsubscribe();
    };
  }, [queryClient]);
};