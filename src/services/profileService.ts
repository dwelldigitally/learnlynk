import { supabase } from '@/integrations/supabase/client';

export interface ProfileData {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  user_role?: string;
  onboarding_completed_at?: string;
}

export class ProfileService {
  /**
   * Creates a profile for a new user, typically called after OAuth login
   */
  static async createUserProfile(userId: string, userData: any): Promise<{ data: ProfileData | null; error: any }> {
    try {
      // Extract data from user metadata (OAuth users)
      const firstName = userData.user_metadata?.first_name || userData.user_metadata?.given_name || '';
      const lastName = userData.user_metadata?.last_name || userData.user_metadata?.family_name || '';
      const avatarUrl = userData.user_metadata?.avatar_url || userData.user_metadata?.picture || '';
      const email = userData.email || '';
      
      // Determine user role based on OAuth provider or email domain
      const isOAuthUser = userData.app_metadata?.providers?.includes('google') || 
                         userData.app_metadata?.providers?.includes('azure');
      const userRole = isOAuthUser ? 'admin' : 'user';

      const profileData = {
        user_id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
        user_role: userRole,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return { data: null, error };
    }
  }

  /**
   * Gets or creates a profile for a user
   */
  static async getOrCreateProfile(userId: string, userData: any): Promise<{ data: ProfileData | null; error: any }> {
    try {
      // First, try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        return { data: null, error: fetchError };
      }

      if (existingProfile) {
        return { data: existingProfile, error: null };
      }

      // If no profile exists, create one
      return await this.createUserProfile(userId, userData);
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      return { data: null, error };
    }
  }

  /**
   * Marks onboarding as complete for a user
   */
  static async completeOnboarding(userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed_at: new Date().toISOString() 
        })
        .eq('user_id', userId);

      if (!error) {
        // Also update localStorage for quick access
        localStorage.setItem('onboarding-completed', 'true');
      }

      return { error };
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return { error };
    }
  }

  /**
   * Checks if a user has completed onboarding
   */
  static async hasCompletedOnboarding(userId: string): Promise<{ completed: boolean; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking onboarding status:', error);
        return { completed: false, error };
      }

      const completed = !!data?.onboarding_completed_at;
      return { completed, error: null };
    } catch (error) {
      console.error('Error in hasCompletedOnboarding:', error);
      return { completed: false, error };
    }
  }
}