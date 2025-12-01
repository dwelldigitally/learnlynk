import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/types/team-management';

interface TeamInvitation {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  role: AppRole;
  invited_by: string;
  invite_token: string;
  personal_message: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

interface CreateInvitationParams {
  email: string;
  first_name: string;
  last_name?: string;
  role: AppRole;
  personal_message?: string;
}

export const useTeamInvitations = () => {
  return useQuery({
    queryKey: ['team-invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_invitations' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as unknown as TeamInvitation[];
    }
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: CreateInvitationParams) => {
      const { data, error } = await supabase.functions.invoke('send-team-invite', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invitations'] });
    }
  });
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('team_invitations' as any)
        .update({ status: 'cancelled' })
        .eq('id', invitationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invitations'] });
    }
  });
};

export const useValidateInviteToken = (token: string | null) => {
  return useQuery({
    queryKey: ['invite-validation', token],
    queryFn: async () => {
      if (!token) return null;
      
      const { data, error } = await supabase
        .from('team_invitations' as any)
        .select('*')
        .eq('invite_token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error) throw error;
      return data as unknown as TeamInvitation;
    },
    enabled: !!token
  });
};

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: async ({ userId, inviteToken }: { userId: string; inviteToken: string }) => {
      // Get the invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('team_invitations' as any)
        .select('*')
        .eq('invite_token', inviteToken)
        .eq('status', 'pending')
        .single();
      
      if (inviteError || !invitation) {
        throw new Error('Invalid or expired invitation');
      }

      const typedInvitation = invitation as unknown as TeamInvitation;
      
      // Assign the role to the user
      const { error: roleError } = await supabase
        .from('user_roles' as any)
        .insert({
          user_id: userId,
          role: typedInvitation.role
        });
      
      if (roleError) throw roleError;
      
      // Mark invitation as accepted
      const { error: updateError } = await supabase
        .from('team_invitations' as any)
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', typedInvitation.id);
      
      if (updateError) throw updateError;
      
      return typedInvitation.role;
    }
  });
};
