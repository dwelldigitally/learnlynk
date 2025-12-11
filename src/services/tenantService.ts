import { supabase } from '@/integrations/supabase/client';

export interface CreateTenantParams {
  name: string;
  ownerId: string;
}

export interface InviteUserParams {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  tenantId: string;
  invitedBy: string;
}

export interface TenantInvitation {
  id: string;
  tenant_id: string;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  tenants?: {
    name: string;
    slug: string;
  };
}

export interface CompanyProfileData {
  name: string;
  website?: string;
  description?: string;
  email?: string;
  phone?: string;
  street_address?: string;
  city?: string;
  state_province?: string;
  country?: string;
  postal_code?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  founded_year?: number;
  timezone?: string;
  default_language?: string;
  currency?: string;
  data_residency_region?: string;
}

export const TenantService = {
  /**
   * Create a new tenant (institution) with the user as owner
   * Also creates an associated company_profile
   */
  async createTenant({ name, ownerId }: CreateTenantParams): Promise<string> {
    // Generate slug from name
    const { data: slugData, error: slugError } = await supabase
      .rpc('generate_tenant_slug', { p_name: name });

    if (slugError) {
      console.error('Error generating slug:', slugError);
      throw new Error('Failed to generate institution slug');
    }

    // Create tenant with owner
    const { data: tenantId, error } = await supabase
      .rpc('create_tenant_with_owner', {
        p_name: name,
        p_slug: slugData,
        p_owner_id: ownerId
      });

    if (error) {
      console.error('Error creating tenant:', error);
      throw new Error('Failed to create institution');
    }

    // Create initial company_profile for the tenant
    const { error: profileError } = await supabase
      .from('company_profile')
      .insert({
        name: name,
        tenant_id: tenantId,
        primary_color: '#3b82f6',
        secondary_color: '#6b7280',
        accent_color: '#10b981',
        timezone: 'America/Toronto',
        default_language: 'en',
        currency: 'USD',
        data_residency_region: 'CA',
        country: 'Canada'
      });

    if (profileError) {
      console.error('Error creating company profile:', profileError);
      // Don't throw - tenant was created successfully
    }

    return tenantId;
  },

  /**
   * Get or create company profile for a tenant
   */
  async getCompanyProfile(tenantId: string): Promise<CompanyProfileData | null> {
    const { data, error } = await supabase
      .from('company_profile')
      .select('*')
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching company profile:', error);
      return null;
    }

    return data;
  },

  /**
   * Update company profile for a tenant
   */
  async updateCompanyProfile(tenantId: string, data: Partial<CompanyProfileData>): Promise<void> {
    // Check if profile exists
    const { data: existing } = await supabase
      .from('company_profile')
      .select('id')
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('company_profile')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('tenant_id', tenantId);

      if (error) throw error;
    } else {
      // Insert new - construct the full object explicitly
      const insertData = {
        name: data.name || '',
        tenant_id: tenantId,
        website: data.website,
        description: data.description,
        email: data.email,
        phone: data.phone,
        street_address: data.street_address,
        city: data.city,
        state_province: data.state_province,
        country: data.country,
        postal_code: data.postal_code,
        logo_url: data.logo_url,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        accent_color: data.accent_color,
        founded_year: data.founded_year,
        timezone: data.timezone,
        default_language: data.default_language,
        currency: data.currency,
        data_residency_region: data.data_residency_region,
      };
      
      const { error } = await supabase
        .from('company_profile')
        .insert(insertData);

      if (error) throw error;
    }

    // Sync name to tenants table if name was updated
    if (data.name) {
      await supabase
        .from('tenants')
        .update({ name: data.name })
        .eq('id', tenantId);
    }
  },

  /**
   * Invite a user to join an existing tenant
   */
  async inviteUser({ email, role, tenantId, invitedBy }: InviteUserParams): Promise<TenantInvitation> {
    const { data, error } = await supabase
      .from('tenant_invitations')
      .insert({
        tenant_id: tenantId,
        email: email.toLowerCase(),
        role,
        created_by: invitedBy
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      throw new Error('Failed to create invitation');
    }

    return data as TenantInvitation;
  },

  /**
   * Validate an invitation token
   */
  async validateInvitation(token: string): Promise<TenantInvitation | null> {
    const { data, error } = await supabase
      .from('tenant_invitations')
      .select(`
        *,
        tenants:tenant_id (
          name,
          slug
        )
      `)
      .eq('token', token)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return null;
    }

    return data as TenantInvitation;
  },

  /**
   * Accept an invitation and join the tenant
   */
  async acceptInvitation(token: string, userId: string): Promise<string> {
    const { data: tenantId, error } = await supabase
      .rpc('accept_tenant_invitation', {
        p_token: token,
        p_user_id: userId
      });

    if (error) {
      console.error('Error accepting invitation:', error);
      throw new Error('Failed to accept invitation');
    }

    return tenantId;
  },

  /**
   * Get pending invitations for a tenant
   */
  async getPendingInvitations(tenantId: string): Promise<TenantInvitation[]> {
    const { data, error } = await supabase
      .from('tenant_invitations')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invitations:', error);
      return [];
    }

    return data as TenantInvitation[];
  },

  /**
   * Cancel an invitation
   */
  async cancelInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase
      .from('tenant_invitations')
      .delete()
      .eq('id', invitationId);

    if (error) {
      console.error('Error canceling invitation:', error);
      throw new Error('Failed to cancel invitation');
    }
  },

  /**
   * Resend an invitation (creates a new token)
   */
  async resendInvitation(invitationId: string): Promise<TenantInvitation> {
    // Delete old invitation and create new one with fresh token
    const { data: oldInvitation } = await supabase
      .from('tenant_invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (!oldInvitation) {
      throw new Error('Invitation not found');
    }

    await supabase
      .from('tenant_invitations')
      .delete()
      .eq('id', invitationId);

    const { data, error } = await supabase
      .from('tenant_invitations')
      .insert({
        tenant_id: oldInvitation.tenant_id,
        email: oldInvitation.email,
        role: oldInvitation.role,
        created_by: oldInvitation.created_by
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to resend invitation');
    }

    return data as TenantInvitation;
  }
};
