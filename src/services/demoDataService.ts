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
        return false;
      }
      return data || false;
    } catch (error) {
      console.error('Error checking demo data access:', error);
      return false;
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
}

/**
 * React hook to check if user has demo data access
 */
export function useDemoDataAccess() {
  const { user } = useAuth();
  
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