import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo_url: string | null;
  subscription_tier: string;
  subscription_status: string;
  max_users: number;
  max_leads: number;
  settings: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  is_primary: boolean;
  status: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  tenantId: string | null;
  tenantRole: TenantUser['role'] | null;
  userTenants: Tenant[];
  loading: boolean;
  error: Error | null;
  isOwner: boolean;
  isAdmin: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  refetchTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

// No default tenant - users must have proper tenant membership

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenantRole, setTenantRole] = useState<TenantUser['role'] | null>(null);
  const [userTenants, setUserTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserTenants = useCallback(async () => {
    if (!user) {
      setTenant(null);
      setTenantRole(null);
      setUserTenants([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all tenants user belongs to
      const { data: tenantUsersData, error: tenantUsersError } = await supabase
        .from('tenant_users')
        .select(`
          id,
          tenant_id,
          role,
          is_primary,
          status,
          tenants:tenant_id (
            id,
            name,
            slug,
            domain,
            logo_url,
            subscription_tier,
            subscription_status,
            max_users,
            max_leads,
            settings,
            is_active,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (tenantUsersError) {
        console.warn('Tenant users fetch error:', tenantUsersError);
        // No fallback - user has no tenant membership
        setTenant(null);
        setTenantRole(null);
        setUserTenants([]);
        setLoading(false);
        return;
      }

      if (tenantUsersData && tenantUsersData.length > 0) {
        // Extract tenants from the join
        const tenants = tenantUsersData
          .filter(tu => tu.tenants)
          .map(tu => tu.tenants as unknown as Tenant);
        
        setUserTenants(tenants);

        // Find primary tenant or first active one
        const primaryTenantUser = tenantUsersData.find(tu => tu.is_primary) || tenantUsersData[0];
        
        if (primaryTenantUser && primaryTenantUser.tenants) {
          setTenant(primaryTenantUser.tenants as unknown as Tenant);
          setTenantRole(primaryTenantUser.role as TenantUser['role']);
        }
      } else {
        // No tenant membership - user needs to create/join a tenant
        console.log('User has no tenant membership');
        setTenant(null);
        setTenantRole(null);
        setUserTenants([]);
      }
    } catch (err) {
      console.error('Error fetching tenant:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch tenant'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserTenants();
  }, [fetchUserTenants]);

  const switchTenant = async (newTenantId: string) => {
    if (!user) return;

    try {
      // Verify user has access to this tenant
      const { data: tenantUser, error } = await supabase
        .from('tenant_users')
        .select(`
          role,
          tenants:tenant_id (*)
        `)
        .eq('user_id', user.id)
        .eq('tenant_id', newTenantId)
        .eq('status', 'active')
        .single();

      if (error || !tenantUser) {
        throw new Error('You do not have access to this tenant');
      }

      // Update primary tenant
      await supabase
        .from('tenant_users')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      await supabase
        .from('tenant_users')
        .update({ is_primary: true })
        .eq('user_id', user.id)
        .eq('tenant_id', newTenantId);

      setTenant(tenantUser.tenants as unknown as Tenant);
      setTenantRole(tenantUser.role as TenantUser['role']);
    } catch (err) {
      console.error('Error switching tenant:', err);
      throw err;
    }
  };

  const refetchTenant = async () => {
    await fetchUserTenants();
  };

  const isOwner = tenantRole === 'owner';
  const isAdmin = tenantRole === 'owner' || tenantRole === 'admin';

  return (
    <TenantContext.Provider
      value={{
        tenant,
        tenantId: tenant?.id || null,
        tenantRole,
        userTenants,
        loading,
        error,
        isOwner,
        isAdmin,
        switchTenant,
        refetchTenant
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export default TenantContext;
