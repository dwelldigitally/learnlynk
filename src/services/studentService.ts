import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface StudentFilters {
  stage?: string;
  program?: string;
  riskLevel?: string;
  search?: string;
  country?: string;
  city?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StudentsPaginatedResponse {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class StudentService {
  /**
   * Get paginated students with filters and sorting
   */
  static async getStudentsPaginated(
    pagination: PaginationParams,
    filters: StudentFilters = {}
  ): Promise<StudentsPaginatedResponse> {
    const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
    const { stage, program, riskLevel, search, country, city } = filters;

    let query = supabase
      .from('students')
      .select('*', { count: 'exact' });

    // Apply filters
    if (stage) query = query.eq('stage', stage);
    if (program) query = query.eq('program', program);
    if (riskLevel) query = query.eq('risk_level', riskLevel);
    if (country) query = query.eq('country', country);
    if (city) query = query.eq('city', city);

    // Apply search with full-text search
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,student_id.ilike.%${search}%`
      );
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }

    // Keep original database format for compatibility with existing components
    const transformedData = (data || []).map(student => ({
      ...student, // Keep all original fields
      // Add camelCase aliases for backwards compatibility
      studentId: student.student_id,
      firstName: student.first_name,
      lastName: student.last_name,
      acceptanceLikelihood: student.acceptance_likelihood,
      riskLevel: student.risk_level,
      leadScore: student.lead_score,
      createdAt: student.created_at,
      updatedAt: student.updated_at
    }));

    return {
      data: transformedData,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  }

  /**
   * Get all students for the current user (legacy method)
   */
  static async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }

    // Transform database format to match demo data format
    return (data || []).map(student => ({
      id: student.id,
      studentId: student.student_id,
      firstName: student.first_name,
      lastName: student.last_name,
      email: student.email,
      phone: student.phone,
      program: student.program,
      stage: student.stage,
      acceptanceLikelihood: student.acceptance_likelihood,
      riskLevel: student.risk_level,
      progress: student.progress,
      leadScore: student.lead_score,
      country: student.country,
      city: student.city,
      state: student.state
    }));
  }

  /**
   * Get a single student by ID
   */
  static async getStudent(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching student:', error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new student
   */
  static async createStudent(student: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('students')
      .insert({
        ...student,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating student:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update a student
   */
  static async updateStudent(id: string, student: any) {
    const { data, error } = await supabase
      .from('students')
      .update(student)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating student:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a student
   */
  static async deleteStudent(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  /**
   * Bulk delete students
   */
  static async bulkDeleteStudents(ids: string[]) {
    const { error } = await supabase
      .from('students')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error bulk deleting students:', error);
      throw error;
    }
  }

  /**
   * Bulk update students
   */
  static async bulkUpdateStudents(ids: string[], updates: any) {
    const { error } = await supabase
      .from('students')
      .update(updates)
      .in('id', ids);

    if (error) {
      console.error('Error bulk updating students:', error);
      throw error;
    }
  }

  /**
   * Import students from CSV data
   */
  static async importStudents(studentData: any[]) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Add user_id to all students and generate student_id if missing
    const studentsWithUserId = studentData.map((student, index) => ({
      ...student,
      user_id: user.id,
      student_id: student.student_id || `STU${Date.now()}${index.toString().padStart(3, '0')}`
    }));

    const { data, error } = await supabase
      .from('students')
      .insert(studentsWithUserId)
      .select();

    if (error) {
      console.error('Error importing students:', error);
      throw error;
    }

    return data;
  }

  /**
   * Export students to CSV format
   */
  static async exportStudents(filters: StudentFilters = {}) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error exporting students:', error);
      throw error;
    }

    // Transform for export
    return (data || []).map(student => ({
      'Student ID': student.student_id,
      'First Name': student.first_name,
      'Last Name': student.last_name,
      'Email': student.email,
      'Phone': student.phone,
      'Program': student.program,
      'Stage': student.stage,
      'Risk Level': student.risk_level,
      'Progress': student.progress,
      'Lead Score': student.lead_score,
      'Country': student.country,
      'City': student.city,
      'State': student.state,
      'Created At': new Date(student.created_at).toLocaleDateString(),
    }));
  }

  /**
   * Get student statistics
   */
  static async getStudentStats() {
    const { data: students, error } = await supabase
      .from('students')
      .select('stage, risk_level');

    if (error) {
      console.error('Error fetching student stats:', error);
      return {
        total: 0,
        byStage: {},
        atRisk: 0,
        newApplications: 0
      };
    }

    const total = students?.length || 0;
    const byStage = students?.reduce((acc: any, student: any) => {
      acc[student.stage] = (acc[student.stage] || 0) + 1;
      return acc;
    }, {}) || {};
    
    const atRisk = students?.filter(s => s.risk_level === 'high').length || 0;
    const newApplications = students?.filter(s => s.stage === 'LEAD_FORM').length || 0;

    return {
      total,
      byStage,
      atRisk,
      newApplications
    };
  }
}

/**
 * React hook to get paginated students
 */
export function useStudentsPaginated(
  pagination: PaginationParams,
  filters: StudentFilters = {}
) {
  return useQuery({
    queryKey: ['students', 'paginated', pagination, filters],
    queryFn: () => StudentService.getStudentsPaginated(pagination, filters),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * React hook to get students with conditional demo data (legacy)
 */
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => StudentService.getStudents(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React hook for student mutations
 */
export function useStudentMutations() {
  const queryClient = useQueryClient();

  const createStudent = useMutation({
    mutationFn: StudentService.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const updateStudent = useMutation({
    mutationFn: ({ id, student }: { id: string; student: any }) =>
      StudentService.updateStudent(id, student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: StudentService.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const bulkDeleteStudents = useMutation({
    mutationFn: StudentService.bulkDeleteStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const bulkUpdateStudents = useMutation({
    mutationFn: ({ ids, updates }: { ids: string[]; updates: any }) =>
      StudentService.bulkUpdateStudents(ids, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const importStudents = useMutation({
    mutationFn: StudentService.importStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDeleteStudents,
    bulkUpdateStudents,
    importStudents,
  };
}

/**
 * React hook to get a single student
 */
export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => StudentService.getStudent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React hook to get student stats
 */
export function useStudentStats() {
  return useQuery({
    queryKey: ['students', 'stats'],
    queryFn: () => StudentService.getStudentStats(),
    staleTime: 5 * 60 * 1000,
  });
}