import { supabase } from "@/integrations/supabase/client";

export interface OnboardingData {
  // Company/Institution data
  institutionName?: string;
  institutionType?: string;
  website?: string;
  description?: string;
  established?: string;
  accreditation?: string;
  studentCapacity?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  
  // Programs data
  programs?: Array<{
    id?: string;
    name: string;
    description: string;
    duration?: string;
    tuitionFee?: string;
    applicationFee?: string;
    level?: string;
    requirements?: string[];
    intakes?: string[];
    fees?: {
      tuition?: string;
      application?: string;
    };
  }>;
  
  // Teams data
  teams?: Array<{
    id?: string;
    name: string;
    type: string;
    description?: string;
    specializations?: string[];
    region?: string;
    max_daily_assignments?: number;
    contact_email?: string;
    contact_phone?: string;
    is_active?: boolean;
  }>;
  
  // Other onboarding data
  [key: string]: any;
}

export class OnboardingService {
  static async saveOnboardingData(onboardingData: OnboardingData): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save company profile data
      if (onboardingData.institutionName) {
        const companyProfileData = {
          name: onboardingData.institutionName,
          description: onboardingData.description,
          website: onboardingData.website,
          email: onboardingData.email,
          phone: onboardingData.phone,
          address: onboardingData.address,
          city: onboardingData.city,
          state: onboardingData.state,
          zip_code: onboardingData.zipCode,
          country: onboardingData.country,
          logo_url: onboardingData.logoUrl,
          primary_color: onboardingData.primaryColor,
          secondary_color: onboardingData.secondaryColor,
          founded_year: onboardingData.established ? parseInt(onboardingData.established) : null,
        };

        const { error: companyError } = await supabase
          .from('company_profile')
          .upsert(companyProfileData);

        if (companyError) {
          console.error('Error saving company profile:', companyError);
          errors.push(`Failed to save institution profile: ${companyError.message}`);
        }
      }

      // Save programs data
      if (onboardingData.programs && onboardingData.programs.length > 0) {
        for (const program of onboardingData.programs) {
          const programData = {
            user_id: user.id,
            name: program.name,
            description: program.description || '',
            duration: program.duration || '4 years',
            type: 'degree',
            tuition: program.tuitionFee ? parseFloat(program.tuitionFee.replace(/[^0-9.]/g, '')) : null,
            entry_requirements: program.requirements || [],
            enrollment_status: 'open'
          };

          const { data: savedProgram, error: programError } = await supabase
            .from('programs')
            .insert(programData)
            .select()
            .single();

          if (programError) {
            console.error('Error saving program:', programError);
            errors.push(`Failed to save program ${program.name}: ${programError.message}`);
            continue;
          }

          // Save intakes for this program
          if (program.intakes && program.intakes.length > 0 && savedProgram) {
            for (const intakeName of program.intakes) {
              const intakeData = {
                user_id: user.id,
                program_id: savedProgram.id,
                name: intakeName,
                start_date: new Date(new Date().getFullYear() + 1, 8, 1).toISOString().split('T')[0], // Format as YYYY-MM-DD
                capacity: 50, // Default capacity
                status: 'open'
              };

              const { error: intakeError } = await supabase
                .from('intakes')
                .insert(intakeData);

              if (intakeError) {
                console.error('Error saving intake:', intakeError);
                errors.push(`Failed to save intake ${intakeName}: ${intakeError.message}`);
              }
            }
          }
        }
      }

      // Save teams data
      if (onboardingData.teams && onboardingData.teams.length > 0) {
        for (const team of onboardingData.teams) {
          const teamData = {
            name: team.name,
            description: team.description,
            specializations: team.specializations || [],
            region: team.region,
            max_daily_assignments: team.max_daily_assignments || 50,
            is_active: team.is_active !== false
          };

          const { error: teamError } = await supabase
            .from('advisor_teams')
            .insert(teamData);

          if (teamError) {
            console.error('Error saving team:', teamError);
            errors.push(`Failed to save team ${team.name}: ${teamError.message}`);
          }
        }
      }

      return { success: errors.length === 0, errors };
    } catch (error) {
      console.error('Error in saveOnboardingData:', error);
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, errors };
    }
  }

  static async getOnboardingDataFromLocalStorage(): Promise<OnboardingData | null> {
    try {
      const savedData = localStorage.getItem('onboarding-progress');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error reading onboarding data from localStorage:', error);
    }
    return null;
  }

  static async clearOnboardingData(): Promise<void> {
    try {
      localStorage.removeItem('onboarding-progress');
      localStorage.setItem('onboarding-completed', 'true');
    } catch (error) {
      console.error('Error clearing onboarding data:', error);
    }
  }

  static async markOnboardingComplete(): Promise<void> {
    try {
      localStorage.setItem('onboarding-completed', 'true');
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
    }
  }
}
