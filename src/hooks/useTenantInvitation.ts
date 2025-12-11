import { useState, useEffect } from 'react';
import { TenantService, TenantInvitation } from '@/services/tenantService';

export const useTenantInvitation = (token: string | null) => {
  const [invitation, setInvitation] = useState<TenantInvitation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setInvitation(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await TenantService.validateInvitation(token);
        if (data) {
          setInvitation(data);
        } else {
          setError('Invalid or expired invitation');
        }
      } catch (err) {
        setError('Failed to validate invitation');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  return { invitation, loading, error };
};
