import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PracticumService } from '@/services/practicumService';
import type {
  PracticumSite,
  PracticumProgram,
  PracticumJourney,
  PracticumAssignment,
  PracticumRecord,
  PracticumUserRole,
  PracticumSiteInsert,
  PracticumProgramInsert,
  PracticumJourneyInsert,
  PracticumAssignmentInsert,
  PracticumRecordInsert,
  PracticumFilters
} from '@/types/practicum';
import { toast } from 'sonner';

// Site Hooks
export function usePracticumSites(userId: string) {
  return useQuery({
    queryKey: ['practicum-sites', userId],
    queryFn: () => PracticumService.getSites(userId),
    enabled: !!userId
  });
}

export function usePracticumSiteMutations() {
  const queryClient = useQueryClient();

  const createSite = useMutation({
    mutationFn: (siteData: PracticumSiteInsert) => PracticumService.createSite(siteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practicum-sites'] });
      toast.success('Practicum site created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create practicum site');
      console.error('Error creating practicum site:', error);
    }
  });

  const updateSite = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PracticumSiteInsert> }) =>
      PracticumService.updateSite(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practicum-sites'] });
      toast.success('Practicum site updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update practicum site');
      console.error('Error updating practicum site:', error);
    }
  });

  return { createSite, updateSite };
}

// Program Hooks
export function usePracticumPrograms(userId: string) {
  return useQuery({
    queryKey: ['practicum-programs', userId],
    queryFn: async () => {
      try {
        return await PracticumService.getPrograms(userId);
      } catch (error) {
        console.log('Using dummy data for practicum programs');
        return [
          { id: '22222222-2222-2222-2222-222222222222', program_name: 'Health Care Assistant', user_id: userId },
          { id: '22222222-2222-2222-2222-222222222223', program_name: 'Early Childhood Education', user_id: userId },
          { id: '22222222-2222-2222-2222-222222222224', program_name: 'Aviation Technology', user_id: userId },
          { id: '22222222-2222-2222-2222-222222222225', program_name: 'Hospitality Management', user_id: userId },
          { id: '22222222-2222-2222-2222-222222222226', program_name: 'Nursing Assistant', user_id: userId }
        ];
      }
    },
    enabled: !!userId
  });
}

export function usePracticumProgramMutations() {
  const queryClient = useQueryClient();

  const createProgram = useMutation({
    mutationFn: (programData: PracticumProgramInsert) => PracticumService.createProgram(programData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practicum-programs'] });
      toast.success('Practicum program created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create practicum program');
      console.error('Error creating practicum program:', error);
    }
  });

  return { createProgram };
}

// Journey Hooks
export function usePracticumJourneys(userId: string) {
  return useQuery({
    queryKey: ['practicum-journeys', userId],
    queryFn: () => PracticumService.getJourneys(userId),
    enabled: !!userId
  });
}

export function usePracticumJourneyMutations() {
  const queryClient = useQueryClient();

  const createJourney = useMutation({
    mutationFn: (journeyData: PracticumJourneyInsert) => PracticumService.createJourney(journeyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practicum-journeys'] });
      toast.success('Practicum journey created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create practicum journey');
      console.error('Error creating practicum journey:', error);
    }
  });

  return { createJourney };
}

// Assignment Hooks
export function usePracticumAssignments(userId: string, filters?: PracticumFilters) {
  return useQuery({
    queryKey: ['practicum-assignments', userId, filters],
    queryFn: () => PracticumService.getAssignments(userId, filters),
    enabled: !!userId
  });
}

export function usePracticumAssignmentMutations() {
  const queryClient = useQueryClient();

  const createAssignment = useMutation({
    mutationFn: (assignmentData: PracticumAssignmentInsert) => PracticumService.createAssignment(assignmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practicum-assignments'] });
      toast.success('Practicum assignment created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create practicum assignment');
      console.error('Error creating practicum assignment:', error);
    }
  });

  return { createAssignment };
}

// Dashboard Overview Hook
export function usePracticumOverview(userId: string) {
  return useQuery({
    queryKey: ['practicum-overview', userId],
    queryFn: () => PracticumService.getDashboardOverview(userId),
    enabled: !!userId,
    refetchInterval: 30000 // Refresh every 30 seconds
  });
}

// Record Hooks
export function usePracticumRecordMutations() {
  const queryClient = useQueryClient();

  const createRecord = useMutation({
    mutationFn: (recordData: PracticumRecordInsert) => PracticumService.createRecord(recordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practicum-records'] });
      queryClient.invalidateQueries({ queryKey: ['practicum-overview'] });
      toast.success('Practicum record submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit practicum record');
      console.error('Error creating practicum record:', error);
    }
  });

  const approveRecord = useMutation({
    mutationFn: ({ recordId, approverType, approverId, feedback }: {
      recordId: string;
      approverType: 'preceptor' | 'admin';
      approverId: string;
      feedback?: string;
    }) => PracticumService.approveRecord(recordId, approverType, approverId, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practicum-records'] });
      queryClient.invalidateQueries({ queryKey: ['practicum-overview'] });
      toast.success('Record approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve record');
      console.error('Error approving record:', error);
    }
  });

  return { createRecord, approveRecord };
}

// Student Progress Hook
export function useStudentProgress(assignmentId: string) {
  return useQuery({
    queryKey: ['student-progress', assignmentId],
    queryFn: () => PracticumService.getStudentProgress(assignmentId),
    enabled: !!assignmentId
  });
}

// User Role Hooks
export function usePracticumUserRoles(userId: string) {
  return useQuery({
    queryKey: ['practicum-user-roles', userId],
    queryFn: () => PracticumService.getUserRoles(userId),
    enabled: !!userId
  });
}

export function usePracticumUserRoleMutations() {
  const queryClient = useQueryClient();

  const createUserRole = useMutation({
    mutationFn: (roleData: Omit<PracticumUserRole, 'id' | 'created_at' | 'updated_at'>) =>
      PracticumService.createUserRole(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practicum-user-roles'] });
      toast.success('User role created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create user role');
      console.error('Error creating user role:', error);
    }
  });

  return { createUserRole };
}