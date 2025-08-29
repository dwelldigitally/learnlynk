
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentPortalService, StudentPortalContent, StudentPortalConfig } from '@/services/studentPortalService';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Content hooks
export function usePortalContent() {
  return useQuery({
    queryKey: ['portal-content'],
    queryFn: StudentPortalService.getPortalContent,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePublishedContent() {
  return useQuery({
    queryKey: ['published-content'],
    queryFn: StudentPortalService.getPublishedContent,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useContentMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createContent = useMutation({
    mutationFn: StudentPortalService.createPortalContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-content'] });
      queryClient.invalidateQueries({ queryKey: ['published-content'] });
      toast({
        title: "Content Created",
        description: "Portal content has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateContent = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StudentPortalContent> }) =>
      StudentPortalService.updatePortalContent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-content'] });
      queryClient.invalidateQueries({ queryKey: ['published-content'] });
      toast({
        title: "Content Updated",
        description: "Portal content has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteContent = useMutation({
    mutationFn: StudentPortalService.deletePortalContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-content'] });
      queryClient.invalidateQueries({ queryKey: ['published-content'] });
      toast({
        title: "Content Deleted",
        description: "Portal content has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    createContent,
    updateContent,
    deleteContent,
  };
}

// Configuration hooks
export function usePortalConfig() {
  return useQuery({
    queryKey: ['portal-config'],
    queryFn: StudentPortalService.getPortalConfig,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useConfigMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveConfig = useMutation({
    mutationFn: StudentPortalService.createOrUpdatePortalConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-config'] });
      toast({
        title: "Configuration Saved",
        description: "Portal configuration has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    saveConfig,
  };
}

// Real-time hooks (simplified to only include existing subscriptions)
export function useRealTimePortalUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const contentSub = StudentPortalService.subscribeToContentChanges(() => {
      queryClient.invalidateQueries({ queryKey: ['portal-content'] });
      queryClient.invalidateQueries({ queryKey: ['published-content'] });
    });

    const configSub = StudentPortalService.subscribeToConfigChanges(() => {
      queryClient.invalidateQueries({ queryKey: ['portal-config'] });
    });

    return () => {
      contentSub.unsubscribe();
      configSub.unsubscribe();
    };
  }, [queryClient]);
}
