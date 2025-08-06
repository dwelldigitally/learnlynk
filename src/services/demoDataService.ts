import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

export class DemoDataService {
  // Demo email that gets full dummy data
  private static readonly DEMO_EMAIL = 'malhotratushar37@gmail.com';

  /**
   * Check if current user has demo data access
   */
  static async hasUserDemoData(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('user_has_demo_data');
      if (error) {
        console.error('Error checking demo data access:', error);
        // Fallback: enable demo data for all users when RPC fails
        return true;
      }
      return data || false;
    } catch (error) {
      console.error('Error checking demo data access:', error);
      // Fallback: enable demo data for all users when RPC fails
      return true;
    }
  }

  /**
   * Assign demo data to a user by email
   */
  static async assignDemoDataToUser(email: string, enabled: boolean = true): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('assign_demo_data_to_user', {
        target_email: email,
        demo_enabled: enabled
      });
      if (error) {
        console.error('Error assigning demo data:', error);
        return false;
      }
      return data || false;
    } catch (error) {
      console.error('Error assigning demo data:', error);
      return false;
    }
  }

  /**
   * Create demo data assignment when user signs up
   */
  static async createDemoDataAssignment(userId: string, email: string): Promise<void> {
    try {
      const hasDemoData = email === this.DEMO_EMAIL;
      
      const { error } = await supabase
        .from('demo_data_assignments')
        .insert({
          user_id: userId,
          email: email,
          has_demo_data: hasDemoData,
          demo_type: hasDemoData ? 'full' : 'none'
        });

      if (error) {
        console.error('Error creating demo data assignment:', error);
      }
    } catch (error) {
      console.error('Error creating demo data assignment:', error);
    }
  }

  /**
   * Get demo leads data (only for users with demo access)
   */
  static getDemoLeads() {
    return [
      {
        id: 'demo-1',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0123',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        source: 'web' as const,
        status: 'new' as const,
        priority: 'high' as const,
        lead_score: 85,
        ai_score: 92,
        program_interest: ['Computer Science', 'Data Analytics'],
        tags: ['high-potential', 'tech-background'],
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-2',
        first_name: 'Michael',
        last_name: 'Chen',
        email: 'michael.chen@email.com',
        phone: '+1-555-0456',
        country: 'Canada',
        state: 'Ontario',
        city: 'Toronto',
        source: 'social_media' as const,
        status: 'contacted' as const,
        priority: 'medium' as const,
        lead_score: 72,
        ai_score: 78,
        program_interest: ['Business Administration', 'MBA'],
        tags: ['international', 'experience'],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-3',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1-555-0789',
        country: 'United States',
        state: 'Texas',
        city: 'Austin',
        source: 'referral' as const,
        status: 'qualified' as const,
        priority: 'high' as const,
        lead_score: 91,
        ai_score: 88,
        program_interest: ['Healthcare Administration', 'Public Health'],
        tags: ['healthcare', 'referral'],
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  }

  /**
   * Get demo analytics data
   */
  static getDemoAnalytics() {
    return {
      totalLeads: 1247,
      newLeads: 89,
      contactedLeads: 453,
      qualifiedLeads: 312,
      convertedLeads: 156,
      conversionRate: 12.5,
      monthlyGrowth: 15.3,
      avgLeadScore: 74.2,
      topSources: [
        { source: 'Website', count: 345, percentage: 27.7 },
        { source: 'Social Media', count: 287, percentage: 23.0 },
        { source: 'Referrals', count: 234, percentage: 18.8 },
        { source: 'Events', count: 189, percentage: 15.2 },
        { source: 'Email', count: 192, percentage: 15.4 }
      ]
    };
  }

  /**
   * Get demo revenue data
   */
  static getDemoRevenueData() {
    return [
      { month: 'Jan', revenue: 45000, leads: 234 },
      { month: 'Feb', revenue: 52000, leads: 287 },
      { month: 'Mar', revenue: 48000, leads: 256 },
      { month: 'Apr', revenue: 61000, leads: 312 },
      { month: 'May', revenue: 55000, leads: 298 },
      { month: 'Jun', revenue: 67000, leads: 345 }
    ];
  }

  /**
   * Get demo programs data
   */
  static getDemoPrograms() {
    return [
      {
        id: 'demo-prog-1',
        name: 'Business Administration',
        type: 'Undergraduate',
        duration: '4 years',
        tuition: 25000,
        enrollment_status: 'open',
        next_intake: '2024-09-01',
        description: 'Comprehensive business program',
        requirements: ['High School Diploma', 'English Proficiency']
      },
      {
        id: 'demo-prog-2',
        name: 'Computer Science',
        type: 'Graduate',
        duration: '2 years',
        tuition: 35000,
        enrollment_status: 'open',
        next_intake: '2024-01-15',
        description: 'Advanced computer science degree',
        requirements: ['Bachelor\'s Degree', 'Programming Experience']
      },
      {
        id: 'demo-prog-3',
        name: 'Healthcare Management',
        type: 'Certificate',
        duration: '1 year',
        tuition: 15000,
        enrollment_status: 'waitlist',
        next_intake: '2024-05-01',
        description: 'Healthcare administration certificate',
        requirements: ['High School Diploma', 'Work Experience']
      }
    ];
  }

  /**
   * Get demo events data
   */
  static getDemoEvents() {
    return [
      {
        id: 'demo-event-1',
        title: 'Virtual Information Session',
        type: 'webinar',
        description: 'Learn about our programs and admission process',
        date: '2024-03-15',
        time: '14:00',
        location: 'Online',
        capacity: 100,
        registrations: 67,
        status: 'upcoming'
      },
      {
        id: 'demo-event-2',
        title: 'Campus Open House',
        type: 'campus_tour',
        description: 'Visit our campus and meet faculty',
        date: '2024-03-22',
        time: '10:00',
        location: 'Main Campus',
        capacity: 50,
        registrations: 42,
        status: 'upcoming'
      },
      {
        id: 'demo-event-3',
        title: 'Career Fair',
        type: 'networking',
        description: 'Connect with industry professionals',
        date: '2024-02-20',
        time: '13:00',
        location: 'Student Center',
        capacity: 200,
        registrations: 156,
        status: 'past'
      }
    ];
  }

  /**
   * Get demo financial records data
   */
  static getDemoFinancialRecords() {
    return [
      {
        id: 'demo-fin-1',
        student_name: 'Sarah Johnson',
        program: 'Business Administration',
        amount: 25000,
        due_date: '2024-08-01',
        status: 'paid',
        payment_type: 'tuition'
      },
      {
        id: 'demo-fin-2',
        student_name: 'Michael Chen',
        program: 'Computer Science',
        amount: 35000,
        due_date: '2024-12-15',
        status: 'pending',
        payment_type: 'tuition'
      },
      {
        id: 'demo-fin-3',
        student_name: 'Emily Rodriguez',
        program: 'Healthcare Management',
        amount: 15000,
        due_date: '2024-04-01',
        status: 'overdue',
        payment_type: 'tuition'
      }
    ];
  }

  /**
   * Get demo students data
   */
  static getDemoStudents() {
    return [
      {
        id: 's1',
        student_id: 'WCC001',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1-555-0123',
        program: 'Computer Science',
        stage: 'DOCUMENT_APPROVAL',
        acceptance_likelihood: 85,
        risk_level: 'low',
        progress: 75,
        lead_score: 92,
        country: 'Canada',
        city: 'Toronto',
        state: 'ON'
      },
      {
        id: 's2',
        student_id: 'WCC002',
        first_name: 'Michael',
        last_name: 'Chen',
        email: 'michael.chen@example.com',
        phone: '+1-555-0124',
        program: 'Business Administration',
        stage: 'FEE_PAYMENT',
        acceptance_likelihood: 78,
        risk_level: 'medium',
        progress: 60,
        lead_score: 87,
        country: 'Canada',
        city: 'Vancouver',
        state: 'BC'
      },
      {
        id: 's3',
        student_id: 'WCC003',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        email: 'emily.rodriguez@example.com',
        phone: '+1-555-0125',
        program: 'Engineering',
        stage: 'SEND_DOCUMENTS',
        acceptance_likelihood: 45,
        risk_level: 'high',
        progress: 30,
        lead_score: 65,
        country: 'USA',
        city: 'New York',
        state: 'NY'
      },
      {
        id: 's4',
        student_id: 'WCC004',
        first_name: 'David',
        last_name: 'Thompson',
        email: 'david.thompson@example.com',
        phone: '+1-555-0126',
        program: 'Psychology',
        stage: 'ACCEPTED',
        acceptance_likelihood: 95,
        risk_level: 'low',
        progress: 100,
        lead_score: 98,
        country: 'Canada',
        city: 'Calgary',
        state: 'AB'
      },
      {
        id: 's5',
        student_id: 'WCC005',
        first_name: 'Lisa',
        last_name: 'Wang',
        email: 'lisa.wang@example.com',
        phone: '+1-555-0127',
        program: 'Nursing',
        stage: 'LEAD_FORM',
        acceptance_likelihood: 70,
        risk_level: 'medium',
        progress: 15,
        lead_score: 80,
        country: 'Canada',
        city: 'Montreal',
        state: 'QC'
      },
      {
        id: 's6',
        student_id: 'WCC006',
        first_name: 'James',
        last_name: 'Mitchell',
        email: 'james.mitchell@example.com',
        phone: '+1-555-0128',
        program: 'Culinary Arts',
        stage: 'DOCUMENT_APPROVAL',
        acceptance_likelihood: 82,
        risk_level: 'low',
        progress: 65,
        lead_score: 88,
        country: 'USA',
        city: 'Seattle',
        state: 'WA'
      },
      {
        id: 's7',
        student_id: 'WCC007',
        first_name: 'Maria',
        last_name: 'Garcia',
        email: 'maria.garcia@example.com',
        phone: '+1-555-0129',
        program: 'Medical Assistant',
        stage: 'SEND_DOCUMENTS',
        acceptance_likelihood: 55,
        risk_level: 'high',
        progress: 40,
        lead_score: 72,
        country: 'Mexico',
        city: 'Tijuana',
        state: 'BC'
      },
      {
        id: 's8',
        student_id: 'WCC008',
        first_name: 'Robert',
        last_name: 'Kim',
        email: 'robert.kim@example.com',
        phone: '+1-555-0130',
        program: 'Information Technology',
        stage: 'FEE_PAYMENT',
        acceptance_likelihood: 88,
        risk_level: 'low',
        progress: 85,
        lead_score: 94,
        country: 'Canada',
        city: 'Edmonton',
        state: 'AB'
      }
    ];
  }

  /**
   * Get demo communications data
   */
  static getDemoCommunications() {
    return [
      {
        id: 'comm1',
        studentId: 's1',
        type: 'email',
        subject: 'Welcome to WCC',
        content: 'Welcome to Western Career College! We are excited to have you join our community.',
        direction: 'outbound',
        status: 'sent',
        sentAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'comm2',
        studentId: 's2',
        type: 'phone',
        subject: 'Follow-up Call',
        content: 'Discussed program requirements and next steps.',
        direction: 'outbound',
        status: 'completed',
        sentAt: '2024-01-16T14:30:00Z'
      },
      {
        id: 'comm3',
        studentId: 's3',
        type: 'email',
        subject: 'Document Submission Required',
        content: 'Please submit your transcripts and other required documents.',
        direction: 'outbound',
        status: 'sent',
        sentAt: '2024-01-17T09:15:00Z'
      }
    ];
  }

  /**
   * Get demo documents data
   */
  static getDemoDocuments() {
    return [
      {
        id: 'doc1',
        studentId: 's1',
        name: 'High School Transcript',
        type: 'transcript',
        fileSize: 245760,
        status: 'approved',
        uploadedAt: '2024-01-10T08:00:00Z',
        reviewedAt: '2024-01-12T10:00:00Z'
      },
      {
        id: 'doc2',
        studentId: 's2',
        name: 'Birth Certificate',
        type: 'identification',
        fileSize: 156789,
        status: 'under_review',
        uploadedAt: '2024-01-15T14:00:00Z'
      },
      {
        id: 'doc3',
        studentId: 's3',
        name: 'College Transcript',
        type: 'transcript',
        fileSize: 334521,
        status: 'pending',
        uploadedAt: '2024-01-18T11:30:00Z'
      },
      {
        id: 'doc4',
        studentId: 's1',
        name: 'Passport Copy',
        type: 'identification',
        fileSize: 198765,
        status: 'rejected',
        uploadedAt: '2024-01-08T16:45:00Z',
        reviewedAt: '2024-01-09T09:00:00Z',
        comments: 'Image quality too low, please resubmit'
      }
    ];
  }

  /**
   * Get demo student applications data
   */
  static getDemoApplications() {
    return [
      {
        id: 'app-1',
        studentId: 'demo-student-1',
        studentName: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0123',
        program: 'Health Care Assistant',
        applicationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        status: 'under-review' as const,
        stage: 'DOCUMENT_APPROVAL' as const,
        progress: 75,
        acceptanceLikelihood: 85,
        documentsSubmitted: 6,
        documentsRequired: 8,
        advisorAssigned: 'Dr. Emily Roberts',
        estimatedDecision: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        priority: 'high' as const,
        country: 'United States',
        city: 'San Francisco'
      },
      {
        id: 'app-2',
        studentId: 'demo-student-2',
        studentName: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1-555-0456',
        program: 'Computer Science',
        applicationDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        status: 'pending-documents' as const,
        stage: 'SEND_DOCUMENTS' as const,
        progress: 45,
        acceptanceLikelihood: 78,
        documentsSubmitted: 3,
        documentsRequired: 7,
        advisorAssigned: 'Prof. James Wilson',
        estimatedDecision: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priority: 'medium' as const,
        country: 'Canada',
        city: 'Toronto'
      },
      {
        id: 'app-3',
        studentId: 'demo-student-3',
        studentName: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-0789',
        program: 'Data Analytics',
        applicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'approved' as const,
        stage: 'FEE_PAYMENT' as const,
        progress: 90,
        acceptanceLikelihood: 95,
        documentsSubmitted: 8,
        documentsRequired: 8,
        advisorAssigned: 'Dr. Sarah Martinez',
        estimatedDecision: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priority: 'high' as const,
        country: 'United Kingdom',
        city: 'London'
      },
      {
        id: 'app-4',
        studentId: 'demo-student-4',
        studentName: 'James Rodriguez',
        email: 'james.rodriguez@email.com',
        phone: '+1-555-1234',
        program: 'Business Administration',
        applicationDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        status: 'rejected' as const,
        stage: 'DOCUMENT_APPROVAL' as const,
        progress: 60,
        acceptanceLikelihood: 35,
        documentsSubmitted: 5,
        documentsRequired: 8,
        advisorAssigned: 'Dr. Michael Brown',
        estimatedDecision: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        priority: 'low' as const,
        country: 'Mexico',
        city: 'Mexico City'
      },
      {
        id: 'app-5',
        studentId: 'demo-student-5',
        studentName: 'Lisa Wang',
        email: 'lisa.wang@email.com',
        phone: '+1-555-5678',
        program: 'Nursing',
        applicationDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        status: 'submitted' as const,
        stage: 'LEAD_FORM' as const,
        progress: 25,
        acceptanceLikelihood: 72,
        documentsSubmitted: 2,
        documentsRequired: 8,
        advisorAssigned: 'Dr. Jennifer Lee',
        estimatedDecision: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        priority: 'medium' as const,
        country: 'Singapore',
        city: 'Singapore'
      },
      {
        id: 'app-6',
        studentId: 'demo-student-6',
        studentName: 'David Thompson',
        email: 'david.thompson@email.com',
        phone: '+1-555-9999',
        program: 'Digital Marketing',
        applicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'under-review' as const,
        stage: 'DOCUMENT_APPROVAL' as const,
        progress: 80,
        acceptanceLikelihood: 88,
        documentsSubmitted: 7,
        documentsRequired: 8,
        advisorAssigned: 'Prof. Amanda Clark',
        estimatedDecision: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priority: 'high' as const,
        country: 'Australia',
        city: 'Sydney'
      }
    ];
  }

  /**
   * Get demo scholarship applications data
   */
  static getDemoScholarshipApplications() {
    return [
      {
        id: 'sch1',
        studentName: 'Sarah Johnson',
        scholarshipName: 'Academic Excellence Scholarship',
        scholarshipType: 'merit',
        amount: 5000,
        applicationDate: '2024-01-10',
        deadline: '2024-03-15',
        status: 'approved',
        eligibilityScore: 92,
        documentsSubmitted: true
      },
      {
        id: 'sch2',
        studentName: 'Michael Chen',
        scholarshipName: 'Business Leadership Grant',
        scholarshipType: 'merit',
        amount: 3000,
        applicationDate: '2024-01-12',
        deadline: '2024-03-20',
        status: 'under_review',
        eligibilityScore: 87,
        documentsSubmitted: true
      },
      {
        id: 'sch3',
        studentName: 'Emily Rodriguez',
        scholarshipName: 'Need-Based Financial Aid',
        scholarshipType: 'need',
        amount: 7500,
        applicationDate: '2024-01-14',
        deadline: '2024-04-01',
        status: 'submitted',
        eligibilityScore: 75,
        documentsSubmitted: false
      }
    ];
  }
}

/**
 * React hook to check if user has demo data access
 */
export function useDemoDataAccess() {
  // Safe auth access - return loading state if auth context not available
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext.user;
  } catch (error) {
    // Auth context not available - this can happen during initial render
    console.warn('Auth context not available, returning demo data disabled');
  }
  
  return useQuery({
    queryKey: ['demo-data-access', user?.id],
    queryFn: () => DemoDataService.hasUserDemoData(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * React hook to get demo leads with conditional loading
 */
export function useDemoLeads() {
  const { data: hasDemoAccess, isLoading: isCheckingAccess } = useDemoDataAccess();
  
  return useQuery({
    queryKey: ['demo-leads'],
    queryFn: () => DemoDataService.getDemoLeads(),
    enabled: hasDemoAccess === true,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * React hook to get demo analytics with conditional loading
 */
export function useDemoAnalytics() {
  const { data: hasDemoAccess } = useDemoDataAccess();
  
  return useQuery({
    queryKey: ['demo-analytics'],
    queryFn: () => DemoDataService.getDemoAnalytics(),
    enabled: hasDemoAccess === true,
    staleTime: 10 * 60 * 1000,
  });
}