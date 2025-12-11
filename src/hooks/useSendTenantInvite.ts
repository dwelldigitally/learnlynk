import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SendTenantInviteParams {
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

export const useSendTenantInvite = () => {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ email, role }: SendTenantInviteParams) => {
      if (!tenant || !user) {
        throw new Error('No tenant or user context');
      }

      // Get inviter name from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .single();

      const inviterName = profile 
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'A team member'
        : 'A team member';

      const { data, error } = await supabase.functions.invoke('send-tenant-invite', {
        body: {
          email,
          role,
          tenantId: tenant.id,
          tenantName: tenant.name,
          inviterName
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-invitations'] });
      toast.success('Invitation sent successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send invitation');
    }
  });
};
