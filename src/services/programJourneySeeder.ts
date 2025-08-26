import { supabase } from '@/integrations/supabase/client';

export class ProgramJourneySeeder {
  static async seedDummyJourneys(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if we already have journeys for this user
    const { data: existing } = await supabase
      .from('academic_journeys')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('Dummy journeys already exist for this user');
      return;
    }

    // Seed academic journeys
    const journeys = [
      {
        user_id: user.id,
        name: 'Computer Science Journey',
        description: 'Complete academic pathway for CS students from application to graduation',
        is_active: true,
        version: 1,
        metadata: {
          duration_months: 48,
          credit_hours: 120,
          specializations: ["AI/ML", "Web Development", "Cybersecurity"]
        }
      },
      {
        user_id: user.id,
        name: 'Business Administration Journey',
        description: 'Comprehensive MBA program focusing on leadership and strategy',
        is_active: true,
        version: 1,
        metadata: {
          duration_months: 24,
          credit_hours: 60,
          specializations: ["Finance", "Marketing", "Operations"]
        }
      },
      {
        user_id: user.id,
        name: 'Nursing Program Journey',
        description: 'Healthcare-focused nursing program with clinical rotations',
        is_active: true,
        version: 1,
        metadata: {
          duration_months: 36,
          credit_hours: 90,
          clinical_hours: 800
        }
      },
      {
        user_id: user.id,
        name: 'Engineering Foundation',
        description: 'Core engineering program with multiple discipline options',
        is_active: true,
        version: 2,
        metadata: {
          duration_months: 48,
          credit_hours: 128,
          specializations: ["Mechanical", "Electrical", "Civil"]
        }
      },
      {
        user_id: user.id,
        name: 'Data Science Accelerated',
        description: 'Fast-track data science program for working professionals',
        is_active: false,
        version: 1,
        metadata: {
          duration_months: 18,
          credit_hours: 45,
          format: "hybrid",
          weekend_intensive: true
        }
      },
      {
        user_id: user.id,
        name: 'Psychology & Counseling',
        description: 'Mental health counseling program with practicum requirements',
        is_active: true,
        version: 1,
        metadata: {
          duration_months: 30,
          credit_hours: 72,
          practicum_hours: 600
        }
      },
      {
        user_id: user.id,
        name: 'Digital Marketing Certification',
        description: 'Modern digital marketing skills and certification program',
        is_active: true,
        version: 1,
        metadata: {
          duration_months: 12,
          credit_hours: 36,
          certifications: ["Google Ads", "Facebook Marketing", "SEO"]
        }
      }
    ];

    // Insert journeys
    const { error: journeyError } = await supabase
      .from('academic_journeys')
      .insert(journeys);

    if (journeyError) {
      console.error('Error seeding journeys:', journeyError);
      throw journeyError;
    }

    // Also seed some program configurations
    const { data: existingPrograms } = await supabase
      .from('program_configurations')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (!existingPrograms || existingPrograms.length === 0) {
      const programConfigs = [
        {
          user_id: user.id,
          program_name: 'Computer Science',
          settings: {
            admission_requirements: ["High School Diploma", "Math Proficiency"],
            application_deadline: "March 15",
            start_dates: ["Fall", "Spring"]
          },
          is_active: true
        },
        {
          user_id: user.id,
          program_name: 'Business Administration',
          settings: {
            admission_requirements: ["Bachelor Degree", "GMAT Score", "Work Experience"],
            application_deadline: "January 31",
            start_dates: ["Fall", "Spring", "Summer"]
          },
          is_active: true
        },
        {
          user_id: user.id,
          program_name: 'Nursing',
          settings: {
            admission_requirements: ["Science Prerequisites", "CNA Certification", "Background Check"],
            application_deadline: "February 1",
            start_dates: ["Fall"]
          },
          is_active: true
        },
        {
          user_id: user.id,
          program_name: 'Engineering',
          settings: {
            admission_requirements: ["High School Diploma", "Advanced Math", "Science Courses"],
            application_deadline: "April 1",
            start_dates: ["Fall", "Spring"]
          },
          is_active: true
        },
        {
          user_id: user.id,
          program_name: 'Data Science',
          settings: {
            admission_requirements: ["Bachelor Degree", "Programming Experience", "Statistics Background"],
            application_deadline: "Rolling",
            start_dates: ["Monthly"]
          },
          is_active: true
        },
        {
          user_id: user.id,
          program_name: 'Psychology',
          settings: {
            admission_requirements: ["Bachelor Degree", "Psychology Prerequisites", "GRE Score"],
            application_deadline: "December 15",
            start_dates: ["Fall"]
          },
          is_active: true
        }
      ];

      const { error: programError } = await supabase
        .from('program_configurations')
        .insert(programConfigs);

      if (programError) {
        console.error('Error seeding program configs:', programError);
        throw programError;
      }
    }

    console.log('Successfully seeded dummy academic journeys and program configurations');
  }
}