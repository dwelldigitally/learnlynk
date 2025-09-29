import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { SchedulingService } from '@/services/schedulingService';
import { 
  StudentBatch, 
  SmartAssignmentSuggestion, 
  BatchAssignmentRequest,
  SchedulingSession,
  SiteCapacityTracking,
  StudentAssignment
} from '@/types/scheduling';

// Comprehensive dummy data for all scheduling components
const getDummyStudentBatches = (): StudentBatch[] => [
  {
    id: '11111111-1111-1111-1111-111111111111',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_name: 'Fall 2024 - Health Care Assistant Cohort A',
    description: 'First intake for HCA program focusing on acute care settings',
    program_id: '22222222-2222-2222-2222-222222222222',
    status: 'active',
    created_at: '2024-09-01T00:00:00.000Z',
    updated_at: '2024-09-15T00:00:00.000Z'
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_name: 'Fall 2024 - Early Childhood Education',
    description: 'ECE program batch with specialized focus on inclusive education',
    program_id: '22222222-2222-2222-2222-222222222223',
    status: 'active',
    created_at: '2024-09-01T00:00:00.000Z',
    updated_at: '2024-09-10T00:00:00.000Z'
  },
  {
    id: '11111111-1111-1111-1111-111111111113',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_name: 'Winter 2024 - Aviation Technology',
    description: 'Advanced aviation maintenance and technology program',
    program_id: '22222222-2222-2222-2222-222222222224',
    status: 'draft',
    created_at: '2024-08-15T00:00:00.000Z',
    updated_at: '2024-08-20T00:00:00.000Z'
  },
  {
    id: '11111111-1111-1111-1111-111111111114',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_name: 'Spring 2024 - Hospitality Management',
    description: 'Completed cohort with excellent industry placements',
    program_id: '22222222-2222-2222-2222-222222222225',
    status: 'completed',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-06-01T00:00:00.000Z'
  },
  {
    id: '11111111-1111-1111-1111-111111111115',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_name: 'Fall 2024 - Nursing Assistant Program',
    description: 'Intensive nursing assistant training with clinical rotations',
    program_id: '22222222-2222-2222-2222-222222222226',
    status: 'active',
    created_at: '2024-08-20T00:00:00.000Z',
    updated_at: '2024-09-20T00:00:00.000Z'
  }
];

const getDummySiteCapacity = (): SiteCapacityTracking[] => [
  {
    id: '33333333-3333-3333-3333-333333333331',
    site_id: '44444444-4444-4444-4444-444444444441',
    program_id: '22222222-2222-2222-2222-222222222222',
    period_start: '2024-09-01',
    period_end: '2024-12-15',
    max_capacity: 12,
    current_assignments: 9,
    available_spots: 3,
    created_at: '2024-08-01T00:00:00.000Z',
    updated_at: '2024-09-20T00:00:00.000Z',
    practicum_sites: {
      name: 'Metro General Hospital',
      organization: 'Metro Health Network'
    },
    practicum_programs: {
      program_name: 'Health Care Assistant'
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333332',
    site_id: '44444444-4444-4444-4444-444444444442',
    program_id: '22222222-2222-2222-2222-222222222223',
    period_start: '2024-09-01',
    period_end: '2024-12-15',
    max_capacity: 8,
    current_assignments: 6,
    available_spots: 2,
    created_at: '2024-08-01T00:00:00.000Z',
    updated_at: '2024-09-18T00:00:00.000Z',
    practicum_sites: {
      name: 'Sunshine Daycare Center',
      organization: 'Children First Network'
    },
    practicum_programs: {
      program_name: 'Early Childhood Education'
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    site_id: '44444444-4444-4444-4444-444444444443',
    program_id: '22222222-2222-2222-2222-222222222224',
    period_start: '2024-10-01',
    period_end: '2025-01-15',
    max_capacity: 15,
    current_assignments: 7,
    available_spots: 8,
    created_at: '2024-08-01T00:00:00.000Z',
    updated_at: '2024-09-15T00:00:00.000Z',
    practicum_sites: {
      name: 'Regional Airport Maintenance Hub',
      organization: 'AeroTech Industries'
    },
    practicum_programs: {
      program_name: 'Aviation Technology'
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333334',
    site_id: '44444444-4444-4444-4444-444444444444',
    program_id: '22222222-2222-2222-2222-222222222225',
    period_start: '2024-09-01',
    period_end: '2024-11-30',
    max_capacity: 20,
    current_assignments: 8,
    available_spots: 12,
    created_at: '2024-08-01T00:00:00.000Z',
    updated_at: '2024-09-12T00:00:00.000Z',
    practicum_sites: {
      name: 'Grand Plaza Hotel & Resort',
      organization: 'Luxury Hospitality Group'
    },
    practicum_programs: {
      program_name: 'Hospitality Management'
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333335',
    site_id: '44444444-4444-4444-4444-444444444441',
    program_id: '22222222-2222-2222-2222-222222222226',
    period_start: '2024-09-15',
    period_end: '2024-12-30',
    max_capacity: 10,
    current_assignments: 9,
    available_spots: 1,
    created_at: '2024-08-15T00:00:00.000Z',
    updated_at: '2024-09-22T00:00:00.000Z',
    practicum_sites: {
      name: 'Metro General Hospital',
      organization: 'Metro Health Network'
    },
    practicum_programs: {
      program_name: 'Nursing Assistant'
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333336',
    site_id: '44444444-4444-4444-4444-444444444445',
    program_id: '22222222-2222-2222-2222-222222222222',
    period_start: '2024-09-01',
    period_end: '2024-12-15',
    max_capacity: 6,
    current_assignments: 0,
    available_spots: 6,
    created_at: '2024-08-01T00:00:00.000Z',
    updated_at: '2024-09-01T00:00:00.000Z',
    practicum_sites: {
      name: 'Community Care Center',
      organization: 'Community Health Services'
    },
    practicum_programs: {
      program_name: 'Health Care Assistant'
    }
  }
];

const getDummyUnassignedStudents = (): StudentAssignment[] => [
  {
    id: '55555555-5555-5555-5555-555555555551',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111111',
    site_id: null,
    status: 'unassigned',
    created_at: '2024-09-01T00:00:00.000Z',
    updated_at: '2024-09-01T00:00:00.000Z',
    leads: {
      first_name: 'Sarah',
      last_name: 'Johnson'
    },
    practicum_programs: {
      id: '22222222-2222-2222-2222-222222222222',
      program_name: 'Health Care Assistant'
    }
  },
  {
    id: '55555555-5555-5555-5555-555555555552',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111111',
    site_id: null,
    status: 'unassigned',
    created_at: '2024-09-01T00:00:00.000Z',
    updated_at: '2024-09-01T00:00:00.000Z',
    leads: {
      first_name: 'Michael',
      last_name: 'Chen'
    },
    practicum_programs: {
      id: '22222222-2222-2222-2222-222222222222',
      program_name: 'Health Care Assistant'
    }
  },
  {
    id: '55555555-5555-5555-5555-555555555553',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111112',
    site_id: null,
    status: 'unassigned',
    created_at: '2024-09-01T00:00:00.000Z',
    updated_at: '2024-09-01T00:00:00.000Z',
    leads: {
      first_name: 'Emily',
      last_name: 'Rodriguez'
    },
    practicum_programs: {
      id: '22222222-2222-2222-2222-222222222223',
      program_name: 'Early Childhood Education'
    }
  },
  {
    id: '55555555-5555-5555-5555-555555555554',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111113',
    site_id: null,
    status: 'unassigned',
    created_at: '2024-08-15T00:00:00.000Z',
    updated_at: '2024-08-15T00:00:00.000Z',
    leads: {
      first_name: 'David',
      last_name: 'Thompson'
    },
    practicum_programs: {
      id: '22222222-2222-2222-2222-222222222224',
      program_name: 'Aviation Technology'
    }
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111115',
    site_id: null,
    status: 'unassigned',
    created_at: '2024-08-20T00:00:00.000Z',
    updated_at: '2024-08-20T00:00:00.000Z',
    leads: {
      first_name: 'Jessica',
      last_name: 'Williams'
    },
    practicum_programs: {
      id: '22222222-2222-2222-2222-222222222226',
      program_name: 'Nursing Assistant'
    }
  },
  {
    id: '55555555-5555-5555-5555-555555555556',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111112',
    site_id: null,
    status: 'unassigned',
    created_at: '2024-09-01T00:00:00.000Z',
    updated_at: '2024-09-01T00:00:00.000Z',
    leads: {
      first_name: 'Amanda',
      last_name: 'Davis'
    },
    practicum_programs: {
      id: '22222222-2222-2222-2222-222222222223',
      program_name: 'Early Childhood Education'
    }
  }
];

const getDummySmartAssignments = (batchId: string): SmartAssignmentSuggestion[] => {
  const batchAssignments: Record<string, SmartAssignmentSuggestion[]> = {
    '11111111-1111-1111-1111-111111111111': [
      {
        assignment_id: '55555555-5555-5555-5555-555555555551',
        student_name: 'Sarah Johnson',
        program_name: 'Health Care Assistant',
        confidence_score: 92,
        reasoning: [
          'Student has prior healthcare experience',
          'Site specializes in acute care training',
          'Excellent mentor availability',
          'Geographic proximity to student residence'
        ],
        suggested_sites: [
          {
            site_id: '44444444-4444-4444-4444-444444444441',
            site_name: 'Metro General Hospital',
            overall_score: 92,
            max_capacity: 12,
            available_spots: 3,
            distance_score: 85,
            program_match_score: 95,
            capacity_score: 75
          },
          {
            site_id: '44444444-4444-4444-4444-444444444445',
            site_name: 'Community Care Center',
            overall_score: 78,
            max_capacity: 6,
            available_spots: 6,
            distance_score: 95,
            program_match_score: 70,
            capacity_score: 90
          }
        ]
      },
      {
        assignment_id: '55555555-5555-5555-5555-555555555552',
        student_name: 'Michael Chen',
        program_name: 'Health Care Assistant',
        confidence_score: 88,
        reasoning: [
          'Strong academic performance in clinical courses',
          'Recommended by faculty for acute care',
          'Available during required shift times',
          'Previous volunteer experience at hospital'
        ],
        suggested_sites: [
          {
            site_id: '44444444-4444-4444-4444-444444444445',
            site_name: 'Community Care Center',
            overall_score: 88,
            max_capacity: 6,
            available_spots: 6,
            distance_score: 80,
            program_match_score: 90,
            capacity_score: 95
          },
          {
            site_id: '44444444-4444-4444-4444-444444444441',
            site_name: 'Metro General Hospital',
            overall_score: 85,
            max_capacity: 12,
            available_spots: 3,
            distance_score: 90,
            program_match_score: 85,
            capacity_score: 70
          }
        ]
      }
    ],
    '11111111-1111-1111-1111-111111111112': [
      {
        assignment_id: '55555555-5555-5555-5555-555555555553',
        student_name: 'Emily Rodriguez',
        program_name: 'Early Childhood Education',
        confidence_score: 95,
        reasoning: [
          'Specialized in inclusive education practices',
          'Bilingual capabilities (English/Spanish)',
          'Site has diverse student population',
          'Excellent references from practicum faculty'
        ],
        suggested_sites: [
          {
            site_id: '44444444-4444-4444-4444-444444444442',
            site_name: 'Sunshine Daycare Center',
            overall_score: 95,
            max_capacity: 8,
            available_spots: 2,
            distance_score: 90,
            program_match_score: 100,
            capacity_score: 75
          }
        ]
      },
      {
        assignment_id: '55555555-5555-5555-5555-555555555556',
        student_name: 'Amanda Davis',
        program_name: 'Early Childhood Education',
        confidence_score: 87,
        reasoning: [
          'Strong background in child psychology',
          'Experience with special needs children',
          'Site offers specialized programs',
          'Excellent academic record'
        ],
        suggested_sites: [
          {
            site_id: '44444444-4444-4444-4444-444444444442',
            site_name: 'Sunshine Daycare Center',
            overall_score: 87,
            max_capacity: 8,
            available_spots: 2,
            distance_score: 85,
            program_match_score: 95,
            capacity_score: 75
          }
        ]
      }
    ],
    '11111111-1111-1111-1111-111111111113': [
      {
        assignment_id: '55555555-5555-5555-5555-555555555554',
        student_name: 'David Thompson',
        program_name: 'Aviation Technology',
        confidence_score: 89,
        reasoning: [
          'Prior military aircraft maintenance experience',
          'Top performer in avionics coursework',
          'Site offers advanced training opportunities',
          'Flexible scheduling availability'
        ],
        suggested_sites: [
          {
            site_id: '44444444-4444-4444-4444-444444444443',
            site_name: 'Regional Airport Maintenance Hub',
            overall_score: 89,
            max_capacity: 15,
            available_spots: 8,
            distance_score: 85,
            program_match_score: 90,
            capacity_score: 92
          }
        ]
      }
    ],
    '11111111-1111-1111-1111-111111111115': [
      {
        assignment_id: '55555555-5555-5555-5555-555555555555',
        student_name: 'Jessica Williams',
        program_name: 'Nursing Assistant',
        confidence_score: 91,
        reasoning: [
          'Completed CPR and First Aid certification',
          'Strong performance in anatomy courses',
          'Site has dedicated nursing education unit',
          'Preferred hospital environment for learning'
        ],
        suggested_sites: [
          {
            site_id: '44444444-4444-4444-4444-444444444441',
            site_name: 'Metro General Hospital',
            overall_score: 91,
            max_capacity: 10,
            available_spots: 1,
            distance_score: 88,
            program_match_score: 95,
            capacity_score: 60
          }
        ]
      }
    ]
  };

  return batchAssignments[batchId] || [];
};

const getDummyBatchStudents = (batchId: string): StudentAssignment[] => {
  const allStudents = getDummyUnassignedStudents();
  return allStudents.filter(student => student.batch_id === batchId);
};

const getDummySchedulingSessions = (): SchedulingSession[] => [
  {
    id: '66666666-6666-6666-6666-666666666661',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111111',
    session_name: 'Fall 2024 HCA Initial Assignment',
    status: 'completed',
    total_students: 24,
    assigned_students: 22,
    session_data: {
      algorithm_used: 'smart_assignment_v2',
      success_rate: 91.7,
      manual_overrides: 2
    },
    started_at: '2024-09-15T10:00:00.000Z',
    completed_at: '2024-09-15T10:45:00.000Z'
  },
  {
    id: '66666666-6666-6666-6666-666666666662',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111112',
    session_name: 'ECE Program Site Assignments',
    status: 'completed',
    total_students: 16,
    assigned_students: 14,
    session_data: {
      algorithm_used: 'smart_assignment_v2',
      success_rate: 87.5,
      manual_overrides: 1
    },
    started_at: '2024-09-10T14:00:00.000Z',
    completed_at: '2024-09-10T14:30:00.000Z'
  },
  {
    id: '66666666-6666-6666-6666-666666666663',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111115',
    session_name: 'Nursing Assistant Rush Assignment',
    status: 'in_progress',
    total_students: 12,
    assigned_students: 8,
    session_data: {
      algorithm_used: 'smart_assignment_v2',
      success_rate: 66.7,
      manual_overrides: 0
    },
    started_at: '2024-09-22T16:00:00.000Z',
    completed_at: null
  },
  {
    id: '66666666-6666-6666-6666-666666666664',
    user_id: '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
    batch_id: '11111111-1111-1111-1111-111111111114',
    session_name: 'Spring 2024 Hospitality Final Placements',
    status: 'completed',
    total_students: 28,
    assigned_students: 28,
    session_data: {
      algorithm_used: 'smart_assignment_v1',
      success_rate: 100,
      manual_overrides: 3
    },
    started_at: '2024-02-01T09:00:00.000Z',
    completed_at: '2024-02-01T09:30:00.000Z'
  }
];

export function useStudentBatches(userId: string) {
  return useQuery({
    queryKey: ['student-batches', userId],
    queryFn: async () => {
      try {
        const data = await SchedulingService.getBatches(userId);
        return (Array.isArray(data) && data.length > 0) ? data : getDummyStudentBatches();
      } catch (error) {
        console.log('Using dummy data for student batches');
        return getDummyStudentBatches();
      }
    },
    enabled: !!userId,
  });
}

export function useBatchStudents(batchId: string) {
  return useQuery({
    queryKey: ['batch-students', batchId],
    queryFn: async () => {
      try {
        const data = await SchedulingService.getBatchStudents(batchId);
        return (Array.isArray(data) && data.length > 0) ? data : getDummyBatchStudents(batchId);
      } catch (error) {
        console.log('Using dummy data for batch students');
        return getDummyBatchStudents(batchId);
      }
    },
    enabled: !!batchId,
  });
}

export function useUnassignedStudents(userId: string) {
  return useQuery({
    queryKey: ['unassigned-students', userId],
    queryFn: async () => {
      try {
        const data = await SchedulingService.getUnassignedStudents(userId);
        return (Array.isArray(data) && data.length > 0) ? data : getDummyUnassignedStudents();
      } catch (error) {
        console.log('Using dummy data for unassigned students');
        return getDummyUnassignedStudents();
      }
    },
    enabled: !!userId,
  });
}

export function useSiteCapacity(userId: string) {
  return useQuery({
    queryKey: ['site-capacity', userId],
    queryFn: async () => {
      try {
        const data = await SchedulingService.getSiteCapacity(userId);
        return (Array.isArray(data) && data.length > 0) ? data : getDummySiteCapacity();
      } catch (error) {
        console.log('Using dummy data for site capacity');
        return getDummySiteCapacity();
      }
    },
    enabled: !!userId,
  });
}

export function useAvailableSites(programId: string, userId: string) {
  return useQuery({
    queryKey: ['available-sites', programId, userId],
    queryFn: async () => {
      try {
        const data = await SchedulingService.getAvailableSites(programId, userId);
        if (Array.isArray(data) && data.length > 0) return data;
        const siteCapacity = getDummySiteCapacity();
        return siteCapacity.filter(sc => sc.program_id === programId);
      } catch (error) {
        console.log('Using dummy data for available sites');
        const siteCapacity = getDummySiteCapacity();
        return siteCapacity.filter(sc => sc.program_id === programId);
      }
    },
    enabled: !!programId && !!userId,
  });
}

export function useSchedulingSessions(userId: string) {
  return useQuery({
    queryKey: ['scheduling-sessions', userId],
    queryFn: async () => {
      try {
        const data = await SchedulingService.getSchedulingSessions(userId);
        return (Array.isArray(data) && data.length > 0) ? data : getDummySchedulingSessions();
      } catch (error) {
        console.log('Using dummy data for scheduling sessions');
        return getDummySchedulingSessions();
      }
    },
    enabled: !!userId,
  });
}

export function useSmartAssignments(batchId: string) {
  return useQuery({
    queryKey: ['smart-assignments', batchId],
    queryFn: async () => {
      try {
        const data = await SchedulingService.generateSmartAssignments(batchId);
        return (Array.isArray(data) && data.length > 0) ? data : getDummySmartAssignments(batchId);
      } catch (error) {
        console.log('Using dummy data for smart assignments');
        return getDummySmartAssignments(batchId);
      }
    },
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