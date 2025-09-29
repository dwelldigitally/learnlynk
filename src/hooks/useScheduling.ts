import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { SchedulingService } from '@/services/schedulingService';
import { 
  StudentBatch, 
  SmartAssignmentSuggestion, 
  BatchAssignmentRequest,
  SchedulingSession 
} from '@/types/scheduling';

export function useStudentBatches(userId: string) {
  return useQuery({
    queryKey: ['student-batches', userId],
    queryFn: () => SchedulingService.getBatches(userId),
    enabled: !!userId,
  });
}

export function useBatchStudents(batchId: string) {
  return useQuery({
    queryKey: ['batch-students', batchId],
    queryFn: () => SchedulingService.getBatchStudents(batchId),
    enabled: !!batchId,
  });
}

export function useUnassignedStudents(userId: string) {
  return useQuery({
    queryKey: ['unassigned-students', userId],
    queryFn: () => SchedulingService.getUnassignedStudents(userId),
    enabled: !!userId,
  });
}

export function useSiteCapacity(userId: string) {
  return useQuery({
    queryKey: ['site-capacity', userId],
    queryFn: () => SchedulingService.getSiteCapacity(userId),
    enabled: !!userId,
  });
}

export function useAvailableSites(programId: string, userId: string) {
  return useQuery({
    queryKey: ['available-sites', programId, userId],
    queryFn: () => SchedulingService.getAvailableSites(programId, userId),
    enabled: !!programId && !!userId,
  });
}

export function useSchedulingSessions(userId: string) {
  return useQuery({
    queryKey: ['scheduling-sessions', userId],
    queryFn: () => SchedulingService.getSchedulingSessions(userId),
    enabled: !!userId,
  });
}

export function useSmartAssignments(batchId: string) {
  return useQuery({
    queryKey: ['smart-assignments', batchId],
    queryFn: () => SchedulingService.generateSmartAssignments(batchId),
    enabled: !!batchId,
  });
}

// Mutations
export function useStudentBatchMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createBatch = useMutation({
    mutationFn: (batchData: Omit<StudentBatch, 'id' | 'created_at' | 'updated_at'>) =>
      SchedulingService.createBatch(batchData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['student-batches'] });
      toast({
        title: 'Batch Created',
        description: `Batch "${data.batch_name}" has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create batch. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const addStudentsToBatch = useMutation({
    mutationFn: ({ batchId, assignmentIds }: { batchId: string; assignmentIds: string[] }) =>
      SchedulingService.addStudentsToBatch(batchId, assignmentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batch-students'] });
      queryClient.invalidateQueries({ queryKey: ['unassigned-students'] });
      toast({
        title: 'Students Added',
        description: 'Students have been added to the batch successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add students to batch. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    createBatch,
    addStudentsToBatch,
  };
}

export function useSchedulingMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const executeBatchAssignment = useMutation({
    mutationFn: (request: BatchAssignmentRequest) =>
      SchedulingService.executeBatchAssignment(request),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['practicum-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['site-capacity'] });
      queryClient.invalidateQueries({ queryKey: ['batch-students'] });
      
      if (result.conflicts.length > 0) {
        toast({
          title: 'Batch Assignment Completed with Issues',
          description: `${result.successful} assignments completed successfully. ${result.conflicts.length} conflicts detected.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Batch Assignment Successful',
          description: `All ${result.successful} students have been assigned successfully.`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Assignment Failed',
        description: 'Failed to execute batch assignment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const createSchedulingSession = useMutation({
    mutationFn: (sessionData: Omit<SchedulingSession, 'id' | 'started_at'>) =>
      SchedulingService.createSchedulingSession(sessionData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['scheduling-sessions'] });
      toast({
        title: 'Scheduling Session Started',
        description: `Session "${data.session_name}" has been started.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to start scheduling session. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    executeBatchAssignment,
    createSchedulingSession,
  };
}