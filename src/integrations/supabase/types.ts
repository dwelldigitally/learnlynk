export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      advisor_performance: {
        Row: {
          advisor_id: string
          conversion_rate: number | null
          created_at: string
          id: string
          is_available: boolean | null
          leads_assigned: number | null
          leads_contacted: number | null
          leads_converted: number | null
          max_daily_assignments: number | null
          performance_tier: string | null
          period_end: string
          period_start: string
          response_time_avg: number | null
          updated_at: string
        }
        Insert: {
          advisor_id: string
          conversion_rate?: number | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          leads_assigned?: number | null
          leads_contacted?: number | null
          leads_converted?: number | null
          max_daily_assignments?: number | null
          performance_tier?: string | null
          period_end: string
          period_start: string
          response_time_avg?: number | null
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          conversion_rate?: number | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          leads_assigned?: number | null
          leads_contacted?: number | null
          leads_converted?: number | null
          max_daily_assignments?: number | null
          performance_tier?: string | null
          period_end?: string
          period_start?: string
          response_time_avg?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_performance_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      advisor_teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          max_daily_assignments: number | null
          name: string
          region: string | null
          specializations: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_daily_assignments?: number | null
          name: string
          region?: string | null
          specializations?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_daily_assignments?: number | null
          name?: string
          region?: string | null
          specializations?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      automation_action_logs: {
        Row: {
          action_data: Json | null
          action_type: string
          created_at: string
          error_message: string | null
          execution_id: string
          id: string
          status: string
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          created_at?: string
          error_message?: string | null
          execution_id: string
          id?: string
          status?: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          created_at?: string
          error_message?: string | null
          execution_id?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      automation_executions: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          execution_data: Json | null
          id: string
          lead_id: string
          rule_id: string
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_data?: Json | null
          id?: string
          lead_id: string
          rule_id: string
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_data?: Json | null
          id?: string
          lead_id?: string
          rule_id?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          priority: number
          trigger_config: Json
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          trigger_config?: Json
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_executions: {
        Row: {
          campaign_id: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          execution_data: Json | null
          id: string
          lead_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          campaign_id: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_data?: Json | null
          id?: string
          lead_id?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_data?: Json | null
          id?: string
          lead_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      campaign_steps: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          is_active: boolean
          order_index: number
          step_config: Json
          step_type: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          step_config?: Json
          step_type: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          step_config?: Json
          step_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          campaign_data: Json | null
          campaign_type: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          target_audience: Json | null
          updated_at: string
          user_id: string
          workflow_config: Json | null
        }
        Insert: {
          campaign_data?: Json | null
          campaign_type?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
          user_id: string
          workflow_config?: Json | null
        }
        Update: {
          campaign_data?: Json | null
          campaign_type?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
          user_id?: string
          workflow_config?: Json | null
        }
        Relationships: []
      }
      communication_templates: {
        Row: {
          ai_generated: boolean | null
          ai_suggestions: Json | null
          content: string
          created_at: string
          generation_prompt: string | null
          id: string
          is_active: boolean
          name: string
          subject: string | null
          type: string
          updated_at: string
          usage_count: number | null
          user_id: string
          variables: Json | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_suggestions?: Json | null
          content: string
          created_at?: string
          generation_prompt?: string | null
          id?: string
          is_active?: boolean
          name: string
          subject?: string | null
          type: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
          variables?: Json | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_suggestions?: Json | null
          content?: string
          created_at?: string
          generation_prompt?: string | null
          id?: string
          is_active?: boolean
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      company_profile: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          email: string | null
          employee_count: number | null
          founded_year: number | null
          id: string
          logo_url: string | null
          mission: string | null
          name: string
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          state: string | null
          timezone: string | null
          updated_at: string
          values: string | null
          vision: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          name: string
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          values?: string | null
          vision?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          name?: string
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          values?: string | null
          vision?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      custom_stages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          order_index: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          order_index: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          order_index?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      demo_data_assignments: {
        Row: {
          assigned_at: string
          created_at: string
          demo_type: string
          email: string
          has_demo_data: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          created_at?: string
          demo_type?: string
          email: string
          has_demo_data?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          created_at?: string
          demo_type?: string
          email?: string
          has_demo_data?: boolean
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_accounts: {
        Row: {
          access_token_encrypted: string | null
          account_type: string
          created_at: string
          display_name: string | null
          email_address: string
          id: string
          is_active: boolean
          provider: string
          refresh_token_encrypted: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          account_type?: string
          created_at?: string
          display_name?: string | null
          email_address: string
          id?: string
          is_active?: boolean
          provider?: string
          refresh_token_encrypted?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          account_type?: string
          created_at?: string
          display_name?: string | null
          email_address?: string
          id?: string
          is_active?: boolean
          provider?: string
          refresh_token_encrypted?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_analytics: {
        Row: {
          conversion_action: string | null
          created_at: string
          email_id: string
          first_response_at: string | null
          id: string
          lead_score_after: number | null
          lead_score_before: number | null
          resolution_time_minutes: number | null
          resolved_at: string | null
          response_time_minutes: number | null
          user_id: string
        }
        Insert: {
          conversion_action?: string | null
          created_at?: string
          email_id: string
          first_response_at?: string | null
          id?: string
          lead_score_after?: number | null
          lead_score_before?: number | null
          resolution_time_minutes?: number | null
          resolved_at?: string | null
          response_time_minutes?: number | null
          user_id: string
        }
        Update: {
          conversion_action?: string | null
          created_at?: string
          email_id?: string
          first_response_at?: string | null
          id?: string
          lead_score_after?: number | null
          lead_score_before?: number | null
          resolution_time_minutes?: number | null
          resolved_at?: string | null
          response_time_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_analytics_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_attachments: {
        Row: {
          content_bytes: string | null
          content_type: string | null
          created_at: string
          download_url: string | null
          email_id: string
          id: string
          is_inline: boolean | null
          microsoft_attachment_id: string | null
          name: string
          size_bytes: number | null
        }
        Insert: {
          content_bytes?: string | null
          content_type?: string | null
          created_at?: string
          download_url?: string | null
          email_id: string
          id?: string
          is_inline?: boolean | null
          microsoft_attachment_id?: string | null
          name: string
          size_bytes?: number | null
        }
        Update: {
          content_bytes?: string | null
          content_type?: string | null
          created_at?: string
          download_url?: string | null
          email_id?: string
          id?: string
          is_inline?: boolean | null
          microsoft_attachment_id?: string | null
          name?: string
          size_bytes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_attachments_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_drafts: {
        Row: {
          ai_confidence_score: number | null
          bcc_emails: Json | null
          body_content: string | null
          cc_emails: Json | null
          created_at: string
          created_by: string
          id: string
          is_ai_generated: boolean | null
          original_email_id: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          suggested_attachments: Json | null
          to_emails: Json | null
          updated_at: string
        }
        Insert: {
          ai_confidence_score?: number | null
          bcc_emails?: Json | null
          body_content?: string | null
          cc_emails?: Json | null
          created_at?: string
          created_by: string
          id?: string
          is_ai_generated?: boolean | null
          original_email_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          suggested_attachments?: Json | null
          to_emails?: Json | null
          updated_at?: string
        }
        Update: {
          ai_confidence_score?: number | null
          bcc_emails?: Json | null
          body_content?: string | null
          cc_emails?: Json | null
          created_at?: string
          created_by?: string
          id?: string
          is_ai_generated?: boolean | null
          original_email_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          suggested_attachments?: Json | null
          to_emails?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_drafts_original_email_id_fkey"
            columns: ["original_email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          ai_lead_match_confidence: number | null
          ai_priority_score: number | null
          ai_suggested_actions: Json | null
          assigned_at: string | null
          assigned_to: string | null
          bcc_emails: Json | null
          body_content: string | null
          body_preview: string | null
          cc_emails: Json | null
          created_at: string
          created_datetime: string
          email_account_id: string
          from_email: string
          from_name: string | null
          has_attachments: boolean | null
          id: string
          importance: string | null
          is_read: boolean
          lead_id: string | null
          microsoft_id: string
          microsoft_metadata: Json | null
          received_datetime: string
          sent_datetime: string | null
          status: string | null
          subject: string | null
          team_inbox_id: string | null
          thread_id: string | null
          to_emails: Json | null
          updated_at: string
        }
        Insert: {
          ai_lead_match_confidence?: number | null
          ai_priority_score?: number | null
          ai_suggested_actions?: Json | null
          assigned_at?: string | null
          assigned_to?: string | null
          bcc_emails?: Json | null
          body_content?: string | null
          body_preview?: string | null
          cc_emails?: Json | null
          created_at?: string
          created_datetime?: string
          email_account_id: string
          from_email: string
          from_name?: string | null
          has_attachments?: boolean | null
          id?: string
          importance?: string | null
          is_read?: boolean
          lead_id?: string | null
          microsoft_id: string
          microsoft_metadata?: Json | null
          received_datetime: string
          sent_datetime?: string | null
          status?: string | null
          subject?: string | null
          team_inbox_id?: string | null
          thread_id?: string | null
          to_emails?: Json | null
          updated_at?: string
        }
        Update: {
          ai_lead_match_confidence?: number | null
          ai_priority_score?: number | null
          ai_suggested_actions?: Json | null
          assigned_at?: string | null
          assigned_to?: string | null
          bcc_emails?: Json | null
          body_content?: string | null
          body_preview?: string | null
          cc_emails?: Json | null
          created_at?: string
          created_datetime?: string
          email_account_id?: string
          from_email?: string
          from_name?: string | null
          has_attachments?: boolean | null
          id?: string
          importance?: string | null
          is_read?: boolean
          lead_id?: string | null
          microsoft_id?: string
          microsoft_metadata?: Json | null
          received_datetime?: string
          sent_datetime?: string | null
          status?: string | null
          subject?: string | null
          team_inbox_id?: string | null
          thread_id?: string | null
          to_emails?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_email_account_id_fkey"
            columns: ["email_account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_team_inbox_id_fkey"
            columns: ["team_inbox_id"]
            isOneToOne: false
            referencedRelation: "team_inboxes"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          date: string
          description: string | null
          id: string
          location: string | null
          program_id: string | null
          registrations: number | null
          status: string | null
          time: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          location?: string | null
          program_id?: string | null
          registrations?: number | null
          status?: string | null
          time?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          location?: string | null
          program_id?: string | null
          registrations?: number | null
          status?: string | null
          time?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_records: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          payment_type: string | null
          program: string
          status: string | null
          student_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          id?: string
          payment_type?: string | null
          program: string
          status?: string | null
          student_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          payment_type?: string | null
          program?: string
          status?: string | null
          student_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      intakes: {
        Row: {
          application_deadline: string | null
          campus: string | null
          capacity: number
          created_at: string
          delivery_method: string
          id: string
          name: string
          program_id: string
          sales_approach: string
          start_date: string
          status: string
          study_mode: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_deadline?: string | null
          campus?: string | null
          capacity?: number
          created_at?: string
          delivery_method?: string
          id?: string
          name: string
          program_id: string
          sales_approach?: string
          start_date: string
          status?: string
          study_mode?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_deadline?: string | null
          campus?: string | null
          capacity?: number
          created_at?: string
          delivery_method?: string
          id?: string
          name?: string
          program_id?: string
          sales_approach?: string
          start_date?: string
          status?: string
          study_mode?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          activity_data: Json | null
          activity_description: string
          activity_type: string
          created_at: string
          id: string
          lead_id: string
          performed_at: string
          performed_by: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_description: string
          activity_type: string
          created_at?: string
          id?: string
          lead_id: string
          performed_at?: string
          performed_by?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_description?: string
          activity_type?: string
          created_at?: string
          id?: string
          lead_id?: string
          performed_at?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lead_communications: {
        Row: {
          communication_date: string
          content: string
          created_at: string
          direction: string
          id: string
          lead_id: string
          metadata: Json | null
          scheduled_for: string | null
          status: string
          subject: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_date?: string
          content: string
          created_at?: string
          direction: string
          id?: string
          lead_id: string
          metadata?: Json | null
          scheduled_for?: string | null
          status?: string
          subject?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_date?: string
          content?: string
          created_at?: string
          direction?: string
          id?: string
          lead_id?: string
          metadata?: Json | null
          scheduled_for?: string | null
          status?: string
          subject?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          is_private: boolean
          lead_id: string
          note_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_private?: boolean
          lead_id: string
          note_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean
          lead_id?: string
          note_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_routing_rules: {
        Row: {
          assignment_config: Json
          conditions: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          priority: number
          updated_at: string
        }
        Insert: {
          assignment_config: Json
          conditions: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          updated_at?: string
        }
        Update: {
          assignment_config?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          updated_at?: string
        }
        Relationships: []
      }
      lead_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          lead_id: string
          priority: string
          reminder_at: string | null
          status: string
          task_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id: string
          priority?: string
          reminder_at?: string | null
          status?: string
          task_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string
          priority?: string
          reminder_at?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          ai_score: number | null
          assigned_at: string | null
          assigned_to: string | null
          assignment_method:
            | Database["public"]["Enums"]["assignment_method"]
            | null
          city: string | null
          country: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          ip_address: unknown | null
          last_contacted_at: string | null
          last_name: string
          lead_score: number | null
          next_follow_up_at: string | null
          notes: string | null
          phone: string | null
          priority: Database["public"]["Enums"]["lead_priority"]
          program_interest: string[] | null
          qualification_stage: string | null
          referrer_url: string | null
          source: Database["public"]["Enums"]["lead_source"]
          source_details: string | null
          state: string | null
          status: Database["public"]["Enums"]["lead_status"]
          tags: string[] | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          ai_score?: number | null
          assigned_at?: string | null
          assigned_to?: string | null
          assignment_method?:
            | Database["public"]["Enums"]["assignment_method"]
            | null
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          ip_address?: unknown | null
          last_contacted_at?: string | null
          last_name: string
          lead_score?: number | null
          next_follow_up_at?: string | null
          notes?: string | null
          phone?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          program_interest?: string[] | null
          qualification_stage?: string | null
          referrer_url?: string | null
          source: Database["public"]["Enums"]["lead_source"]
          source_details?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          ai_score?: number | null
          assigned_at?: string | null
          assigned_to?: string | null
          assignment_method?:
            | Database["public"]["Enums"]["assignment_method"]
            | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          ip_address?: unknown | null
          last_contacted_at?: string | null
          last_name?: string
          lead_score?: number | null
          next_follow_up_at?: string | null
          notes?: string | null
          phone?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          program_interest?: string[] | null
          qualification_stage?: string | null
          referrer_url?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          source_details?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          email: string | null
          first_name: string | null
          id: string
          language: string | null
          last_name: string | null
          notification_email: boolean | null
          notification_in_app: boolean | null
          notification_sms: boolean | null
          phone: string | null
          theme_preference: string | null
          timezone: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          notification_email?: boolean | null
          notification_in_app?: boolean | null
          notification_sms?: boolean | null
          phone?: string | null
          theme_preference?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          notification_email?: boolean | null
          notification_in_app?: boolean | null
          notification_sms?: boolean | null
          phone?: string | null
          theme_preference?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          created_at: string
          custom_questions: Json | null
          description: string | null
          document_requirements: Json | null
          duration: string
          enrollment_status: string | null
          entry_requirements: Json | null
          fee_structure: Json | null
          id: string
          metadata: Json | null
          name: string
          next_intake: string | null
          requirements: string[] | null
          tuition: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_questions?: Json | null
          description?: string | null
          document_requirements?: Json | null
          duration: string
          enrollment_status?: string | null
          entry_requirements?: Json | null
          fee_structure?: Json | null
          id?: string
          metadata?: Json | null
          name: string
          next_intake?: string | null
          requirements?: string[] | null
          tuition?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_questions?: Json | null
          description?: string | null
          document_requirements?: Json | null
          duration?: string
          enrollment_status?: string | null
          entry_requirements?: Json | null
          fee_structure?: Json | null
          id?: string
          metadata?: Json | null
          name?: string
          next_intake?: string | null
          requirements?: string[] | null
          tuition?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      routing_rule_conditions: {
        Row: {
          condition_type: string
          created_at: string
          field_name: string
          field_value: Json
          group_id: string | null
          id: string
          is_required: boolean | null
          operator: string
          rule_id: string
        }
        Insert: {
          condition_type: string
          created_at?: string
          field_name: string
          field_value: Json
          group_id?: string | null
          id?: string
          is_required?: boolean | null
          operator: string
          rule_id: string
        }
        Update: {
          condition_type?: string
          created_at?: string
          field_name?: string
          field_value?: Json
          group_id?: string | null
          id?: string
          is_required?: boolean | null
          operator?: string
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routing_rule_conditions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "lead_routing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      routing_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_system_template: boolean | null
          name: string
          template_data: Json
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_template?: boolean | null
          name: string
          template_data: Json
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_template?: boolean | null
          name?: string
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      rule_execution_logs: {
        Row: {
          assigned_to: string | null
          created_at: string
          error_message: string | null
          execution_data: Json | null
          execution_result: string
          execution_time_ms: number | null
          id: string
          lead_id: string
          rule_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          error_message?: string | null
          execution_data?: Json | null
          execution_result: string
          execution_time_ms?: number | null
          id?: string
          lead_id: string
          rule_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          error_message?: string | null
          execution_data?: Json | null
          execution_result?: string
          execution_time_ms?: number | null
          id?: string
          lead_id?: string
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rule_execution_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rule_execution_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "lead_routing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarship_applications: {
        Row: {
          amount: number
          application_date: string
          created_at: string
          deadline: string | null
          documents_submitted: boolean | null
          eligibility_score: number | null
          id: string
          scholarship_name: string
          scholarship_type: string
          status: string
          student_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          application_date: string
          created_at?: string
          deadline?: string | null
          documents_submitted?: boolean | null
          eligibility_score?: number | null
          id?: string
          scholarship_name: string
          scholarship_type: string
          status?: string
          student_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          application_date?: string
          created_at?: string
          deadline?: string | null
          documents_submitted?: boolean | null
          eligibility_score?: number | null
          id?: string
          scholarship_name?: string
          scholarship_type?: string
          status?: string
          student_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_communications: {
        Row: {
          content: string
          created_at: string
          direction: string
          id: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          student_id: string
          subject: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          direction?: string
          id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          student_id: string
          subject: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          direction?: string
          id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          student_id?: string
          subject?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_documents: {
        Row: {
          comments: string | null
          created_at: string
          file_size: number | null
          file_url: string | null
          id: string
          name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          student_id: string
          type: string
          updated_at: string
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          student_id: string
          type: string
          updated_at?: string
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          student_id?: string
          type?: string
          updated_at?: string
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          acceptance_likelihood: number | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          id: string
          last_name: string
          lead_score: number | null
          phone: string | null
          program: string
          progress: number | null
          risk_level: string | null
          stage: string
          state: string | null
          student_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acceptance_likelihood?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          id?: string
          last_name: string
          lead_score?: number | null
          phone?: string | null
          program: string
          progress?: number | null
          risk_level?: string | null
          stage?: string
          state?: string | null
          student_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acceptance_likelihood?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          id?: string
          last_name?: string
          lead_score?: number | null
          phone?: string | null
          program?: string
          progress?: number | null
          risk_level?: string | null
          stage?: string
          state?: string | null
          student_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_inbox_members: {
        Row: {
          added_at: string
          id: string
          permissions: Json | null
          role: string
          team_inbox_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          permissions?: Json | null
          role?: string
          team_inbox_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          permissions?: Json | null
          role?: string
          team_inbox_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_inbox_members_team_inbox_id_fkey"
            columns: ["team_inbox_id"]
            isOneToOne: false
            referencedRelation: "team_inboxes"
            referencedColumns: ["id"]
          },
        ]
      }
      team_inboxes: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          email_account_id: string
          email_address: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          email_account_id: string
          email_address: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          email_account_id?: string
          email_address?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_inboxes_email_account_id_fkey"
            columns: ["email_account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          advisor_id: string
          assigned_leads_today: number | null
          created_at: string
          id: string
          is_active: boolean
          role: string | null
          team_id: string
        }
        Insert: {
          advisor_id: string
          assigned_leads_today?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string | null
          team_id: string
        }
        Update: {
          advisor_id?: string
          assigned_leads_today?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "advisor_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_actions: {
        Row: {
          action_config: Json
          action_type: string
          created_at: string | null
          id: string
          order_index: number
          workflow_id: string | null
        }
        Insert: {
          action_config: Json
          action_type: string
          created_at?: string | null
          id?: string
          order_index: number
          workflow_id?: string | null
        }
        Update: {
          action_config?: Json
          action_type?: string
          created_at?: string | null
          id?: string
          order_index?: number
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_actions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          execution_data: Json | null
          id: string
          started_at: string | null
          status: string
          student_id: string | null
          workflow_id: string | null
        }
        Insert: {
          completed_at?: string | null
          execution_data?: Json | null
          id?: string
          started_at?: string | null
          status: string
          student_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          completed_at?: string | null
          execution_data?: Json | null
          id?: string
          started_at?: string | null
          status?: string
          student_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          trigger_config: Json
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          trigger_config: Json
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_demo_data_to_user: {
        Args: { target_email: string; demo_enabled?: boolean }
        Returns: boolean
      }
      user_has_demo_data: {
        Args: { user_email?: string }
        Returns: boolean
      }
    }
    Enums: {
      assignment_method:
        | "manual"
        | "round_robin"
        | "ai_based"
        | "geography"
        | "performance"
        | "team_based"
        | "territory_based"
        | "workload_based"
      lead_priority: "low" | "medium" | "high" | "urgent"
      lead_source:
        | "web"
        | "social_media"
        | "event"
        | "agent"
        | "email"
        | "referral"
        | "phone"
        | "walk_in"
        | "api_import"
        | "csv_import"
        | "chatbot"
        | "ads"
        | "forms"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "nurturing"
        | "converted"
        | "lost"
        | "unqualified"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assignment_method: [
        "manual",
        "round_robin",
        "ai_based",
        "geography",
        "performance",
        "team_based",
        "territory_based",
        "workload_based",
      ],
      lead_priority: ["low", "medium", "high", "urgent"],
      lead_source: [
        "web",
        "social_media",
        "event",
        "agent",
        "email",
        "referral",
        "phone",
        "walk_in",
        "api_import",
        "csv_import",
        "chatbot",
        "ads",
        "forms",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "nurturing",
        "converted",
        "lost",
        "unqualified",
      ],
    },
  },
} as const
