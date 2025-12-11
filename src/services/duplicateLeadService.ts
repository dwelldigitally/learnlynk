import { supabase } from '@/integrations/supabase/client';
import type { Lead } from '@/types/lead';

export type DuplicatePreventionField = 'email' | 'phone' | 'both' | null;

export interface DuplicateGroup {
  id: string;
  matchType: 'exact_email' | 'exact_phone' | 'exact_both' | 'similar_name' | 'name_program';
  confidence: number;
  leads: Lead[];
  primaryLeadId?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingLead?: Lead;
  matchType?: string;
}

export interface ConflictResolution {
  programs: 'merge_all' | 'keep_primary';
  documents: 'merge_all' | 'keep_primary';
  status: 'keep_primary' | 'keep_newest';
  priority: 'keep_primary' | 'keep_highest';
  leadScore: 'keep_highest' | 'keep_primary';
  tags: 'merge_all' | 'keep_primary';
  notes: 'concatenate' | 'keep_primary';
}

export class DuplicateLeadService {
  /**
   * Get duplicate prevention setting for a tenant
   */
  static async getDuplicatePreventionSetting(tenantId: string): Promise<DuplicatePreventionField> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('settings')
        .eq('id', tenantId)
        .single();

      if (error || !data) return null;
      
      const settings = data.settings as Record<string, any> | null;
      return (settings?.duplicate_prevention_field as DuplicatePreventionField) || null;
    } catch (error) {
      console.error('Error getting duplicate prevention setting:', error);
      return null;
    }
  }

  /**
   * Set duplicate prevention setting for a tenant (one-time only)
   */
  static async setDuplicatePreventionSetting(
    tenantId: string,
    field: DuplicatePreventionField
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // First check if already configured
      const existingSetting = await this.getDuplicatePreventionSetting(tenantId);
      if (existingSetting) {
        return { success: false, error: 'Duplicate prevention is already configured and cannot be changed' };
      }

      // Get current settings
      const { data: tenant } = await supabase
        .from('tenants')
        .select('settings')
        .eq('id', tenantId)
        .single();

      const currentSettings = (tenant?.settings as Record<string, any>) || {};
      
      const { error } = await supabase
        .from('tenants')
        .update({
          settings: {
            ...currentSettings,
            duplicate_prevention_field: field,
            duplicate_prevention_configured_at: new Date().toISOString()
          }
        })
        .eq('id', tenantId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error setting duplicate prevention:', error);
      return { success: false, error: 'Failed to save duplicate prevention setting' };
    }
  }

  /**
   * Check if a new lead would be a duplicate based on tenant's settings
   */
  static async checkForDuplicate(
    email: string,
    phone: string | undefined,
    tenantId: string
  ): Promise<DuplicateCheckResult> {
    try {
      const preventionField = await this.getDuplicatePreventionSetting(tenantId);
      
      if (!preventionField) {
        return { isDuplicate: false };
      }

      let query = supabase
        .from('leads')
        .select('*')
        .eq('tenant_id', tenantId);

      if (preventionField === 'email') {
        query = query.ilike('email', email);
      } else if (preventionField === 'phone' && phone) {
        const normalizedPhone = this.normalizePhone(phone);
        query = query.or(`phone.ilike.%${normalizedPhone}%`);
      } else if (preventionField === 'both') {
        if (phone) {
          const normalizedPhone = this.normalizePhone(phone);
          query = query.or(`email.ilike.${email},phone.ilike.%${normalizedPhone}%`);
        } else {
          query = query.ilike('email', email);
        }
      }

      const { data, error } = await query.limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const existingLead = data[0] as Lead;
        let matchType = 'email';
        if (preventionField === 'phone') matchType = 'phone';
        else if (preventionField === 'both') {
          if (existingLead.email?.toLowerCase() === email.toLowerCase()) {
            matchType = phone && existingLead.phone?.includes(this.normalizePhone(phone)) ? 'email_and_phone' : 'email';
          } else {
            matchType = 'phone';
          }
        }
        return { isDuplicate: true, existingLead, matchType };
      }

      return { isDuplicate: false };
    } catch (error) {
      console.error('Error checking for duplicate:', error);
      return { isDuplicate: false };
    }
  }

  /**
   * Find all potential duplicate groups for a tenant
   */
  static async findPotentialDuplicates(tenantId: string): Promise<DuplicateGroup[]> {
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: true });

      if (error || !leads) return [];

      const duplicateGroups: DuplicateGroup[] = [];
      const processedIds = new Set<string>();

      // 1. Find exact email duplicates
      const emailGroups = this.groupByField(leads as Lead[], 'email');
      for (const [email, group] of Object.entries(emailGroups)) {
        if (group.length > 1 && email) {
          duplicateGroups.push({
            id: `email_${email}`,
            matchType: 'exact_email',
            confidence: 100,
            leads: group,
            primaryLeadId: group[0].id
          });
          group.forEach(l => processedIds.add(l.id));
        }
      }

      // 2. Find exact phone duplicates (excluding already processed)
      const remainingLeads = (leads as Lead[]).filter(l => !processedIds.has(l.id));
      const phoneGroups = this.groupByNormalizedPhone(remainingLeads);
      for (const [phone, group] of Object.entries(phoneGroups)) {
        if (group.length > 1 && phone) {
          duplicateGroups.push({
            id: `phone_${phone}`,
            matchType: 'exact_phone',
            confidence: 95,
            leads: group,
            primaryLeadId: group[0].id
          });
          group.forEach(l => processedIds.add(l.id));
        }
      }

      // 3. Find similar names (excluding already processed)
      const unprocessedLeads = (leads as Lead[]).filter(l => !processedIds.has(l.id));
      const nameGroups = this.findSimilarNames(unprocessedLeads);
      duplicateGroups.push(...nameGroups);

      // 4. Find name + program matches
      const nameProgGroups = this.findNameProgramMatches(unprocessedLeads);
      duplicateGroups.push(...nameProgGroups);

      return duplicateGroups;
    } catch (error) {
      console.error('Error finding duplicates:', error);
      return [];
    }
  }

  /**
   * Find exact duplicates based on tenant's prevention field
   */
  static async findExactDuplicates(tenantId: string): Promise<DuplicateGroup[]> {
    try {
      const preventionField = await this.getDuplicatePreventionSetting(tenantId);
      
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: true });

      if (error || !leads) return [];

      const duplicateGroups: DuplicateGroup[] = [];

      if (preventionField === 'email' || preventionField === 'both') {
        const emailGroups = this.groupByField(leads as Lead[], 'email');
        for (const [email, group] of Object.entries(emailGroups)) {
          if (group.length > 1 && email) {
            duplicateGroups.push({
              id: `exact_email_${email}`,
              matchType: 'exact_email',
              confidence: 100,
              leads: group,
              primaryLeadId: group[0].id
            });
          }
        }
      }

      if (preventionField === 'phone' || preventionField === 'both') {
        const phoneGroups = this.groupByNormalizedPhone(leads as Lead[]);
        for (const [phone, group] of Object.entries(phoneGroups)) {
          if (group.length > 1 && phone) {
            // Check if not already in email group
            const existingGroup = duplicateGroups.find(g => 
              g.leads.some(l => group.some(gl => gl.id === l.id))
            );
            if (!existingGroup) {
              duplicateGroups.push({
                id: `exact_phone_${phone}`,
                matchType: 'exact_phone',
                confidence: 100,
                leads: group,
                primaryLeadId: group[0].id
              });
            }
          }
        }
      }

      return duplicateGroups;
    } catch (error) {
      console.error('Error finding exact duplicates:', error);
      return [];
    }
  }

  /**
   * Merge two leads - keep primary, merge data from secondary, delete secondary
   */
  static async mergeLeads(
    primaryLeadId: string,
    secondaryLeadId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Fetch both leads
      const { data: leads, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .in('id', [primaryLeadId, secondaryLeadId]);

      if (fetchError || !leads || leads.length !== 2) {
        return { success: false, error: 'Could not fetch leads to merge' };
      }

      const primary = leads.find(l => l.id === primaryLeadId);
      const secondary = leads.find(l => l.id === secondaryLeadId);

      if (!primary || !secondary) {
        return { success: false, error: 'Could not identify primary and secondary leads' };
      }

      // Merge data - fill in blanks from secondary
      const mergedData: Record<string, any> = {};
      
      if (!primary.phone && secondary.phone) mergedData.phone = secondary.phone;
      if (!primary.country && secondary.country) mergedData.country = secondary.country;
      if (!primary.state && secondary.state) mergedData.state = secondary.state;
      if (!primary.city && secondary.city) mergedData.city = secondary.city;
      
      // Merge program interests
      const primaryPrograms = (primary.program_interest as string[]) || [];
      const secondaryPrograms = (secondary.program_interest as string[]) || [];
      const mergedPrograms = [...new Set([...primaryPrograms, ...secondaryPrograms])];
      if (mergedPrograms.length > primaryPrograms.length) {
        mergedData.program_interest = mergedPrograms;
      }

      // Merge tags
      const primaryTags = (primary.tags as string[]) || [];
      const secondaryTags = (secondary.tags as string[]) || [];
      const mergedTags = [...new Set([...primaryTags, ...secondaryTags])];
      if (mergedTags.length > primaryTags.length) {
        mergedData.tags = mergedTags;
      }

      // Add merge note
      const existingNotes = primary.notes || '';
      mergedData.notes = `${existingNotes}\n\n[Merged from duplicate lead ${secondary.email} on ${new Date().toLocaleDateString()}]`.trim();

      // Use higher score
      if ((secondary.lead_score || 0) > (primary.lead_score || 0)) {
        mergedData.lead_score = secondary.lead_score;
      }

      // Update primary lead with merged data
      if (Object.keys(mergedData).length > 0) {
        const { error: updateError } = await supabase
          .from('leads')
          .update(mergedData)
          .eq('id', primaryLeadId);

        if (updateError) throw updateError;
      }

      // Delete secondary lead
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', secondaryLeadId);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (error) {
      console.error('Error merging leads:', error);
      return { success: false, error: 'Failed to merge leads' };
    }
  }

  /**
   * Delete multiple duplicate leads
   */
  static async deleteDuplicates(leadIds: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const id of leadIds) {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        failed++;
      } else {
        success++;
      }
    }

    return { success, failed };
  }

  /**
   * Bulk merge multiple duplicate groups with conflict resolution
   */
  static async bulkMergeGroups(
    groups: DuplicateGroup[],
    resolution: ConflictResolution
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const group of groups) {
      try {
        const result = await this.mergeGroupWithResolution(group, resolution);
        if (result.success) {
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error('Error merging group:', error);
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Merge a single group with conflict resolution options
   */
  private static async mergeGroupWithResolution(
    group: DuplicateGroup,
    resolution: ConflictResolution
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const leads = group.leads;
      if (leads.length < 2) return { success: true };

      const primary = leads[0];
      const secondaries = leads.slice(1);

      const mergedData: Record<string, any> = {};

      // Merge programs
      if (resolution.programs === 'merge_all') {
        const allPrograms = leads.flatMap(l => (l.program_interest as string[]) || []);
        mergedData.program_interest = [...new Set(allPrograms)];
      }

      // Merge tags
      if (resolution.tags === 'merge_all') {
        const allTags = leads.flatMap(l => (l.tags as string[]) || []);
        mergedData.tags = [...new Set(allTags)];
      }

      // Handle priority
      if (resolution.priority === 'keep_highest') {
        const priorityOrder = ['urgent', 'high', 'medium', 'low'];
        const highestPriority = leads.reduce((highest, lead) => {
          const leadIndex = priorityOrder.indexOf(lead.priority);
          const highestIndex = priorityOrder.indexOf(highest);
          return leadIndex < highestIndex ? lead.priority : highest;
        }, primary.priority);
        mergedData.priority = highestPriority;
      }

      // Handle lead score
      if (resolution.leadScore === 'keep_highest') {
        const highestScore = Math.max(...leads.map(l => l.lead_score || 0));
        mergedData.lead_score = highestScore;
      }

      // Handle notes
      if (resolution.notes === 'concatenate') {
        const allNotes = leads
          .filter(l => l.notes)
          .map(l => l.notes)
          .join('\n\n---\n\n');
        mergedData.notes = allNotes || primary.notes;
      }

      // Fill in missing fields from secondaries
      for (const secondary of secondaries) {
        if (!primary.phone && secondary.phone) mergedData.phone = secondary.phone;
        if (!primary.country && secondary.country) mergedData.country = secondary.country;
        if (!primary.state && secondary.state) mergedData.state = secondary.state;
        if (!primary.city && secondary.city) mergedData.city = secondary.city;
      }

      // Add merge note
      mergedData.notes = `${mergedData.notes || primary.notes || ''}\n\n[Merged ${secondaries.length} duplicate(s) on ${new Date().toLocaleDateString()}]`.trim();

      // Update primary lead
      if (Object.keys(mergedData).length > 0) {
        const { error: updateError } = await supabase
          .from('leads')
          .update(mergedData)
          .eq('id', primary.id);

        if (updateError) throw updateError;
      }

      // Handle documents if merge_all
      if (resolution.documents === 'merge_all') {
        for (const secondary of secondaries) {
          // Update documents to point to primary lead
          await supabase
            .from('lead_documents')
            .update({ lead_id: primary.id })
            .eq('lead_id', secondary.id);
        }
      }

      // Delete secondary leads
      const secondaryIds = secondaries.map(l => l.id);
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .in('id', secondaryIds);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (error) {
      console.error('Error in mergeGroupWithResolution:', error);
      return { success: false, error: 'Failed to merge group' };
    }
  }

  // Helper methods
  private static normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '').slice(-10);
  }

  private static groupByField(leads: Lead[], field: keyof Lead): Record<string, Lead[]> {
    return leads.reduce((acc, lead) => {
      const value = String(lead[field] || '').toLowerCase().trim();
      if (value) {
        if (!acc[value]) acc[value] = [];
        acc[value].push(lead);
      }
      return acc;
    }, {} as Record<string, Lead[]>);
  }

  private static groupByNormalizedPhone(leads: Lead[]): Record<string, Lead[]> {
    return leads.reduce((acc, lead) => {
      if (lead.phone) {
        const normalized = this.normalizePhone(lead.phone);
        if (normalized.length >= 7) {
          if (!acc[normalized]) acc[normalized] = [];
          acc[normalized].push(lead);
        }
      }
      return acc;
    }, {} as Record<string, Lead[]>);
  }

  private static findSimilarNames(leads: Lead[]): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const processed = new Set<string>();

    for (let i = 0; i < leads.length; i++) {
      if (processed.has(leads[i].id)) continue;
      
      const name1 = `${leads[i].first_name} ${leads[i].last_name}`.toLowerCase();
      const similarLeads: Lead[] = [leads[i]];

      for (let j = i + 1; j < leads.length; j++) {
        if (processed.has(leads[j].id)) continue;
        
        const name2 = `${leads[j].first_name} ${leads[j].last_name}`.toLowerCase();
        const similarity = this.calculateSimilarity(name1, name2);
        
        if (similarity >= 0.8) {
          similarLeads.push(leads[j]);
          processed.add(leads[j].id);
        }
      }

      if (similarLeads.length > 1) {
        groups.push({
          id: `similar_name_${leads[i].id}`,
          matchType: 'similar_name',
          confidence: 80,
          leads: similarLeads,
          primaryLeadId: similarLeads[0].id
        });
        processed.add(leads[i].id);
      }
    }

    return groups;
  }

  private static findNameProgramMatches(leads: Lead[]): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const keyMap: Record<string, Lead[]> = {};

    for (const lead of leads) {
      const name = `${lead.first_name} ${lead.last_name}`.toLowerCase().trim();
      const programs = (lead.program_interest as string[]) || [];
      
      for (const program of programs) {
        const key = `${name}|${program.toLowerCase()}`;
        if (!keyMap[key]) keyMap[key] = [];
        keyMap[key].push(lead);
      }
    }

    for (const [key, matchedLeads] of Object.entries(keyMap)) {
      if (matchedLeads.length > 1) {
        groups.push({
          id: `name_program_${key}`,
          matchType: 'name_program',
          confidence: 75,
          leads: matchedLeads,
          primaryLeadId: matchedLeads[0].id
        });
      }
    }

    return groups;
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const distance = matrix[len1][len2];
    return 1 - distance / Math.max(len1, len2);
  }
}
