import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Not authenticated');
          return;
        }

        // Fetch all profiles (team members)
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name, email, avatar_url')
          .order('first_name');

        if (profilesError) {
          console.error('Error fetching team members:', profilesError);
          // Fallback to current user only
          setTeamMembers([{
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Me',
            email: user.email || '',
          }]);
          return;
        }

        const members: TeamMember[] = (profiles || []).map(profile => ({
          id: profile.user_id,
          name: [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email || 'Unknown',
          email: profile.email || '',
          avatar_url: profile.avatar_url || undefined,
        }));

        // If no profiles found, use current user
        if (members.length === 0) {
          members.push({
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Me',
            email: user.email || '',
            role: 'Current User'
          });
        }

        setTeamMembers(members);
        setError(null);
      } catch (err) {
        console.error('Error in useTeamMembers:', err);
        setError('Failed to fetch team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error };
}
