import { supabase } from "@/integrations/supabase/client";
import { DemoDataService } from "@/services/demoDataService";

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
  
  // Data setup configuration
  dataSetup?: {
    dataChoice: 'sample' | 'manual' | 'fresh';
    leads?: Array<{
      name: string;
      email: string;
      phone: string;
      program: string;
      source: string;
    }>;
    students?: Array<{
      name: string;
      email: string;
      studentId: string;
      program: string;
      stage: string;
    }>;
    applications?: Array<{
      studentName: string;
      email: string;
      program: string;
      status: string;
    }>;
  };
  
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

      // Handle data setup
      if (onboardingData.dataSetup) {
        const { dataChoice } = onboardingData.dataSetup;
        
        if (dataChoice === 'sample') {
          // Assign demo data to user and create routing/scoring rules
          try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser?.email) {
              const { error: demoError } = await supabase.rpc('assign_demo_data_to_user', {
                target_email: currentUser.email,
                demo_enabled: true
              });
              
              if (demoError) {
                console.error('Error assigning demo data:', demoError);
                errors.push('Failed to assign sample data');
              }

              // Create demo routing rules
              const demoRoutingRules = DemoDataService.getDemoRoutingRules();
              for (const rule of demoRoutingRules) {
                const { error: routingError } = await supabase
                  .from('lead_routing_rules')
                  .insert({
                    name: rule.name,
                    description: rule.description,
                    priority: rule.priority,
                    is_active: rule.is_active,
                    conditions: rule.condition_groups,
                    assignment_config: rule.assignment_config
                  });
                
                if (routingError) {
                  console.error('Error creating demo routing rule:', routingError);
                  errors.push(`Failed to create routing rule: ${rule.name}`);
                }
              }

              // Create demo scoring rules
              const demoScoringRules = DemoDataService.getDemoScoringRules();
              for (const rule of demoScoringRules) {
                const { error: scoringError } = await supabase
                  .from('lead_scoring_rules')
                  .insert({
                    user_id: currentUser.id,
                    name: rule.name,
                    description: rule.description,
                    field: rule.field_name,
                    condition: rule.scoring_logic.type,
                    value: JSON.stringify(rule.scoring_logic.rules),
                    points: 10, // Default points, will be calculated from rules
                    enabled: rule.is_active,
                    order_index: rule.order_index
                  });
                
                if (scoringError) {
                  console.error('Error creating demo scoring rule:', scoringError);
                  errors.push(`Failed to create scoring rule: ${rule.name}`);
                }
              }

              // Create demo scoring settings
              const demoScoringSettings = DemoDataService.getDemoScoringSettings();
              const { error: settingsError } = await supabase
                .from('lead_scoring_settings')
                .insert({
                  user_id: currentUser.id,
                  name: 'Default Scoring Configuration',
                  description: 'Default lead scoring settings created during onboarding',
                  is_active: true,
                  scoring_algorithm: demoScoringSettings.scoring_algorithm,
                  max_score: demoScoringSettings.max_score,
                  auto_scoring_enabled: demoScoringSettings.auto_scoring_enabled,
                  settings_data: {
                    min_score: demoScoringSettings.min_score,
                    default_score: demoScoringSettings.default_score,
                    recalculate_on_update: demoScoringSettings.recalculate_on_update,
                    ai_enhancement_enabled: demoScoringSettings.ai_enhancement_enabled,
                    real_time_scoring: demoScoringSettings.real_time_scoring
                  }
                });
              
              if (settingsError) {
                console.error('Error creating demo scoring settings:', settingsError);
                errors.push('Failed to create scoring settings');
              }

              // Create demo routing templates
              const demoTemplates = DemoDataService.getDemoRoutingTemplates();
              for (const template of demoTemplates) {
                const { error: templateError } = await supabase
                  .from('routing_templates')
                  .insert({
                    user_id: currentUser.id,
                    name: template.name,
                    description: template.description,
                    category: template.category,
                    template_data: template.template_data,
                    is_system_template: template.is_system_template,
                    usage_count: template.usage_count
                  });
                
                if (templateError) {
                  console.error('Error creating demo routing template:', templateError);
                  errors.push(`Failed to create template: ${template.name}`);
                }
              }

              // Create demo advisor teams
              const demoTeams = DemoDataService.getDemoAdvisorTeams();
              for (const team of demoTeams) {
                const { error: teamError } = await supabase
                  .from('advisor_teams')
                  .insert({
                    name: team.name,
                    description: team.description,
                    is_active: team.is_active,
                    max_daily_assignments: team.max_daily_assignments,
                    region: team.region,
                    specializations: team.specializations
                  });
                
                if (teamError) {
                  console.error('Error creating demo advisor team:', teamError);
                  errors.push(`Failed to create team: ${team.name}`);
                }
              }
            }
          } catch (demoError) {
            console.error('Error in demo data assignment:', demoError);
            errors.push('Failed to set up sample data');
          }
        } else if (dataChoice === 'manual') {
          // Save manually entered data
          const { leads, students, applications } = onboardingData.dataSetup;
          
          // Save leads
          if (leads && leads.length > 0) {
            for (const lead of leads) {
              if (lead.name && lead.email) {
                const sourceMap: { [key: string]: 'web' | 'social_media' | 'referral' | 'ads' | 'event' | 'email' | 'phone' | 'forms' } = {
                  'Website': 'web',
                  'Social Media': 'social_media',
                  'Referral': 'referral',
                  'Advertisement': 'ads',
                  'Event': 'event'
                };
                
                const leadData = {
                  user_id: user.id,
                  first_name: lead.name.split(' ')[0],
                  last_name: lead.name.split(' ').slice(1).join(' ') || '',
                  email: lead.email,
                  phone: lead.phone,
                  program_interest: [lead.program],
                  source: sourceMap[lead.source] || 'web' as 'web',
                  status: 'new' as 'new'
                };

                const { error: leadError } = await supabase
                  .from('leads')
                  .insert(leadData);

                if (leadError) {
                  console.error('Error saving lead:', leadError);
                  errors.push(`Failed to save lead ${lead.name}`);
                }
              }
            }
          }

          // Save applications
          if (applications && applications.length > 0) {
            for (const app of applications) {
              if (app.studentName && app.email) {
                const appData = {
                  user_id: user.id,
                  student_name: app.studentName,
                  email: app.email,
                  program: app.program,
                  status: app.status,
                  application_date: new Date().toISOString()
                };

                const { error: appError } = await supabase
                  .from('applications')
                  .insert(appData);

                if (appError) {
                  console.error('Error saving application:', appError);
                  errors.push(`Failed to save application for ${app.studentName}`);
                }
              }
            }
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
