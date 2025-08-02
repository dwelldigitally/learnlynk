import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export class StudentService {
  /**
   * Get all students for the current user
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
 * React hook to get students with conditional demo data
 */
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => StudentService.getStudents(),
    staleTime: 5 * 60 * 1000,
  });
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