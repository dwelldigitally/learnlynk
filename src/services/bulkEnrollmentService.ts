import { supabase } from "@/integrations/supabase/client";
import { EnhancedRoutingRule, EnrollmentOptions, EnrollmentLog } from "@/types/routing";
import { LeadRoutingService } from "./leadRoutingService";
import { NotificationService } from "./notificationService";

export interface EnrollmentResult {
  processed: number;
  assigned: number;
  skipped: number;
  errors: string[];
}

export interface EnrollmentPreview {
  total_matching: number;
  already_assigned: number;
  eligible: number;
}

export class BulkEnrollmentService {
  private static readonly BATCH_SIZE = 50;

  /**
   * Get preview of how many leads would be enrolled
   */
  static async getEnrollmentPreview(
    rule: EnhancedRoutingRule,
    options: EnrollmentOptions = {}
  ): Promise<EnrollmentPreview> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Build base query
      let query = supabase
        .from('leads')
        .select('id, assigned_to', { count: 'exact', head: false })
        .eq('user_id', user.id);

      // Apply date range if specified
      if (options.date_range_days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - options.date_range_days);
        query = query.gte('created_at', cutoffDate.toISOString());
      }

      const { data: allLeads, error, count } = await query;
      
      if (error) throw error;

      const totalMatching = count || 0;
      const alreadyAssigned = allLeads?.filter(l => l.assigned_to).length || 0;
      const eligible = options.only_unassigned 
        ? totalMatching - alreadyAssigned 
        : totalMatching;

      return {
        total_matching: totalMatching,
        already_assigned: alreadyAssigned,
        eligible
      };
    } catch (error) {
      console.error('Error getting enrollment preview:', error);
      return { total_matching: 0, already_assigned: 0, eligible: 0 };
    }
  }

  /**
   * Enroll existing leads based on routing rule
   */
  static async enrollExistingLeads(
    rule: EnhancedRoutingRule,
    options: EnrollmentOptions = {},
    enrollmentType: 'initial' | 're_enrollment' = 'initial',
    onProgress?: (processed: number, total: number) => void
  ): Promise<EnrollmentResult> {
    const result: EnrollmentResult = {
      processed: 0,
      assigned: 0,
      skipped: 0,
      errors: []
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create enrollment log
      const { data: logData, error: logError } = await (supabase as any)
        .from('routing_enrollment_logs')
        .insert({
          rule_id: rule.id,
          enrollment_type: enrollmentType,
          status: 'in_progress',
          options,
          created_by: user.id
        })
        .select()
        .single();

      if (logError) throw logError;
      const logId = logData.id;

      // Fetch leads in batches
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        // Build query for batch
        let query = supabase
          .from('leads')
          .select('*')
          .eq('user_id', user.id)
          .range(offset, offset + this.BATCH_SIZE - 1)
          .order('created_at', { ascending: false });

        // Apply filters
        if (options.only_unassigned) {
          query = query.is('assigned_to', null);
        }

        if (options.date_range_days) {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - options.date_range_days);
          query = query.gte('created_at', cutoffDate.toISOString());
        }

        const { data: leads, error: leadsError } = await query;
        
        if (leadsError) throw leadsError;
        if (!leads || leads.length === 0) {
          hasMore = false;
          break;
        }

        // Process each lead in batch
        for (const lead of leads) {
          try {
            // Evaluate routing rule - cast to Lead type
            const routingResult = await LeadRoutingService.evaluateRoutingRules(lead as any);

            if (routingResult.matched && routingResult.assignedTo) {
              // Update lead assignment
              const { error: updateError } = await supabase
                .from('leads')
                .update({
                  assigned_to: routingResult.assignedTo,
                  assigned_at: new Date().toISOString(),
                  assignment_method: routingResult.method as any
                })
                .eq('id', lead.id);

              if (updateError) {
                result.errors.push(`Failed to assign lead ${lead.id}: ${updateError.message}`);
                result.skipped++;
              } else {
                result.assigned++;

                // Send notification if enabled
                if (options.notify_advisors) {
                  await NotificationService.notifyLeadAssignment(
                    lead.id,
                    routingResult.assignedTo,
                    lead
                  );
                }
              }
            } else {
              result.skipped++;
            }

            result.processed++;
          } catch (leadError) {
            result.errors.push(`Error processing lead ${lead.id}: ${leadError}`);
            result.skipped++;
            result.processed++;
          }
        }

        // Report progress
        if (onProgress) {
          onProgress(result.processed, result.processed + this.BATCH_SIZE);
        }

        offset += this.BATCH_SIZE;
        
        // If we got fewer leads than batch size, we're done
        if (leads.length < this.BATCH_SIZE) {
          hasMore = false;
        }
      }

      // Update enrollment log with results
      await (supabase as any)
        .from('routing_enrollment_logs')
        .update({
          leads_processed: result.processed,
          leads_assigned: result.assigned,
          leads_skipped: result.skipped,
          completed_at: new Date().toISOString(),
          status: result.errors.length > 0 ? 'completed' : 'completed',
          error_message: result.errors.length > 0 ? result.errors.join('; ') : null
        })
        .eq('id', logId);

      // Update rule's enrollment config
      await (supabase as any)
        .from('lead_routing_rules')
        .update({
          enrollment_config: {
            ...rule.enrollment_config,
            enrollment_status: 'completed',
            last_enrollment_at: new Date().toISOString(),
            leads_enrolled: (rule.enrollment_config?.leads_enrolled || 0) + result.assigned
          }
        })
        .eq('id', rule.id);

      return result;
    } catch (error) {
      console.error('Error enrolling existing leads:', error);
      result.errors.push(`Fatal error: ${error}`);
      return result;
    }
  }

  /**
   * Get enrollment logs for a rule
   */
  static async getEnrollmentLogs(ruleId: string): Promise<EnrollmentLog[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('routing_enrollment_logs')
        .select('*')
        .eq('rule_id', ruleId)
        .order('started_at', { ascending: false });

      if (error) throw error;
      return (data || []) as EnrollmentLog[];
    } catch (error) {
      console.error('Error fetching enrollment logs:', error);
      return [];
    }
  }
}
