import { supabase } from "@/integrations/supabase/client";
import type { RecruiterCompany, RecruiterUser, RecruiterApplication, RecruiterCommunication, RecruiterDocument, StudentApplicationFormData } from "@/types/recruiter";

export class RecruiterService {
  // Recruiter Company Management
  static async getRecruiterCompanies(): Promise<RecruiterCompany[]> {
    const { data, error } = await supabase
      .from('recruiter_companies')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) {
      // Return dummy companies for preview
      return this.getDummyRecruiterCompanies();
    }
    return data as RecruiterCompany[];
  }

  // Generate comprehensive dummy company data
  static getDummyRecruiterCompanies(): RecruiterCompany[] {
    return [
      {
        id: 'comp-1',
        name: 'EduPartners Global',
        country: 'United States',
        website: 'https://www.edupartners.com',
        phone: '+1-555-0100',
        email: 'contact@edupartners.com',
        address: '123 Education Avenue',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        assigned_contact: 'James Mitchell',
        commission_rate: 10,
        commission_type: 'percentage',
        status: 'active',
        notes: 'Premier education recruitment partner with strong track record in business programs.',
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-12-01T16:45:00Z'
      },
      {
        id: 'comp-2',
        name: 'TechRecruiters Australia',
        country: 'Australia',
        website: 'https://www.techrecruiters.au',
        phone: '+61-2-8765-4300',
        email: 'info@techrecruiters.au',
        address: '456 Tech Street',
        city: 'Sydney',
        state: 'NSW',
        zip_code: '2000',
        assigned_contact: 'Sarah Thompson',
        commission_rate: 12,
        commission_type: 'percentage',
        status: 'active',
        notes: 'Specializes in technology and engineering programs. Excellent performance in STEM fields.',
        created_at: '2024-03-01T10:00:00Z',
        updated_at: '2024-11-15T13:20:00Z'
      },
      {
        id: 'comp-3',
        name: 'UK Study Link',
        country: 'United Kingdom',
        website: 'https://www.ukstudylink.co.uk',
        phone: '+44-20-7123-4500',
        email: 'hello@ukstudylink.co.uk',
        address: '789 London Road',
        city: 'London',
        state: 'England',
        zip_code: 'SW1A 1AA',
        assigned_contact: 'David Williams',
        commission_rate: 8,
        commission_type: 'percentage',
        status: 'active',
        notes: 'Long-standing partner with expertise in undergraduate and postgraduate programs.',
        created_at: '2023-08-01T12:00:00Z',
        updated_at: '2024-10-20T09:45:00Z'
      },
      {
        id: 'comp-4',
        name: 'India Connect Education',
        country: 'India',
        website: 'https://www.indiaconnect.in',
        phone: '+91-11-9876-5400',
        email: 'contact@indiaconnect.in',
        address: '321 Delhi Gate',
        city: 'New Delhi',
        state: 'Delhi',
        zip_code: '110001',
        assigned_contact: 'Priya Sharma',
        commission_rate: 15,
        commission_type: 'percentage',
        status: 'active',
        notes: 'Leading recruiter in South Asian market with strong MBA and business program focus.',
        created_at: '2024-04-15T06:00:00Z',
        updated_at: '2024-09-30T17:25:00Z'
      },
      {
        id: 'comp-5',
        name: 'Brazil Education Services',
        country: 'Brazil',
        website: 'https://www.brazileduca.com.br',
        phone: '+55-11-3456-7800',
        email: 'contato@brazileduca.com.br',
        address: 'Av. Paulista 1000',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01310-100',
        assigned_contact: 'Carlos Rodriguez',
        commission_rate: 9,
        commission_type: 'percentage',
        status: 'active',
        notes: 'Growing partnership with focus on STEM and computer science programs.',
        created_at: '2024-06-01T15:30:00Z',
        updated_at: '2024-08-22T11:15:00Z'
      },
      {
        id: 'comp-6',
        name: 'Global Education Network',
        country: 'Canada',
        website: 'https://www.globaledunet.ca',
        phone: '+1-416-555-9800',
        email: 'partners@globaledunet.ca',
        address: '567 University Avenue',
        city: 'Toronto',
        state: 'ON',
        zip_code: 'M5G 1X8',
        assigned_contact: 'Jennifer Chen',
        commission_rate: 11,
        commission_type: 'percentage',
        status: 'active',
        notes: 'Multi-national recruiter with strong presence across North America.',
        created_at: '2024-02-20T14:15:00Z',
        updated_at: '2024-12-10T10:30:00Z'
      },
      {
        id: 'comp-7',
        name: 'EuroStudy Partners',
        country: 'Germany',
        website: 'https://www.eurostudypartners.de',
        phone: '+49-30-1234-5600',
        email: 'info@eurostudypartners.de',
        address: 'Alexanderplatz 15',
        city: 'Berlin',
        state: 'Berlin',
        zip_code: '10178',
        assigned_contact: 'Hans Mueller',
        commission_rate: 7,
        commission_type: 'percentage',
        status: 'inactive',
        notes: 'Currently on hold pending contract renewal. Good performance history.',
        created_at: '2023-11-10T11:45:00Z',
        updated_at: '2024-06-15T08:20:00Z'
      },
      {
        id: 'comp-8',
        name: 'Asia Pacific Recruitment',
        country: 'Singapore',
        website: 'https://www.aprecruit.sg',
        phone: '+65-6789-0123',
        email: 'business@aprecruit.sg',
        address: '88 Marina Bay Street',
        city: 'Singapore',
        state: 'Singapore',
        zip_code: '018981',
        assigned_contact: 'Lisa Wang',
        commission_rate: 13,
        commission_type: 'percentage',
        status: 'active',
        notes: 'Regional hub for Southeast Asia with excellent conversion rates.',
        created_at: '2024-05-12T07:20:00Z',
        updated_at: '2024-11-28T16:40:00Z'
      },
      {
        id: 'comp-9',
        name: 'MidEast Education Hub',
        country: 'United Arab Emirates',
        website: 'https://www.meedhub.ae',
        phone: '+971-4-123-4567',
        email: 'contact@meedhub.ae',
        address: 'Dubai International Financial Centre',
        city: 'Dubai',
        state: 'Dubai',
        zip_code: '00000',
        assigned_contact: 'Ahmed Al-Rashid',
        commission_rate: 14,
        commission_type: 'percentage',
        status: 'suspended',
        notes: 'Suspended due to compliance review. Previously strong performer in business programs.',
        created_at: '2024-01-30T13:10:00Z',
        updated_at: '2024-08-05T09:15:00Z'
      },
      {
        id: 'comp-10',
        name: 'African Education Network',
        country: 'South Africa',
        website: 'https://www.afednet.co.za',
        phone: '+27-21-555-7890',
        email: 'partnerships@afednet.co.za',
        address: '123 Long Street',
        city: 'Cape Town',
        state: 'Western Cape',
        zip_code: '8001',
        assigned_contact: 'Nomsa Mbeki',
        commission_rate: 16,
        commission_type: 'percentage',
        status: 'active',
        notes: 'New partnership with strong potential for growth across African markets.',
        created_at: '2024-09-15T10:25:00Z',
        updated_at: '2024-12-01T14:50:00Z'
      }
    ];
  }

  static async createRecruiterCompany(company: Partial<RecruiterCompany>): Promise<RecruiterCompany> {
    const { data, error } = await supabase
      .from('recruiter_companies')
      .insert(company as any)
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterCompany;
  }

  static async updateRecruiterCompany(id: string, updates: Partial<RecruiterCompany>): Promise<RecruiterCompany> {
    const { data, error } = await supabase
      .from('recruiter_companies')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterCompany;
  }

  // Recruiter User Management
  static async getRecruiterUsers(): Promise<RecruiterUser[]> {
    const { data, error } = await supabase
      .from('recruiter_users')
      .select(`
        *,
        company:recruiter_companies(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Return dummy users for preview
      return this.getDummyRecruiterUsers();
    }
    return data as RecruiterUser[];
  }

  // Generate dummy recruiter users
  static getDummyRecruiterUsers(): RecruiterUser[] {
    const companies = this.getDummyRecruiterCompanies();
    
    return [
      {
        id: 'rec-1',
        user_id: 'user-1',
        company_id: 'comp-1',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@edupartners.com',
        phone: '+1-555-0123',
        role: 'recruiter',
        is_active: true,
        last_login_at: '2025-01-06T14:20:00Z',
        created_at: '2024-06-15T09:00:00Z',
        updated_at: '2025-01-10T14:20:00Z',
        company: companies.find(c => c.id === 'comp-1')
      },
      {
        id: 'rec-2',
        user_id: 'user-2',
        company_id: 'comp-2',
        first_name: 'Michael',
        last_name: 'Chen',
        email: 'michael.chen@techrecruiters.au',
        phone: '+61-2-8765-4321',
        role: 'recruiter',
        is_active: true,
        last_login_at: '2025-01-05T08:15:00Z',
        created_at: '2024-03-20T11:30:00Z',
        updated_at: '2025-01-05T08:15:00Z',
        company: companies.find(c => c.id === 'comp-2')
      },
      {
        id: 'rec-3',
        user_id: 'user-3',
        company_id: 'comp-3',
        first_name: 'Emma',
        last_name: 'Williams',
        email: 'emma.williams@ukstudylink.co.uk',
        phone: '+44-20-7123-4567',
        role: 'recruiter',
        is_active: true,
        last_login_at: '2024-12-20T11:30:00Z',
        created_at: '2023-09-10T08:45:00Z',
        updated_at: '2024-12-15T11:30:00Z',
        company: companies.find(c => c.id === 'comp-3')
      },
      {
        id: 'rec-4',
        user_id: 'user-4',
        company_id: 'comp-4',
        first_name: 'Raj',
        last_name: 'Patel',
        email: 'raj.patel@indiaconnect.in',
        phone: '+91-11-9876-5432',
        role: 'company_admin',
        is_active: true,
        last_login_at: '2024-12-28T12:10:00Z',
        created_at: '2024-05-12T07:30:00Z',
        updated_at: '2024-11-25T12:10:00Z',
        company: companies.find(c => c.id === 'comp-4')
      },
      {
        id: 'rec-5',
        user_id: 'user-5',
        company_id: 'comp-5',
        first_name: 'Ana',
        last_name: 'Silva',
        email: 'ana.silva@brazileduca.com.br',
        phone: '+55-11-3456-7890',
        role: 'recruiter',
        is_active: true,
        last_login_at: '2024-12-15T10:20:00Z',
        created_at: '2024-07-08T14:45:00Z',
        updated_at: '2024-10-12T10:20:00Z',
        company: companies.find(c => c.id === 'comp-5')
      },
      {
        id: 'rec-6',
        user_id: 'user-6',
        company_id: 'comp-6',
        first_name: 'Jennifer',
        last_name: 'Chen',
        email: 'jennifer.chen@globaledunet.ca',
        phone: '+1-416-555-9801',
        role: 'company_admin',
        is_active: true,
        last_login_at: '2025-01-02T10:30:00Z',
        created_at: '2024-02-20T14:15:00Z',
        updated_at: '2024-12-10T10:30:00Z',
        company: companies.find(c => c.id === 'comp-6')
      },
      {
        id: 'rec-7',
        user_id: 'user-7',
        company_id: 'comp-8',
        first_name: 'Lisa',
        last_name: 'Wang',
        email: 'lisa.wang@aprecruit.sg',
        phone: '+65-6789-0124',
        role: 'recruiter',
        is_active: true,
        last_login_at: '2024-12-30T16:40:00Z',
        created_at: '2024-05-12T07:20:00Z',
        updated_at: '2024-11-28T16:40:00Z',
        company: companies.find(c => c.id === 'comp-8')
      },
      {
        id: 'rec-8',
        user_id: 'user-8',
        company_id: 'comp-10',
        first_name: 'Nomsa',
        last_name: 'Mbeki',
        email: 'nomsa.mbeki@afednet.co.za',
        phone: '+27-21-555-7891',
        role: 'recruiter',
        is_active: true,
        last_login_at: '2024-12-28T14:50:00Z',
        created_at: '2024-09-15T10:25:00Z',
        updated_at: '2024-12-01T14:50:00Z',
        company: companies.find(c => c.id === 'comp-10')
      }
    ];
  }

  static async getRecruiterProfile(): Promise<RecruiterUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('recruiter_users')
      .select(`
        *,
        company:recruiter_companies(*)
      `)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as RecruiterUser | null;
  }

  static async createRecruiterUser(userData: Partial<RecruiterUser>): Promise<RecruiterUser> {
    const { data, error } = await supabase
      .from('recruiter_users')
      .insert(userData as any)
      .select(`
        *,
        company:recruiter_companies(*)
      `)
      .single();

    if (error) throw error;
    return data as RecruiterUser;
  }

  // Recruiter Applications
  static async getRecruiterApplications(recruiterId?: string): Promise<RecruiterApplication[]> {
    let query = supabase
      .from('recruiter_applications')
      .select(`
        *,
        recruiter:recruiter_users(*),
        company:recruiter_companies(*)
      `)
      .order('submitted_at', { ascending: false });

    if (recruiterId) {
      query = query.eq('recruiter_id', recruiterId);
    }

    const { data, error } = await query;
    if (error) {
      // Return dummy data if database query fails or no data exists
      return this.getDummyRecruiterApplications();
    }
    
    // If no data, return dummy data
    if (!data || data.length === 0) {
      return this.getDummyRecruiterApplications();
    }
    
    return data as RecruiterApplication[];
  }

  // Generate comprehensive dummy data
  static getDummyRecruiterApplications(): RecruiterApplication[] {
    return [
      {
        id: 'app-1',
        recruiter_id: 'rec-1',
        company_id: 'comp-1',
        program: 'Bachelor of Business Administration',
        intake_date: '2025-02-15',
        status: 'submitted',
        commission_amount: 2500,
        commission_status: 'pending',
        submitted_at: '2025-01-15T10:30:00Z',
        reviewed_at: null,
        approved_at: null,
        notes_to_registrar: 'High-achieving student with excellent academic record. Particularly interested in international business.',
        student_id: 'stu-1',
        created_at: '2025-01-15T10:30:00Z',
        updated_at: '2025-01-15T10:30:00Z',
        recruiter: {
          id: 'rec-1',
          user_id: 'user-1',
          company_id: 'comp-1',
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@edupartners.com',
          phone: '+1-555-0123',
          role: 'recruiter',
          is_active: true,
          created_at: '2024-06-15T09:00:00Z',
          updated_at: '2025-01-10T14:20:00Z'
        },
        company: {
          id: 'comp-1',
          name: 'EduPartners Global',
          email: 'contact@edupartners.com',
          phone: '+1-555-0100',
          address: '123 Education Ave, New York, NY 10001',
          commission_rate: 10,
          commission_type: 'percentage',
          status: 'active',
          created_at: '2024-01-15T09:00:00Z',
          updated_at: '2024-12-01T16:45:00Z'
        }
      },
      {
        id: 'app-2',
        recruiter_id: 'rec-2',
        company_id: 'comp-2',
        program: 'Master of Information Technology',
        intake_date: '2025-03-01',
        status: 'in_review',
        commission_amount: 3500,
        commission_status: 'pending',
        submitted_at: '2025-01-10T14:15:00Z',
        reviewed_at: '2025-01-12T09:30:00Z',
        approved_at: null,
        notes_to_registrar: 'Student has strong programming background and industry experience. Looking for advanced specialization in AI.',
        student_id: 'stu-2',
        created_at: '2025-01-10T14:15:00Z',
        updated_at: '2025-01-12T09:30:00Z',
        recruiter: {
          id: 'rec-2',
          user_id: 'user-2',
          company_id: 'comp-2',
          first_name: 'Michael',
          last_name: 'Chen',
          email: 'michael.chen@techrecruiters.au',
          phone: '+61-2-8765-4321',
          role: 'recruiter',
          is_active: true,
          created_at: '2024-03-20T11:30:00Z',
          updated_at: '2025-01-05T08:15:00Z'
        },
        company: {
          id: 'comp-2',
          name: 'TechRecruiters Australia',
          email: 'info@techrecruiters.au',
          phone: '+61-2-8765-4300',
          address: '456 Tech Street, Sydney, NSW 2000',
          commission_rate: 12,
          commission_type: 'percentage',
          status: 'active',
          created_at: '2024-03-01T10:00:00Z',
          updated_at: '2024-11-15T13:20:00Z'
        }
      },
      {
        id: 'app-3',
        recruiter_id: 'rec-3',
        company_id: 'comp-3',
        program: 'Bachelor of Engineering (Civil)',
        intake_date: '2025-02-20',
        status: 'approved',
        commission_amount: 2800,
        commission_status: 'approved',
        submitted_at: '2024-12-20T16:45:00Z',
        reviewed_at: '2024-12-22T10:15:00Z',
        approved_at: '2024-12-23T14:30:00Z',
        notes_to_registrar: 'Outstanding candidate with perfect academic scores. Has completed internship with major construction firm.',
        student_id: 'stu-3',
        created_at: '2024-12-20T16:45:00Z',
        updated_at: '2024-12-23T14:30:00Z',
        recruiter: {
          id: 'rec-3',
          user_id: 'user-3',
          company_id: 'comp-3',
          first_name: 'Emma',
          last_name: 'Williams',
          email: 'emma.williams@ukstudylink.co.uk',
          phone: '+44-20-7123-4567',
          role: 'recruiter',
          is_active: true,
          created_at: '2023-09-10T08:45:00Z',
          updated_at: '2024-12-15T11:30:00Z'
        },
        company: {
          id: 'comp-3',
          name: 'UK Study Link',
          email: 'hello@ukstudylink.co.uk',
          phone: '+44-20-7123-4500',
          address: '789 London Road, London, SW1A 1AA',
          commission_rate: 8,
          commission_type: 'percentage',
          status: 'active',
          created_at: '2023-08-01T12:00:00Z',
          updated_at: '2024-10-20T09:45:00Z'
        }
      },
      {
        id: 'app-4',
        recruiter_id: 'rec-4',
        company_id: 'comp-4',
        program: 'Master of Business Administration (MBA)',
        intake_date: '2025-01-30',
        status: 'rejected',
        commission_amount: 0,
        commission_status: 'pending',
        submitted_at: '2024-11-30T09:20:00Z',
        reviewed_at: '2024-12-05T15:45:00Z',
        approved_at: null,
        notes_to_registrar: 'Application did not meet minimum work experience requirements for MBA program.',
        student_id: 'stu-4',
        created_at: '2024-11-30T09:20:00Z',
        updated_at: '2024-12-05T15:45:00Z',
        recruiter: {
          id: 'rec-4',
          user_id: 'user-4',
          company_id: 'comp-4',
          first_name: 'Raj',
          last_name: 'Patel',
          email: 'raj.patel@indiaconnect.in',
          phone: '+91-11-9876-5432',
          role: 'recruiter',
          is_active: true,
          created_at: '2024-05-12T07:30:00Z',
          updated_at: '2024-11-25T12:10:00Z'
        },
        company: {
          id: 'comp-4',
          name: 'India Connect Education',
          email: 'contact@indiaconnect.in',
          phone: '+91-11-9876-5400',
          address: '321 Delhi Gate, New Delhi, 110001',
          commission_rate: 15,
          commission_type: 'percentage',
          status: 'active',
          created_at: '2024-04-15T06:00:00Z',
          updated_at: '2024-09-30T17:25:00Z'
        }
      },
      {
        id: 'app-5',
        recruiter_id: 'rec-5',
        company_id: 'comp-5',
        program: 'Bachelor of Computer Science',
        intake_date: '2025-07-15',
        status: 'payment_pending',
        commission_amount: 2200,
        commission_status: 'approved',
        submitted_at: '2024-10-15T11:10:00Z',
        reviewed_at: '2024-10-18T13:20:00Z',
        approved_at: '2024-10-20T16:00:00Z',
        notes_to_registrar: 'Exceptional coding skills demonstrated through portfolio. Winner of national programming competition.',
        student_id: 'stu-5',
        created_at: '2024-10-15T11:10:00Z',
        updated_at: '2024-10-20T16:00:00Z',
        recruiter: {
          id: 'rec-5',
          user_id: 'user-5',
          company_id: 'comp-5',
          first_name: 'Ana',
          last_name: 'Silva',
          email: 'ana.silva@brazileduca.com.br',
          phone: '+55-11-3456-7890',
          role: 'recruiter',
          is_active: true,
          created_at: '2024-07-08T14:45:00Z',
          updated_at: '2024-10-12T10:20:00Z'
        },
        company: {
          id: 'comp-5',
          name: 'Brazil Education Services',
          email: 'contato@brazileduca.com.br',
          phone: '+55-11-3456-7800',
          address: 'Av. Paulista 1000, São Paulo, SP 01310-100',
          commission_rate: 9,
          commission_type: 'percentage',
          status: 'active',
          created_at: '2024-06-01T15:30:00Z',
          updated_at: '2024-08-22T11:15:00Z'
        }
      }
    ];
  }

  static async getRecruiterApplication(id: string): Promise<RecruiterApplication> {
    const { data, error } = await supabase
      .from('recruiter_applications')
      .select(`
        *,
        recruiter:recruiter_users(*),
        company:recruiter_companies(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as RecruiterApplication;
  }

  static async createRecruiterApplication(formData: StudentApplicationFormData): Promise<RecruiterApplication> {
    const recruiterProfile = await this.getRecruiterProfile();
    if (!recruiterProfile) throw new Error('Recruiter profile not found');

    // Create the application record
    const { data: application, error } = await supabase
      .from('recruiter_applications')
      .insert({
        recruiter_id: recruiterProfile.id,
        company_id: recruiterProfile.company_id,
        program: formData.program,
        intake_date: formData.intake_date,
        notes_to_registrar: formData.notes_to_registrar,
      })
      .select(`
        *,
        recruiter:recruiter_users(*),
        company:recruiter_companies(*)
      `)
      .single();

    if (error) throw error;

    // Create student record if needed
    if (formData.first_name && formData.last_name && formData.email) {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          program: formData.program,
          stage: 'application',
          recruiter_id: recruiterProfile.id,
          recruiter_company_id: recruiterProfile.company_id,
          student_id: 'AUTO_GENERATED',
          user_id: 'TBD'
        } as any)
        .select()
        .single();

      if (!studentError && student) {
        // Link the application to the student
        await supabase
          .from('recruiter_applications')
          .update({ student_id: student.id })
          .eq('id', application.id);
      }
    }

    return application as RecruiterApplication;
  }

  static async updateRecruiterApplicationStatus(
    id: string, 
    status: RecruiterApplication['status'],
    feedback?: string
  ): Promise<RecruiterApplication> {
    const updates: any = { status };
    
    if (status === 'approved') {
      updates.approved_at = new Date().toISOString();
    }
    if (status === 'in_review') {
      updates.reviewed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('recruiter_applications')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        recruiter:recruiter_users(*),
        company:recruiter_companies(*)
      `)
      .single();

    if (error) throw error;

    // Add communication if feedback provided
    if (feedback) {
      await this.createCommunication(id, 'internal', feedback);
    }

    return data as RecruiterApplication;
  }

  // Communications
  static async getCommunications(applicationId: string): Promise<RecruiterCommunication[]> {
    const { data, error } = await supabase
      .from('recruiter_communications')
      .select('*')
      .eq('recruiter_application_id', applicationId)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      // Return dummy communications for preview
      return this.getDummyCommunications(applicationId);
    }
    return data as RecruiterCommunication[];
  }

  static getDummyCommunications(applicationId: string): RecruiterCommunication[] {
    const communicationsMap: Record<string, RecruiterCommunication[]> = {
      'app-1': [
        {
          id: 'comm-1-1',
          recruiter_application_id: applicationId,
          sender_type: 'recruiter',
          sender_id: 'rec-1',
          message: 'Application submitted for review. Student is very eager to start the program.',
          is_internal: false,
          created_at: '2025-01-15T10:35:00Z'
        },
        {
          id: 'comm-1-2',
          recruiter_application_id: applicationId,
          sender_type: 'internal',
          sender_id: 'admin-1',
          message: 'Thank you for the submission. We will review this application within 3-5 business days.',
          is_internal: true,
          created_at: '2025-01-15T11:00:00Z'
        }
      ],
      'app-2': [
        {
          id: 'comm-2-1',
          recruiter_application_id: applicationId,
          sender_type: 'recruiter',
          sender_id: 'rec-2',
          message: 'Student has strong technical background and industry experience.',
          is_internal: false,
          created_at: '2025-01-10T14:20:00Z'
        },
        {
          id: 'comm-2-2',
          recruiter_application_id: applicationId,
          sender_type: 'internal',
          sender_id: 'admin-1',
          message: 'Application is currently under review by our academic committee.',
          is_internal: true,
          created_at: '2025-01-12T09:35:00Z'
        },
        {
          id: 'comm-2-3',
          recruiter_application_id: applicationId,
          sender_type: 'internal',
          sender_id: 'admin-2',
          message: 'Please provide additional documentation for work experience verification.',
          is_internal: true,
          created_at: '2025-01-14T15:20:00Z'
        }
      ],
      'app-3': [
        {
          id: 'comm-3-1',
          recruiter_application_id: applicationId,
          sender_type: 'recruiter',
          sender_id: 'rec-3',
          message: 'Excellent candidate with perfect grades and strong recommendations.',
          is_internal: false,
          created_at: '2024-12-20T16:50:00Z'
        },
        {
          id: 'comm-3-2',
          recruiter_application_id: applicationId,
          sender_type: 'internal',
          sender_id: 'admin-1',
          message: 'Application approved! Please proceed with enrollment process.',
          is_internal: true,
          created_at: '2024-12-23T14:35:00Z'
        }
      ]
    };

    return communicationsMap[applicationId] || [];
  }

  static async createCommunication(
    applicationId: string,
    senderType: 'recruiter' | 'internal',
    message: string
  ): Promise<RecruiterCommunication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('recruiter_communications')
      .insert({
        recruiter_application_id: applicationId,
        sender_type: senderType,
        sender_id: user.id,
        message,
      })
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterCommunication;
  }

  // Documents
  static async getApplicationDocuments(applicationId: string): Promise<RecruiterDocument[]> {
    const { data, error } = await supabase
      .from('recruiter_documents')
      .select('*')
      .eq('recruiter_application_id', applicationId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Return dummy documents for preview
      return this.getDummyDocuments(applicationId);
    }
    return data as RecruiterDocument[];
  }

  static getDummyDocuments(applicationId: string): RecruiterDocument[] {
    const documentsMap: Record<string, RecruiterDocument[]> = {
      'app-1': [
        {
          id: 'doc-1-1',
          recruiter_application_id: applicationId,
          uploaded_by: 'rec-1',
          document_name: 'academic_transcript.pdf',
          document_type: 'Academic Transcript',
          file_size: 245760,
          status: 'pending',
          feedback: null,
          created_at: '2025-01-15T10:32:00Z',
          updated_at: '2025-01-15T10:32:00Z'
        },
        {
          id: 'doc-1-2',
          recruiter_application_id: applicationId,
          uploaded_by: 'rec-1',
          document_name: 'personal_statement.pdf',
          document_type: 'Personal Statement',
          file_size: 102400,
          status: 'pending',
          feedback: null,
          created_at: '2025-01-15T10:33:00Z',
          updated_at: '2025-01-15T10:33:00Z'
        }
      ],
      'app-2': [
        {
          id: 'doc-2-1',
          recruiter_application_id: applicationId,
          uploaded_by: 'rec-2',
          document_name: 'degree_certificate.pdf',
          document_type: 'Degree Certificate',
          file_size: 358400,
          status: 'approved',
          feedback: 'Document verified and accepted.',
          created_at: '2025-01-10T14:18:00Z',
          updated_at: '2025-01-12T09:30:00Z'
        },
        {
          id: 'doc-2-2',
          recruiter_application_id: applicationId,
          uploaded_by: 'rec-2',
          document_name: 'work_experience_letter.pdf',
          document_type: 'Work Experience',
          file_size: 180224,
          status: 'pending',
          feedback: null,
          created_at: '2025-01-10T14:19:00Z',
          updated_at: '2025-01-10T14:19:00Z'
        },
        {
          id: 'doc-2-3',
          recruiter_application_id: applicationId,
          uploaded_by: 'rec-2',
          document_name: 'portfolio_projects.zip',
          document_type: 'Portfolio',
          file_size: 2048000,
          status: 'approved',
          feedback: 'Excellent technical portfolio demonstrating strong programming skills.',
          created_at: '2025-01-10T14:22:00Z',
          updated_at: '2025-01-12T11:45:00Z'
        }
      ],
      'app-3': [
        {
          id: 'doc-3-1',
          recruiter_application_id: applicationId,
          uploaded_by: 'rec-3',
          document_name: 'final_transcript.pdf',
          document_type: 'Academic Transcript',
          file_size: 421888,
          status: 'approved',
          feedback: 'Outstanding academic performance.',
          created_at: '2024-12-20T16:47:00Z',
          updated_at: '2024-12-22T10:15:00Z'
        },
        {
          id: 'doc-3-2',
          recruiter_application_id: applicationId,
          uploaded_by: 'rec-3',
          document_name: 'recommendation_letters.pdf',
          document_type: 'Recommendation Letters',
          file_size: 307200,
          status: 'approved',
          feedback: 'Strong recommendations from professors.',
          created_at: '2024-12-20T16:48:00Z',
          updated_at: '2024-12-22T14:20:00Z'
        }
      ]
    };

    return documentsMap[applicationId] || [];
  }

  static async uploadDocument(
    applicationId: string,
    file: File,
    documentType: string
  ): Promise<RecruiterDocument> {
    const recruiterProfile = await this.getRecruiterProfile();
    if (!recruiterProfile) throw new Error('Recruiter profile not found');

    // For now, we'll store document metadata without actual file upload
    // File upload would require storage bucket setup
    const { data, error } = await supabase
      .from('recruiter_documents')
      .insert({
        recruiter_application_id: applicationId,
        uploaded_by: recruiterProfile.id,
        document_name: file.name,
        document_type: documentType,
        file_size: file.size,
      })
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterDocument;
  }

  static async updateDocumentStatus(
    id: string,
    status: 'approved' | 'rejected',
    feedback?: string
  ): Promise<RecruiterDocument> {
    const { data, error } = await supabase
      .from('recruiter_documents')
      .update({ status, feedback })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterDocument;
  }

  // Analytics
  static async getRecruiterStats(recruiterId?: string) {
    let applicationsQuery = supabase
      .from('recruiter_applications')
      .select('status, commission_amount');

    if (recruiterId) {
      applicationsQuery = applicationsQuery.eq('recruiter_id', recruiterId);
    }

    const { data: applications, error } = await applicationsQuery;
    if (error) throw error;

    const stats = {
      totalApplications: applications?.length || 0,
      approvedApplications: applications?.filter(app => app.status === 'approved').length || 0,
      pendingApplications: applications?.filter(app => app.status === 'submitted' || app.status === 'in_review').length || 0,
      rejectedApplications: applications?.filter(app => app.status === 'rejected').length || 0,
      commissionOwed: applications?.reduce((sum, app) => sum + (app.commission_amount || 0), 0) || 0,
    };

    return stats;
  }
}