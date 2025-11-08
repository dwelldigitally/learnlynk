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
        program_interest: ['Health Care Assistant', 'ECE'],
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
        program_interest: ['Education Assistant', 'Hospitality'],
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
        program_interest: ['Aviation', 'MLA'],
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
        name: 'Health Care Assistant',
        type: 'Certificate',
        duration: '10 months',
        tuition: 18000,
        enrollment_status: 'open',
        next_intake: '2024-09-01',
        description: 'Comprehensive healthcare assistant training program',
        requirements: ['High School Diploma', 'English Proficiency', 'Medical Clearance']
      },
      {
        id: 'demo-prog-2',
        name: 'Education Assistant',
        type: 'Certificate',
        duration: '8 months',
        tuition: 15000,
        enrollment_status: 'open',
        next_intake: '2024-01-15',
        description: 'Professional education assistant certification',
        requirements: ['High School Diploma', 'Background Check']
      },
      {
        id: 'demo-prog-3',
        name: 'Aviation',
        type: 'Diploma',
        duration: '18 months',
        tuition: 35000,
        enrollment_status: 'open',
        next_intake: '2024-05-01',
        description: 'Aviation maintenance and operations program',
        requirements: ['High School Diploma', 'Math Proficiency', 'Physical Requirements']
      },
      {
        id: 'demo-prog-4',
        name: 'Hospitality',
        type: 'Certificate',
        duration: '12 months',
        tuition: 16000,
        enrollment_status: 'open',
        next_intake: '2024-07-01',
        description: 'Hospitality management and service training',
        requirements: ['High School Diploma', 'Customer Service Experience']
      },
      {
        id: 'demo-prog-5',
        name: 'ECE',
        type: 'Diploma',
        duration: '24 months',
        tuition: 22000,
        enrollment_status: 'open',
        next_intake: '2024-09-01',
        description: 'Early Childhood Education professional program',
        requirements: ['High School Diploma', 'Background Check', 'First Aid Certification']
      },
      {
        id: 'demo-prog-6',
        name: 'MLA',
        type: 'Certificate',
        duration: '14 months',
        tuition: 20000,
        enrollment_status: 'waitlist',
        next_intake: '2024-11-01',
        description: 'Medical Laboratory Assistant certification program',
        requirements: ['High School Diploma', 'Science Prerequisites', 'Medical Clearance']
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
        program: 'Health Care Assistant',
        amount: 18000,
        due_date: '2024-08-01',
        status: 'paid',
        payment_type: 'tuition'
      },
      {
        id: 'demo-fin-2',
        student_name: 'Michael Chen',
        program: 'Education Assistant',
        amount: 15000,
        due_date: '2024-12-15',
        status: 'pending',
        payment_type: 'tuition'
      },
      {
        id: 'demo-fin-3',
        student_name: 'Emily Rodriguez',
        program: 'Aviation',
        amount: 35000,
        due_date: '2024-04-01',
        status: 'overdue',
        payment_type: 'tuition'
      },
      {
        id: 'demo-fin-4',
        student_name: 'David Thompson',
        program: 'Hospitality',
        amount: 16000,
        due_date: '2024-09-01',
        status: 'paid',
        payment_type: 'tuition'
      },
      {
        id: 'demo-fin-5',
        student_name: 'Lisa Wang',
        program: 'ECE',
        amount: 22000,
        due_date: '2024-10-15',
        status: 'pending',
        payment_type: 'tuition'
      },
      {
        id: 'demo-fin-6',
        student_name: 'James Mitchell',
        program: 'MLA',
        amount: 20000,
        due_date: '2024-11-01',
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
        program: 'Health Care Assistant',
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
        program: 'Education Assistant',
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
        program: 'Aviation',
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
        program: 'Hospitality',
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
        program: 'ECE',
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
        program: 'MLA',
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
        program: 'Health Care Assistant',
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
        program: 'Aviation',
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
   * Get demo academic terms data
   */
  static getDemoAcademicTerms() {
    return [
      {
        id: 'demo-term-1',
        user_id: 'demo-user',
        name: 'Fall 2024',
        description: 'Fall semester 2024',
        term_type: 'semester',
        academic_year: '2024-2025',
        start_date: '2024-09-03',
        end_date: '2024-12-20',
        registration_start_date: '2024-08-01',
        registration_end_date: '2024-08-31',
        add_drop_deadline: '2024-09-17',
        withdrawal_deadline: '2024-11-15',
        status: 'active',
        is_current: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'demo-term-2',
        user_id: 'demo-user',
        name: 'Winter 2025',
        description: 'Winter semester 2025',
        term_type: 'semester',
        academic_year: '2024-2025',
        start_date: '2025-01-06',
        end_date: '2025-04-25',
        registration_start_date: '2024-11-15',
        registration_end_date: '2024-12-15',
        add_drop_deadline: '2025-01-20',
        withdrawal_deadline: '2025-03-20',
        status: 'upcoming',
        is_current: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'demo-term-3',
        user_id: 'demo-user',
        name: 'Summer 2024',
        description: 'Summer semester 2024',
        term_type: 'semester',
        academic_year: '2023-2024',
        start_date: '2024-05-06',
        end_date: '2024-08-23',
        registration_start_date: '2024-03-01',
        registration_end_date: '2024-04-30',
        add_drop_deadline: '2024-05-20',
        withdrawal_deadline: '2024-07-15',
        status: 'active',
        is_current: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  /**
   * Get demo intakes data
   */
  static getDemoIntakes() {
    return [
      {
        id: 'demo-intake-1',
        program_id: 'demo-prog-1',
        program_name: 'Health Care Assistant',
        program_type: 'Certificate',
        name: 'Spring 2024 - Health Care Assistant',
        start_date: '2024-05-01',
        application_deadline: '2024-04-15',
        capacity: 30,
        study_mode: 'Full-time',
        delivery_method: 'On-campus',
        campus: 'Main Campus',
        status: 'open',
        sales_approach: 'balanced' as const,
        enrolled_count: 22,
        enrollment_percentage: 73.3,
        capacity_percentage: 73.3,
        health_status: 'warning' as const,
      },
      {
        id: 'demo-intake-2',
        program_id: 'demo-prog-2',
        program_name: 'Education Assistant',
        program_type: 'Certificate',
        name: 'Fall 2024 - Education Assistant',
        start_date: '2024-09-01',
        application_deadline: '2024-08-15',
        capacity: 25,
        study_mode: 'Full-time',
        delivery_method: 'Hybrid',
        campus: 'Main Campus',
        status: 'open',
        sales_approach: 'aggressive' as const,
        enrolled_count: 8,
        enrollment_percentage: 32.0,
        capacity_percentage: 32.0,
        health_status: 'critical' as const,
      },
      {
        id: 'demo-intake-3',
        program_id: 'demo-prog-3',
        program_name: 'Aviation',
        program_type: 'Diploma',
        name: 'Summer 2024 - Aviation',
        start_date: '2024-07-01',
        application_deadline: '2024-06-20',
        capacity: 40,
        study_mode: 'Full-time',
        delivery_method: 'On-campus',
        campus: 'Aviation Campus',
        status: 'open',
        sales_approach: 'balanced' as const,
        enrolled_count: 35,
        enrollment_percentage: 87.5,
        capacity_percentage: 87.5,
        health_status: 'healthy' as const,
      },
      {
        id: 'demo-intake-4',
        program_id: 'demo-prog-4',
        program_name: 'Hospitality',
        program_type: 'Certificate',
        name: 'Fall 2024 - Hospitality',
        start_date: '2024-11-01',
        application_deadline: '2024-10-15',
        capacity: 35,
        study_mode: 'Full-time',
        delivery_method: 'On-campus',
        campus: 'Main Campus',
        status: 'open',
        sales_approach: 'neutral' as const,
        enrolled_count: 12,
        enrollment_percentage: 34.3,
        capacity_percentage: 34.3,
        health_status: 'critical' as const,
      },
      {
        id: 'demo-intake-5',
        program_id: 'demo-prog-5',
        program_name: 'ECE',
        program_type: 'Diploma',
        name: 'Winter 2025 - ECE',
        start_date: '2025-01-15',
        application_deadline: '2024-12-31',
        capacity: 20,
        study_mode: 'Full-time',
        delivery_method: 'On-campus',
        campus: 'Main Campus',
        status: 'open',
        sales_approach: 'aggressive' as const,
        enrolled_count: 3,
        enrollment_percentage: 15.0,
        capacity_percentage: 15.0,
        health_status: 'critical' as const,
      },
      {
        id: 'demo-intake-6',
        program_id: 'demo-prog-6',
        program_name: 'MLA',
        program_type: 'Certificate',
        name: 'Spring 2025 - MLA',
        start_date: '2025-03-01',
        application_deadline: '2025-02-15',
        capacity: 18,
        study_mode: 'Full-time',
        delivery_method: 'On-campus',
        campus: 'Health Sciences Campus',
        status: 'planning',
        sales_approach: 'balanced' as const,
        enrolled_count: 0,
        enrollment_percentage: 0,
        capacity_percentage: 0,
        health_status: 'healthy' as const,
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

  /**
   * Get demo routing rules data
   */
  static getDemoRoutingRules() {
    return [
      {
        id: 'route-demo-1',
        name: 'High-Score Lead Priority Routing',
        description: 'Route high-scoring leads (85+) to senior advisors automatically',
        priority: 1,
        is_active: true,
        sources: ['web', 'email', 'social'],
        condition_groups: [
          {
            id: 'cg-1',
            operator: 'AND',
            conditions: [
              {
                id: 'c-1',
                type: 'score',
                field: 'lead_score',
                operator: 'greater_than',
                value: 85,
                label: 'Lead Score > 85'
              }
            ]
          }
        ],
        assignment_config: {
          method: 'round_robin',
          teams: ['senior-advisors'],
          workload_balance: true,
          max_assignments_per_advisor: 10
        },
        schedule: {
          enabled: true,
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '09:00',
          end_time: '17:00',
          timezone: 'America/New_York'
        },
        performance_config: {
          track_analytics: true,
          conversion_weight: 0.7,
          response_time_weight: 0.3
        }
      },
      {
        id: 'route-demo-2',
        name: 'Geographic Routing - West Coast',
        description: 'Route all leads from California, Oregon, Washington to West Coast team',
        priority: 2,
        is_active: true,
        sources: ['web', 'phone', 'referral'],
        condition_groups: [
          {
            id: 'cg-2',
            operator: 'OR',
            conditions: [
              {
                id: 'c-2',
                type: 'location',
                field: 'state',
                operator: 'in',
                value: ['California', 'Oregon', 'Washington'],
                label: 'West Coast States'
              }
            ]
          }
        ],
        assignment_config: {
          method: 'workload_balanced',
          teams: ['west-coast-team'],
          geographic_preference: true,
          fallback_method: 'round_robin'
        }
      },
      {
        id: 'route-demo-3',
        name: 'STEM Program Specialization',
        description: 'Route Computer Science and Engineering leads to STEM specialists',
        priority: 3,
        is_active: true,
        sources: ['web', 'email'],
        condition_groups: [
          {
            id: 'cg-3',
            operator: 'OR',
            conditions: [
              {
                id: 'c-3',
                type: 'program',
                field: 'program_interest',
                operator: 'contains',
                value: 'Computer Science',
                label: 'Computer Science Interest'
              },
              {
                id: 'c-4',
                type: 'program',
                field: 'program_interest',
                operator: 'contains',
                value: 'Engineering',
                label: 'Engineering Interest'
              }
            ]
          }
        ],
        assignment_config: {
          method: 'specialist_match',
          advisors: ['stem-advisor-1', 'stem-advisor-2'],
          specialization_weight: 0.8
        }
      },
      {
        id: 'route-demo-4',
        name: 'After-Hours Routing',
        description: 'Route after-hours leads to on-call team',
        priority: 4,
        is_active: true,
        sources: ['web', 'chatbot'],
        condition_groups: [
          {
            id: 'cg-4',
            operator: 'OR',
            conditions: [
              {
                id: 'c-5',
                type: 'time',
                field: 'created_time',
                operator: 'between',
                value: ['18:00', '09:00'],
                label: 'After Business Hours'
              }
            ]
          }
        ],
        assignment_config: {
          method: 'round_robin',
          teams: ['after-hours-team'],
          max_assignments_per_advisor: 5
        },
        schedule: {
          enabled: true,
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          start_time: '18:00',
          end_time: '09:00',
          timezone: 'America/New_York'
        }
      },
      {
        id: 'route-demo-5',
        name: 'VIP Source Routing',
        description: 'Route leads from premium sources to senior team',
        priority: 5,
        is_active: true,
        sources: ['referral', 'partner'],
        condition_groups: [
          {
            id: 'cg-5',
            operator: 'OR',
            conditions: [
              {
                id: 'c-6',
                type: 'source',
                field: 'source',
                operator: 'in',
                value: ['referral', 'partner', 'event'],
                label: 'Premium Sources'
              }
            ]
          }
        ],
        assignment_config: {
          method: 'priority_queue',
          teams: ['senior-advisors'],
          priority_boost: 10
        }
      }
    ];
  }

  /**
   * Get demo lead scoring rules data
   */
  static getDemoScoringRules() {
    return [
      {
        id: 'score-demo-1',
        name: 'Email Domain Quality',
        description: 'Score based on email domain credibility',
        category: 'contact_quality',
        field_name: 'email',
        scoring_logic: {
          type: 'domain_analysis',
          rules: [
            { condition: 'ends_with', value: '.edu', points: 15 },
            { condition: 'ends_with', value: '.gov', points: 12 },
            { condition: 'contains', value: 'gmail|yahoo|outlook', points: 5 },
            { condition: 'contains', value: 'company_domains', points: 10 }
          ]
        },
        weight: 0.15,
        is_active: true,
        order_index: 1
      },
      {
        id: 'score-demo-2',
        name: 'Program Interest Value',
        description: 'Score based on program selection and market demand',
        category: 'program_fit',
        field_name: 'program_interest',
        scoring_logic: {
          type: 'categorical',
          rules: [
            { condition: 'equals', value: 'Computer Science', points: 25 },
            { condition: 'equals', value: 'Engineering', points: 23 },
            { condition: 'equals', value: 'Business Administration', points: 18 },
            { condition: 'equals', value: 'Health Care Assistant', points: 20 },
            { condition: 'equals', value: 'Nursing', points: 22 }
          ]
        },
        weight: 0.25,
        is_active: true,
        order_index: 2
      },
      {
        id: 'score-demo-3',
        name: 'Geographic Targeting',
        description: 'Score based on target geographic markets',
        category: 'demographics',
        field_name: 'location',
        scoring_logic: {
          type: 'geographic',
          rules: [
            { condition: 'state_in', value: ['California', 'New York', 'Texas'], points: 15 },
            { condition: 'country_equals', value: 'United States', points: 10 },
            { condition: 'country_equals', value: 'Canada', points: 12 },
            { condition: 'city_tier', value: 'major', points: 8 }
          ]
        },
        weight: 0.12,
        is_active: true,
        order_index: 3
      },
      {
        id: 'score-demo-4',
        name: 'Lead Source Quality',
        description: 'Score based on lead source performance history',
        category: 'source_quality',
        field_name: 'source',
        scoring_logic: {
          type: 'categorical',
          rules: [
            { condition: 'equals', value: 'referral', points: 20 },
            { condition: 'equals', value: 'partner', points: 18 },
            { condition: 'equals', value: 'web', points: 12 },
            { condition: 'equals', value: 'social', points: 8 },
            { condition: 'equals', value: 'phone', points: 15 }
          ]
        },
        weight: 0.18,
        is_active: true,
        order_index: 4
      },
      {
        id: 'score-demo-5',
        name: 'Engagement Indicators',
        description: 'Score based on initial engagement signals',
        category: 'engagement',
        field_name: 'engagement_score',
        scoring_logic: {
          type: 'numeric_range',
          rules: [
            { condition: 'range', value: [80, 100], points: 20 },
            { condition: 'range', value: [60, 79], points: 15 },
            { condition: 'range', value: [40, 59], points: 10 },
            { condition: 'range', value: [20, 39], points: 5 },
            { condition: 'range', value: [0, 19], points: 0 }
          ]
        },
        weight: 0.20,
        is_active: true,
        order_index: 5
      },
      {
        id: 'score-demo-6',
        name: 'Response Time Penalty',
        description: 'Negative scoring for delayed responses',
        category: 'timing',
        field_name: 'response_time_hours',
        scoring_logic: {
          type: 'penalty',
          rules: [
            { condition: 'greater_than', value: 24, points: -5 },
            { condition: 'greater_than', value: 48, points: -10 },
            { condition: 'greater_than', value: 72, points: -15 }
          ]
        },
        weight: 0.10,
        is_active: true,
        order_index: 6
      }
    ];
  }

  /**
   * Get demo routing templates data
   */
  static getDemoRoutingTemplates() {
    return [
      {
        id: 'template-1',
        name: 'Geographic Distribution',
        description: 'Route leads based on geographic regions with timezone considerations',
        category: 'geographic',
        template_data: {
          regions: [
            { name: 'West Coast', states: ['CA', 'OR', 'WA'], team: 'west-team' },
            { name: 'East Coast', states: ['NY', 'FL', 'MA'], team: 'east-team' },
            { name: 'Central', states: ['TX', 'IL', 'OH'], team: 'central-team' }
          ],
          timezone_routing: true,
          overflow_handling: 'round_robin'
        },
        is_system_template: true,
        usage_count: 0
      },
      {
        id: 'template-2',
        name: 'Program Specialization',
        description: 'Route leads to advisors specialized in their program of interest',
        category: 'program',
        template_data: {
          specializations: [
            { program: 'Computer Science', team: 'tech-team', advisors: ['tech-advisor-1', 'tech-advisor-2'] },
            { program: 'Business', team: 'business-team', advisors: ['business-advisor-1'] },
            { program: 'Healthcare', team: 'health-team', advisors: ['health-advisor-1', 'health-advisor-2'] }
          ],
          fallback_strategy: 'general_pool',
          specialization_weight: 0.8
        },
        is_system_template: true,
        usage_count: 0
      },
      {
        id: 'template-3',
        name: 'Lead Quality Tiering',
        description: 'Route leads based on quality scores to appropriate advisor levels',
        category: 'score',
        template_data: {
          score_tiers: [
            { min_score: 80, max_score: 100, team: 'senior-advisors', priority: 'high' },
            { min_score: 60, max_score: 79, team: 'standard-advisors', priority: 'medium' },
            { min_score: 0, max_score: 59, team: 'junior-advisors', priority: 'low' }
          ],
          auto_escalation: true,
          escalation_threshold: 85
        },
        is_system_template: true,
        usage_count: 0
      },
      {
        id: 'template-4',
        name: 'Round Robin Distribution',
        description: 'Evenly distribute leads across all available advisors',
        category: 'hybrid',
        template_data: {
          distribution_method: 'round_robin',
          workload_balancing: true,
          max_daily_assignments: 15,
          availability_check: true,
          skip_unavailable: true
        },
        is_system_template: true,
        usage_count: 0
      }
    ];
  }

  /**
   * Get demo advisor teams data
   */
  static getDemoAdvisorTeams() {
    return [
      {
        id: 'team-1',
        name: 'Senior Advisors',
        description: 'Experienced advisors for high-value and complex leads',
        is_active: true,
        max_daily_assignments: 50,
        region: 'All Regions',
        specializations: ['High-Value Leads', 'Complex Cases', 'VIP Clients']
      },
      {
        id: 'team-2',
        name: 'STEM Specialists',
        description: 'Advisors specialized in Science, Technology, Engineering, and Math programs',
        is_active: true,
        max_daily_assignments: 40,
        region: 'North America',
        specializations: ['Computer Science', 'Engineering', 'Data Analytics', 'Information Technology']
      },
      {
        id: 'team-3',
        name: 'West Coast Team',
        description: 'Advisors covering Pacific timezone and West Coast markets',
        is_active: true,
        max_daily_assignments: 35,
        region: 'West Coast',
        specializations: ['Geographic Coverage', 'Pacific Timezone', 'Tech Industry']
      },
      {
        id: 'team-4',
        name: 'After-Hours Team',
        description: 'Night shift and weekend coverage team',
        is_active: true,
        max_daily_assignments: 25,
        region: 'All Regions',
        specializations: ['After Hours', 'Weekend Coverage', 'Emergency Response']
      }
    ];
  }

  /**
   * Get demo scoring settings data
   */
  static getDemoScoringSettings() {
    return {
      auto_scoring_enabled: true,
      scoring_algorithm: 'weighted',
      min_score: 0,
      max_score: 100,
      default_score: 50,
      recalculate_on_update: true,
      score_decay_enabled: false,
      score_decay_rate: 0.05,
      ai_enhancement_enabled: true,
      real_time_scoring: true
    };
  }
}

/**
 * React hook to check if user has demo data access
 */
export function useDemoDataAccess() {
  // Safe auth access - return loading state if auth context not available
  let user = null;
  let authError = false;
  
  try {
    const authContext = useAuth();
    user = authContext.user;
  } catch (error) {
    // Auth context not available - this can happen during initial render
    console.warn('Auth context not available, enabling demo data as fallback');
    authError = true;
  }
  
  return useQuery({
    queryKey: ['demo-data-access', user?.id || 'no-auth'],
    queryFn: () => {
      if (authError) {
        // If auth is not available, enable demo data
        return Promise.resolve(true);
      }
      return DemoDataService.hasUserDemoData();
    },
    enabled: true, // Always enabled to show demo data when auth isn't ready
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