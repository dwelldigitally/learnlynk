import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserWithDetails {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: string[];
  team_name: string | null;
  team_type: string | null;
  created_at: string;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users-directory'],
    queryFn: async () => {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles' as any)
        .select('user_id, full_name, avatar_url, created_at, email');
      
      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles' as any)
        .select('user_id, role');
      
      if (rolesError) throw rolesError;

      // Fetch team hierarchy to map manager_id to teams
      const { data: teams, error: teamsError } = await supabase
        .from('team_hierarchy' as any)
        .select('id, name, type, manager_id')
        .eq('type', 'individual');
      
      if (teamsError) throw teamsError;

      // Build user roles map
      const rolesMap = new Map<string, string[]>();
      (userRoles || []).forEach((ur: any) => {
        if (!rolesMap.has(ur.user_id)) {
          rolesMap.set(ur.user_id, []);
        }
        rolesMap.get(ur.user_id)!.push(ur.role);
      });

      // Build team map by manager_id
      const teamMap = new Map<string, { name: string; type: string }>();
      (teams || []).forEach((team: any) => {
        if (team.manager_id) {
          teamMap.set(team.manager_id, { name: team.name, type: team.type });
        }
      });

      // Combine data
      const users: UserWithDetails[] = (profiles || []).map((profile: any) => ({
        id: profile.user_id,
        email: profile.email || 'No email',
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        roles: rolesMap.get(profile.user_id) || [],
        team_name: teamMap.get(profile.user_id)?.name || null,
        team_type: teamMap.get(profile.user_id)?.type || null,
        created_at: profile.created_at,
      }));

      return users;
    },
  });
};
