export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      academic_journeys: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          metadata: Json | null
          name: string
          program_id: string | null
          template_id: string | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name: string
          program_id?: string | null
          template_id?: string | null
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name?: string
          program_id?: string | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "academic_journeys_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "master_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_journeys_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      action_execution_logs: {
        Row: {
          action_id: string
          created_at: string
          execution_data: Json | null
          execution_result: string
          id: string
          outcome_achieved: boolean | null
          play_id: string | null
          response_time_minutes: number | null
        }
        Insert: {
          action_id: string
          created_at?: string
          execution_data?: Json | null
          execution_result: string
          id?: string
          outcome_achieved?: boolean | null
          play_id?: string | null
          response_time_minutes?: number | null
        }
        Update: {
          action_id?: string
          created_at?: string
          execution_data?: Json | null
          execution_result?: string
          id?: string
          outcome_achieved?: boolean | null
          play_id?: string | null
          response_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "action_execution_logs_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "student_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_execution_logs_play_id_fkey"
            columns: ["play_id"]
            isOneToOne: false
            referencedRelation: "plays"
            referencedColumns: ["id"]
          },
        ]
      }
      action_queue: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          priority_band: string
          program: string
          reason_codes: Json
          sla_due_at: string | null
          status: string
          student_id: string | null
          student_name: string
          suggested_action: string
          updated_at: string
          user_id: string
          yield_band: string
          yield_score: number
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          priority_band?: string
          program: string
          reason_codes?: Json
          sla_due_at?: string | null
          status?: string
          student_id?: string | null
          student_name: string
          suggested_action: string
          updated_at?: string
          user_id: string
          yield_band?: string
          yield_score?: number
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          priority_band?: string
          program?: string
          reason_codes?: Json
          sla_due_at?: string | null
          status?: string
          student_id?: string | null
          student_name?: string
          suggested_action?: string
          updated_at?: string
          user_id?: string
          yield_band?: string
          yield_score?: number
        }
        Relationships: []
      }
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
      ai_agent_filter_rules: {
        Row: {
          agent_id: string
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
          agent_id: string
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          updated_at?: string
        }
        Update: {
          agent_id?: string
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_filter_rules_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_tasks: {
        Row: {
          agent_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          performance_data: Json | null
          priority: string
          schedule_config: Json | null
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          performance_data?: Json | null
          priority?: string
          schedule_config?: Json | null
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          performance_data?: Json | null
          priority?: string
          schedule_config?: Json | null
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          agent_category: string | null
          agent_type: string | null
          configuration: Json
          created_at: string
          description: string | null
          handoff_threshold: number
          id: string
          is_active: boolean
          max_concurrent_leads: number
          name: string
          performance_metrics: Json | null
          personality: string | null
          response_style: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_category?: string | null
          agent_type?: string | null
          configuration?: Json
          created_at?: string
          description?: string | null
          handoff_threshold?: number
          id?: string
          is_active?: boolean
          max_concurrent_leads?: number
          name: string
          performance_metrics?: Json | null
          personality?: string | null
          response_style?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_category?: string | null
          agent_type?: string | null
          configuration?: Json
          created_at?: string
          description?: string | null
          handoff_threshold?: number
          id?: string
          is_active?: boolean
          max_concurrent_leads?: number
          name?: string
          performance_metrics?: Json | null
          personality?: string | null
          response_style?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_decision_logs: {
        Row: {
          alternative_actions: Json | null
          confidence_score: number
          contributing_factors: Json
          created_at: string
          created_by: string | null
          decision_type: string
          executed: boolean | null
          execution_result: string | null
          id: string
          reasoning: Json
          recommended_action: string
          student_id: string | null
          updated_at: string
        }
        Insert: {
          alternative_actions?: Json | null
          confidence_score: number
          contributing_factors: Json
          created_at?: string
          created_by?: string | null
          decision_type: string
          executed?: boolean | null
          execution_result?: string | null
          id?: string
          reasoning: Json
          recommended_action: string
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          alternative_actions?: Json | null
          confidence_score?: number
          contributing_factors?: Json
          created_at?: string
          created_by?: string | null
          decision_type?: string
          executed?: boolean | null
          execution_result?: string | null
          id?: string
          reasoning?: Json
          recommended_action?: string
          student_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_feature_analytics: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          metric_data: Json | null
          metric_name: string
          metric_value: number
          recorded_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          metric_data?: Json | null
          metric_name: string
          metric_value: number
          recorded_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_value?: number
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_feature_configurations: {
        Row: {
          created_at: string
          feature_id: string
          feature_name: string
          id: string
          is_active: boolean
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          feature_name: string
          id?: string
          is_active?: boolean
          settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          feature_name?: string
          id?: string
          is_active?: boolean
          settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_logic_configurations: {
        Row: {
          configuration_data: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          natural_language_prompt: string | null
          performance_metrics: Json | null
          updated_at: string
          version: number
        }
        Insert: {
          configuration_data: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          natural_language_prompt?: string | null
          performance_metrics?: Json | null
          updated_at?: string
          version?: number
        }
        Update: {
          configuration_data?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          natural_language_prompt?: string | null
          performance_metrics?: Json | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      ai_performance_baselines: {
        Row: {
          baseline_period_end: string
          baseline_period_start: string
          configuration_id: string | null
          created_at: string
          id: string
          metric_name: string
          metric_value: number
          sample_size: number | null
        }
        Insert: {
          baseline_period_end: string
          baseline_period_start: string
          configuration_id?: string | null
          created_at?: string
          id?: string
          metric_name: string
          metric_value: number
          sample_size?: number | null
        }
        Update: {
          baseline_period_end?: string
          baseline_period_start?: string
          configuration_id?: string | null
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: number
          sample_size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_performance_baselines_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "ai_logic_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_scenario_tests: {
        Row: {
          actual_outcome: Json | null
          configuration_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          execution_time_ms: number | null
          expected_outcome: Json | null
          id: string
          name: string
          scenario_data: Json
          test_status: string | null
          updated_at: string
        }
        Insert: {
          actual_outcome?: Json | null
          configuration_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          execution_time_ms?: number | null
          expected_outcome?: Json | null
          id?: string
          name: string
          scenario_data: Json
          test_status?: string | null
          updated_at?: string
        }
        Update: {
          actual_outcome?: Json | null
          configuration_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          execution_time_ms?: number | null
          expected_outcome?: Json | null
          id?: string
          name?: string
          scenario_data?: Json
          test_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_scenario_tests_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "ai_logic_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      aircall_call_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          call_id: string
          created_at: string
          id: string
          performed_at: string
          performed_by: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          call_id: string
          created_at?: string
          id?: string
          performed_at?: string
          performed_by?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          call_id?: string
          created_at?: string
          id?: string
          performed_at?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aircall_call_activities_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "aircall_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      aircall_calls: {
        Row: {
          agent_id: string | null
          agent_name: string | null
          aircall_call_id: string
          aircall_metadata: Json | null
          answered_at: string | null
          caller_company: string | null
          caller_name: string | null
          created_at: string
          direction: string
          disposition: string | null
          duration: number | null
          ended_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          outcome: string | null
          phone_number: string
          recording_url: string | null
          started_at: string | null
          status: string
          summary: string | null
          tags: string[] | null
          transcription: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          agent_name?: string | null
          aircall_call_id: string
          aircall_metadata?: Json | null
          answered_at?: string | null
          caller_company?: string | null
          caller_name?: string | null
          created_at?: string
          direction: string
          disposition?: string | null
          duration?: number | null
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome?: string | null
          phone_number: string
          recording_url?: string | null
          started_at?: string | null
          status: string
          summary?: string | null
          tags?: string[] | null
          transcription?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          agent_name?: string | null
          aircall_call_id?: string
          aircall_metadata?: Json | null
          answered_at?: string | null
          caller_company?: string | null
          caller_name?: string | null
          created_at?: string
          direction?: string
          disposition?: string | null
          duration?: number | null
          ended_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome?: string | null
          phone_number?: string
          recording_url?: string | null
          started_at?: string | null
          status?: string
          summary?: string | null
          tags?: string[] | null
          transcription?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aircall_calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      aircall_settings: {
        Row: {
          api_id: string | null
          api_token_encrypted: string | null
          auto_create_leads: boolean | null
          auto_dial_enabled: boolean | null
          auto_log_calls: boolean | null
          call_popup_enabled: boolean | null
          call_recording_enabled: boolean | null
          click_to_call_enabled: boolean | null
          connection_status: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          transcription_enabled: boolean | null
          updated_at: string
          user_id: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          api_id?: string | null
          api_token_encrypted?: string | null
          auto_create_leads?: boolean | null
          auto_dial_enabled?: boolean | null
          auto_log_calls?: boolean | null
          call_popup_enabled?: boolean | null
          call_recording_enabled?: boolean | null
          click_to_call_enabled?: boolean | null
          connection_status?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          transcription_enabled?: boolean | null
          updated_at?: string
          user_id: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_id?: string | null
          api_token_encrypted?: string | null
          auto_create_leads?: boolean | null
          auto_dial_enabled?: boolean | null
          auto_log_calls?: boolean | null
          call_popup_enabled?: boolean | null
          call_recording_enabled?: boolean | null
          click_to_call_enabled?: boolean | null
          connection_status?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          transcription_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      applicants: {
        Row: {
          application_deadline: string | null
          application_type: string
          assigned_at: string | null
          assigned_to: string | null
          created_at: string
          decision: string | null
          decision_date: string | null
          decision_notes: string | null
          documents_approved: Json | null
          documents_submitted: Json | null
          id: string
          master_record_id: string
          notes: string | null
          payment_amount: number | null
          payment_status: string | null
          priority: string | null
          program: string
          recruiter_company_id: string | null
          recruiter_id: string | null
          substage: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_deadline?: string | null
          application_type?: string
          assigned_at?: string | null
          assigned_to?: string | null
          created_at?: string
          decision?: string | null
          decision_date?: string | null
          decision_notes?: string | null
          documents_approved?: Json | null
          documents_submitted?: Json | null
          id?: string
          master_record_id: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          priority?: string | null
          program: string
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          substage?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_deadline?: string | null
          application_type?: string
          assigned_at?: string | null
          assigned_to?: string | null
          created_at?: string
          decision?: string | null
          decision_date?: string | null
          decision_notes?: string | null
          documents_approved?: Json | null
          documents_submitted?: Json | null
          id?: string
          master_record_id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          priority?: string | null
          program?: string
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          substage?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applicants_master_record_id_fkey"
            columns: ["master_record_id"]
            isOneToOne: false
            referencedRelation: "master_records"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          advisor_assigned: string | null
          application_date: string
          created_at: string
          documents_submitted: Json | null
          email: string
          id: string
          notes: string | null
          phone: string | null
          priority: string
          program: string
          progress: number
          recruiter_company_id: string | null
          recruiter_id: string | null
          status: string
          student_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          advisor_assigned?: string | null
          application_date?: string
          created_at?: string
          documents_submitted?: Json | null
          email: string
          id?: string
          notes?: string | null
          phone?: string | null
          priority?: string
          program: string
          progress?: number
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          status?: string
          student_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          advisor_assigned?: string | null
          application_date?: string
          created_at?: string
          documents_submitted?: Json | null
          email?: string
          id?: string
          notes?: string | null
          phone?: string | null
          priority?: string
          program?: string
          progress?: number
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          status?: string
          student_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_recruiter_company_id_fkey"
            columns: ["recruiter_company_id"]
            isOneToOne: false
            referencedRelation: "recruiter_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiter_users"
            referencedColumns: ["id"]
          },
        ]
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
      configuration_metadata: {
        Row: {
          category: string
          created_at: string
          data_type: string
          description: string | null
          id: string
          is_encrypted: boolean | null
          is_system_setting: boolean | null
          key: string
          updated_at: string
          user_id: string
          validation_rules: Json | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string
          data_type: string
          description?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_system_setting?: boolean | null
          key: string
          updated_at?: string
          user_id: string
          validation_rules?: Json | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          data_type?: string
          description?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_system_setting?: boolean | null
          key?: string
          updated_at?: string
          user_id?: string
          validation_rules?: Json | null
          value?: Json
        }
        Relationships: []
      }
      custom_fields: {
        Row: {
          created_at: string
          field_label: string
          field_name: string
          field_options: Json | null
          field_type: string
          id: string
          is_enabled: boolean | null
          is_required: boolean | null
          order_index: number | null
          stage: string
          updated_at: string
          user_id: string
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          field_label: string
          field_name: string
          field_options?: Json | null
          field_type: string
          id?: string
          is_enabled?: boolean | null
          is_required?: boolean | null
          order_index?: number | null
          stage: string
          updated_at?: string
          user_id: string
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          field_label?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          id?: string
          is_enabled?: boolean | null
          is_required?: boolean | null
          order_index?: number | null
          stage?: string
          updated_at?: string
          user_id?: string
          validation_rules?: Json | null
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
      document_templates: {
        Row: {
          accepted_formats: string[]
          applicable_programs: string[] | null
          category: string
          created_at: string
          description: string | null
          examples: string[] | null
          id: string
          instructions: string | null
          is_system_template: boolean | null
          mandatory: boolean
          max_size: number
          name: string
          stage: string
          type: string
          updated_at: string
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          accepted_formats?: string[]
          applicable_programs?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          examples?: string[] | null
          id?: string
          instructions?: string | null
          is_system_template?: boolean | null
          mandatory?: boolean
          max_size?: number
          name: string
          stage?: string
          type: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          accepted_formats?: string[]
          applicable_programs?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          examples?: string[] | null
          id?: string
          instructions?: string | null
          is_system_template?: boolean | null
          mandatory?: boolean
          max_size?: number
          name?: string
          stage?: string
          type?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
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
      email_sequences: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          email_count: number
          id: string
          name: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days?: number
          email_count?: number
          id?: string
          name: string
          status?: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          email_count?: number
          id?: string
          name?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      form_submissions: {
        Row: {
          form_id: string
          id: string
          ip_address: unknown | null
          submission_data: Json
          submitted_at: string
          user_agent: string | null
        }
        Insert: {
          form_id: string
          id?: string
          ip_address?: unknown | null
          submission_data?: Json
          submitted_at?: string
          user_agent?: string | null
        }
        Update: {
          form_id?: string
          id?: string
          ip_address?: unknown | null
          submission_data?: Json
          submitted_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hubspot_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          hub_id: string
          id: string
          refresh_token: string | null
          scopes: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          hub_id: string
          id?: string
          refresh_token?: string | null
          scopes?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          hub_id?: string
          id?: string
          refresh_token?: string | null
          scopes?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hubspot_contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          first_name: string | null
          hubspot_contact_id: string
          hubspot_owner_id: string | null
          id: string
          last_name: string | null
          phone: string | null
          properties: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          hubspot_contact_id: string
          hubspot_owner_id?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          properties?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          hubspot_contact_id?: string
          hubspot_owner_id?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          properties?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hubspot_owners: {
        Row: {
          active: boolean | null
          created_at: string
          email: string
          first_name: string | null
          hubspot_owner_id: string
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          email: string
          first_name?: string | null
          hubspot_owner_id: string
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          email?: string
          first_name?: string | null
          hubspot_owner_id?: string
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hubspot_settings: {
        Row: {
          access_token_encrypted: string
          connection_status: string
          created_at: string
          expires_at: string
          hub_id: string | null
          id: string
          is_active: boolean
          last_sync_at: string | null
          refresh_token_encrypted: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_encrypted: string
          connection_status?: string
          created_at?: string
          expires_at: string
          hub_id?: string | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          refresh_token_encrypted?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_encrypted?: string
          connection_status?: string
          created_at?: string
          expires_at?: string
          hub_id?: string | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          refresh_token_encrypted?: string | null
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
      journey_channel_rules: {
        Row: {
          channel_type: string
          conditions: Json | null
          created_at: string
          frequency_limits: Json | null
          id: string
          is_allowed: boolean
          priority_threshold: string
          stage_id: string
          time_restrictions: Json | null
          updated_at: string
        }
        Insert: {
          channel_type: string
          conditions?: Json | null
          created_at?: string
          frequency_limits?: Json | null
          id?: string
          is_allowed?: boolean
          priority_threshold?: string
          stage_id: string
          time_restrictions?: Json | null
          updated_at?: string
        }
        Update: {
          channel_type?: string
          conditions?: Json | null
          created_at?: string
          frequency_limits?: Json | null
          id?: string
          is_allowed?: boolean
          priority_threshold?: string
          stage_id?: string
          time_restrictions?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_channel_rules_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_play_mappings: {
        Row: {
          conditions: Json | null
          created_at: string
          id: string
          is_enabled: boolean
          journey_id: string
          play_id: string
          priority_override: number | null
          stage_id: string
          timing_override: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          journey_id: string
          play_id: string
          priority_override?: number | null
          stage_id: string
          timing_override?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          journey_id?: string
          play_id?: string
          priority_override?: number | null
          stage_id?: string
          timing_override?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journey_policy_overrides: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          journey_id: string
          override_config: Json
          policy_id: string
          priority: number
          stage_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          journey_id: string
          override_config?: Json
          policy_id: string
          priority?: number
          stage_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          journey_id?: string
          override_config?: Json
          policy_id?: string
          priority?: number
          stage_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journey_requirements: {
        Row: {
          created_at: string
          description: string | null
          document_template_id: string | null
          id: string
          is_mandatory: boolean
          name: string
          order_index: number
          reminder_schedule: Json | null
          requirement_type: string
          special_instructions: string | null
          stage_id: string
          updated_at: string
          validation_rules: Json | null
          verification_method: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_template_id?: string | null
          id?: string
          is_mandatory?: boolean
          name: string
          order_index?: number
          reminder_schedule?: Json | null
          requirement_type: string
          special_instructions?: string | null
          stage_id: string
          updated_at?: string
          validation_rules?: Json | null
          verification_method?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_template_id?: string | null
          id?: string
          is_mandatory?: boolean
          name?: string
          order_index?: number
          reminder_schedule?: Json | null
          requirement_type?: string
          special_instructions?: string | null
          stage_id?: string
          updated_at?: string
          validation_rules?: Json | null
          verification_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_requirements_document_template_id_fkey"
            columns: ["document_template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_requirements_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_stages: {
        Row: {
          completion_criteria: Json | null
          created_at: string
          description: string | null
          escalation_rules: Json | null
          id: string
          is_parallel: boolean
          is_required: boolean
          journey_id: string
          name: string
          order_index: number
          parent_stage_id: string | null
          stage_type: string
          status: string
          timing_config: Json
          updated_at: string
        }
        Insert: {
          completion_criteria?: Json | null
          created_at?: string
          description?: string | null
          escalation_rules?: Json | null
          id?: string
          is_parallel?: boolean
          is_required?: boolean
          journey_id: string
          name: string
          order_index: number
          parent_stage_id?: string | null
          stage_type?: string
          status?: string
          timing_config?: Json
          updated_at?: string
        }
        Update: {
          completion_criteria?: Json | null
          created_at?: string
          description?: string | null
          escalation_rules?: Json | null
          id?: string
          is_parallel?: boolean
          is_required?: boolean
          journey_id?: string
          name?: string
          order_index?: number
          parent_stage_id?: string | null
          stage_type?: string
          status?: string
          timing_config?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_stages_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "academic_journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_stages_parent_stage_id_fkey"
            columns: ["parent_stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_templates: {
        Row: {
          category: string
          complexity_level: string
          created_at: string
          description: string | null
          estimated_duration_days: number | null
          id: string
          is_system_template: boolean
          name: string
          program_type: string | null
          template_data: Json
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category?: string
          complexity_level?: string
          created_at?: string
          description?: string | null
          estimated_duration_days?: number | null
          id?: string
          is_system_template?: boolean
          name: string
          program_type?: string | null
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: string
          complexity_level?: string
          created_at?: string
          description?: string | null
          estimated_duration_days?: number | null
          id?: string
          is_system_template?: boolean
          name?: string
          program_type?: string | null
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
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
      lead_scoring_rules: {
        Row: {
          condition: string
          created_at: string
          description: string | null
          enabled: boolean
          field: string
          id: string
          name: string
          order_index: number | null
          points: number
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          condition: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          field: string
          id?: string
          name: string
          order_index?: number | null
          points?: number
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          condition?: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          field?: string
          id?: string
          name?: string
          order_index?: number | null
          points?: number
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      lead_scoring_settings: {
        Row: {
          auto_qualification_threshold: number | null
          auto_scoring_enabled: boolean
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          max_score: number
          name: string
          scoring_algorithm: string
          settings_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_qualification_threshold?: number | null
          auto_scoring_enabled?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_score?: number
          name: string
          scoring_algorithm?: string
          settings_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_qualification_threshold?: number | null
          auto_scoring_enabled?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_score?: number
          name?: string
          scoring_algorithm?: string
          settings_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_sequence_enrollments: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number
          enrolled_at: string
          id: string
          lead_id: string
          paused_at: string | null
          sequence_id: string
          status: string
          stopped_at: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          enrolled_at?: string
          id?: string
          lead_id: string
          paused_at?: string | null
          sequence_id: string
          status?: string
          stopped_at?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          enrolled_at?: string
          id?: string
          lead_id?: string
          paused_at?: string | null
          sequence_id?: string
          status?: string
          stopped_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_sequence_enrollments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
        ]
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
          master_record_id: string | null
          next_follow_up_at: string | null
          notes: string | null
          phone: string | null
          priority: Database["public"]["Enums"]["lead_priority"]
          program_interest: string[] | null
          qualification_stage: string | null
          recruiter_company_id: string | null
          recruiter_id: string | null
          referrer_url: string | null
          source: Database["public"]["Enums"]["lead_source"]
          source_details: string | null
          state: string | null
          status: Database["public"]["Enums"]["lead_status"]
          substage: string | null
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
          master_record_id?: string | null
          next_follow_up_at?: string | null
          notes?: string | null
          phone?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          program_interest?: string[] | null
          qualification_stage?: string | null
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          referrer_url?: string | null
          source: Database["public"]["Enums"]["lead_source"]
          source_details?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          substage?: string | null
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
          master_record_id?: string | null
          next_follow_up_at?: string | null
          notes?: string | null
          phone?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          program_interest?: string[] | null
          qualification_stage?: string | null
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          referrer_url?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          source_details?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          substage?: string | null
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
        Relationships: [
          {
            foreignKeyName: "leads_master_record_id_fkey"
            columns: ["master_record_id"]
            isOneToOne: false
            referencedRelation: "master_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_recruiter_company_id_fkey"
            columns: ["recruiter_company_id"]
            isOneToOne: false
            referencedRelation: "recruiter_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiter_users"
            referencedColumns: ["id"]
          },
        ]
      }
      master_call_types: {
        Row: {
          created_at: string
          description: string | null
          duration_estimate: number | null
          follow_up_required: boolean | null
          id: string
          is_active: boolean | null
          name: string
          template_notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_estimate?: number | null
          follow_up_required?: boolean | null
          id?: string
          is_active?: boolean | null
          name: string
          template_notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_estimate?: number | null
          follow_up_required?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_campuses: {
        Row: {
          address: string | null
          capacity: number | null
          city: string | null
          code: string | null
          country: string | null
          created_at: string
          email: string | null
          facilities: string[] | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          postal_code: string | null
          state: string | null
          timezone: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          code?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          code?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      master_communication_templates: {
        Row: {
          category: string | null
          conditional_logic: Json | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          is_system_template: boolean | null
          name: string
          subject: string | null
          tags: string[] | null
          type: string
          updated_at: string
          usage_count: number | null
          user_id: string
          variables: Json | null
        }
        Insert: {
          category?: string | null
          conditional_logic?: Json | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          name: string
          subject?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
          variables?: Json | null
        }
        Update: {
          category?: string | null
          conditional_logic?: Json | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          name?: string
          subject?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      master_document_templates: {
        Row: {
          accepted_formats: string[] | null
          applicable_programs: string[] | null
          category: string | null
          created_at: string
          description: string | null
          examples: string[] | null
          id: string
          instructions: string | null
          is_active: boolean | null
          is_system_template: boolean | null
          mandatory: boolean | null
          max_size: number | null
          name: string
          stage: string
          type: string
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          accepted_formats?: string[] | null
          applicable_programs?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          examples?: string[] | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          is_system_template?: boolean | null
          mandatory?: boolean | null
          max_size?: number | null
          name: string
          stage: string
          type: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          accepted_formats?: string[] | null
          applicable_programs?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          examples?: string[] | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          is_system_template?: boolean | null
          mandatory?: boolean | null
          max_size?: number | null
          name?: string
          stage?: string
          type?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      master_lead_priorities: {
        Row: {
          auto_assignment_rules: Json | null
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          level: number
          name: string
          sla_hours: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_assignment_rules?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          level: number
          name: string
          sla_hours?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_assignment_rules?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: number
          name?: string
          sla_hours?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_lead_statuses: {
        Row: {
          auto_transition_rules: Json | null
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          stage: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_transition_rules?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          stage: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_transition_rules?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          stage?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_marketing_sources: {
        Row: {
          category: string
          conversion_rate: number | null
          cost_per_lead: number | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tracking_parameters: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          conversion_rate?: number | null
          cost_per_lead?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tracking_parameters?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          conversion_rate?: number | null
          cost_per_lead?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tracking_parameters?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_notification_filters: {
        Row: {
          conditions: Json | null
          created_at: string
          event_types: string[]
          frequency: string | null
          id: string
          is_active: boolean | null
          name: string
          recipients: Json | null
          template_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          event_types: string[]
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          recipients?: Json | null
          template_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          event_types?: string[]
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          recipients?: Json | null
          template_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_programs: {
        Row: {
          campus: string | null
          category: string | null
          code: string | null
          color: string | null
          created_at: string
          delivery_method: string | null
          description: string | null
          document_requirements: Json | null
          duration: string | null
          entry_requirements: Json | null
          fee_structure: Json | null
          id: string
          is_active: boolean | null
          name: string
          status: string | null
          tags: string[] | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campus?: string | null
          category?: string | null
          code?: string | null
          color?: string | null
          created_at?: string
          delivery_method?: string | null
          description?: string | null
          document_requirements?: Json | null
          duration?: string | null
          entry_requirements?: Json | null
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          status?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campus?: string | null
          category?: string | null
          code?: string | null
          color?: string | null
          created_at?: string
          delivery_method?: string | null
          description?: string | null
          document_requirements?: Json | null
          duration?: string | null
          entry_requirements?: Json | null
          fee_structure?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          status?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_records: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          current_stage: string
          current_substage: string | null
          email: string
          first_name: string
          id: string
          ip_address: unknown | null
          last_name: string
          phone: string | null
          program_interest: string[] | null
          referrer_url: string | null
          source: string
          source_details: string | null
          stage_entered_at: string
          state: string | null
          tags: string[] | null
          updated_at: string
          user_agent: string | null
          user_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          current_stage: string
          current_substage?: string | null
          email: string
          first_name: string
          id?: string
          ip_address?: unknown | null
          last_name: string
          phone?: string | null
          program_interest?: string[] | null
          referrer_url?: string | null
          source: string
          source_details?: string | null
          stage_entered_at?: string
          state?: string | null
          tags?: string[] | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          current_stage?: string
          current_substage?: string | null
          email?: string
          first_name?: string
          id?: string
          ip_address?: unknown | null
          last_name?: string
          phone?: string | null
          program_interest?: string[] | null
          referrer_url?: string | null
          source?: string
          source_details?: string | null
          stage_entered_at?: string
          state?: string | null
          tags?: string[] | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      master_requirements: {
        Row: {
          applicable_programs: string[] | null
          category: string | null
          created_at: string
          description: string | null
          documentation_required: string[] | null
          id: string
          is_active: boolean | null
          is_mandatory: boolean | null
          maximum_value: string | null
          minimum_value: string | null
          name: string
          type: string
          units: string | null
          updated_at: string
          user_id: string
          verification_method: string | null
        }
        Insert: {
          applicable_programs?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          documentation_required?: string[] | null
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          maximum_value?: string | null
          minimum_value?: string | null
          name: string
          type: string
          units?: string | null
          updated_at?: string
          user_id: string
          verification_method?: string | null
        }
        Update: {
          applicable_programs?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          documentation_required?: string[] | null
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          maximum_value?: string | null
          minimum_value?: string | null
          name?: string
          type?: string
          units?: string | null
          updated_at?: string
          user_id?: string
          verification_method?: string | null
        }
        Relationships: []
      }
      master_stages: {
        Row: {
          automation_triggers: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          order_index: number | null
          required_fields: string[] | null
          stage_description: string | null
          stage_key: string
          stage_name: string
          stage_type: string
          substages: Json | null
          transition_rules: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          automation_triggers?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          required_fields?: string[] | null
          stage_description?: string | null
          stage_key: string
          stage_name: string
          stage_type: string
          substages?: Json | null
          transition_rules?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          automation_triggers?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          required_fields?: string[] | null
          stage_description?: string | null
          stage_key?: string
          stage_name?: string
          stage_type?: string
          substages?: Json | null
          transition_rules?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      master_teams: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          max_daily_assignments: number | null
          name: string
          performance_metrics: Json | null
          region: string | null
          specializations: string[] | null
          type: string
          updated_at: string
          user_id: string
          working_hours: Json | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_daily_assignments?: number | null
          name: string
          performance_metrics?: Json | null
          region?: string | null
          specializations?: string[] | null
          type: string
          updated_at?: string
          user_id: string
          working_hours?: Json | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_daily_assignments?: number | null
          name?: string
          performance_metrics?: Json | null
          region?: string | null
          specializations?: string[] | null
          type?: string
          updated_at?: string
          user_id?: string
          working_hours?: Json | null
        }
        Relationships: []
      }
      outcome_metrics: {
        Row: {
          after_value: number | null
          attribution_source: string | null
          before_value: number | null
          created_at: string
          id: string
          metric_name: string
          time_period: string
          updated_at: string
          user_id: string
        }
        Insert: {
          after_value?: number | null
          attribution_source?: string | null
          before_value?: number | null
          created_at?: string
          id?: string
          metric_name: string
          time_period?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          after_value?: number | null
          attribution_source?: string | null
          before_value?: number | null
          created_at?: string
          id?: string
          metric_name?: string
          time_period?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      owner_advisor_mappings: {
        Row: {
          advisor_id: string | null
          created_at: string
          hubspot_owner_id: string
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advisor_id?: string | null
          created_at?: string
          hubspot_owner_id: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advisor_id?: string | null
          created_at?: string
          hubspot_owner_id?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      play_program_assignments: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          play_id: string
          program_configuration_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          play_id: string
          program_configuration_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          play_id?: string
          program_configuration_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "play_program_assignments_play_id_fkey"
            columns: ["play_id"]
            isOneToOne: false
            referencedRelation: "plays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_program_assignments_program_configuration_id_fkey"
            columns: ["program_configuration_id"]
            isOneToOne: false
            referencedRelation: "program_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      plays: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_impact: string | null
          id: string
          is_active: boolean | null
          name: string
          play_type: string | null
          target_stage: string | null
          trigger_config: Json
          trigger_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_impact?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          play_type?: string | null
          target_stage?: string | null
          trigger_config: Json
          trigger_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_impact?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          play_type?: string | null
          target_stage?: string | null
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      policies: {
        Row: {
          configuration: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          policy_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          policy_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          policy_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      policy_configurations: {
        Row: {
          created_at: string
          enabled: boolean | null
          expected_lift: number | null
          id: string
          policy_name: string
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean | null
          expected_lift?: number | null
          id?: string
          policy_name: string
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean | null
          expected_lift?: number | null
          id?: string
          policy_name?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
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
          onboarding_completed_at: string | null
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
          onboarding_completed_at?: string | null
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
          onboarding_completed_at?: string | null
          phone?: string | null
          theme_preference?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      program_configurations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          program_id: string | null
          program_name: string
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          program_id?: string | null
          program_name: string
          settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          program_id?: string | null
          program_name?: string
          settings?: Json
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
      recruiter_applications: {
        Row: {
          application_id: string | null
          approved_at: string | null
          assigned_to: string | null
          commission_amount: number | null
          commission_status: string | null
          company_id: string
          created_at: string
          id: string
          intake_date: string | null
          internal_notes: string | null
          notes_to_registrar: string | null
          program: string
          recruiter_id: string
          reviewed_at: string | null
          status: string | null
          student_id: string | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          approved_at?: string | null
          assigned_to?: string | null
          commission_amount?: number | null
          commission_status?: string | null
          company_id: string
          created_at?: string
          id?: string
          intake_date?: string | null
          internal_notes?: string | null
          notes_to_registrar?: string | null
          program: string
          recruiter_id: string
          reviewed_at?: string | null
          status?: string | null
          student_id?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          approved_at?: string | null
          assigned_to?: string | null
          commission_amount?: number | null
          commission_status?: string | null
          company_id?: string
          created_at?: string
          id?: string
          intake_date?: string | null
          internal_notes?: string | null
          notes_to_registrar?: string | null
          program?: string
          recruiter_id?: string
          reviewed_at?: string | null
          status?: string | null
          student_id?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_applications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiter_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "recruiter_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiter_applications_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiter_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiter_applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_communications: {
        Row: {
          created_at: string
          id: string
          is_internal: boolean | null
          message: string
          read_at: string | null
          recruiter_application_id: string
          sender_id: string
          sender_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message: string
          read_at?: string | null
          recruiter_application_id: string
          sender_id: string
          sender_type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message?: string
          read_at?: string | null
          recruiter_application_id?: string
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_communications_recruiter_application_id_fkey"
            columns: ["recruiter_application_id"]
            isOneToOne: false
            referencedRelation: "recruiter_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_companies: {
        Row: {
          address: string | null
          assigned_contact: string | null
          city: string | null
          commission_rate: number | null
          commission_type: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          state: string | null
          status: string | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          assigned_contact?: string | null
          city?: string | null
          commission_rate?: number | null
          commission_type?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          assigned_contact?: string | null
          city?: string | null
          commission_rate?: number | null
          commission_type?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      recruiter_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          feedback: string | null
          file_path: string | null
          file_size: number | null
          id: string
          recruiter_application_id: string
          status: string | null
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          feedback?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          recruiter_application_id: string
          status?: string | null
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          feedback?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          recruiter_application_id?: string
          status?: string | null
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_documents_recruiter_application_id_fkey"
            columns: ["recruiter_application_id"]
            isOneToOne: false
            referencedRelation: "recruiter_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiter_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "recruiter_users"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_portal_config: {
        Row: {
          access_control: Json
          created_at: string
          features: Json
          id: string
          is_active: boolean
          logo_url: string | null
          notification_settings: Json
          portal_title: string
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
          user_id: string
          welcome_message: string | null
        }
        Insert: {
          access_control?: Json
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          logo_url?: string | null
          notification_settings?: Json
          portal_title?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
          user_id: string
          welcome_message?: string | null
        }
        Update: {
          access_control?: Json
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          logo_url?: string | null
          notification_settings?: Json
          portal_title?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
          user_id?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      recruiter_portal_content: {
        Row: {
          attachment_urls: Json | null
          content: string
          content_type: string
          created_at: string
          expire_date: string | null
          id: string
          is_published: boolean
          priority: string
          publish_date: string | null
          target_companies: Json | null
          target_roles: Json | null
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          attachment_urls?: Json | null
          content: string
          content_type?: string
          created_at?: string
          expire_date?: string | null
          id?: string
          is_published?: boolean
          priority?: string
          publish_date?: string | null
          target_companies?: Json | null
          target_roles?: Json | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          attachment_urls?: Json | null
          content?: string
          content_type?: string
          created_at?: string
          expire_date?: string | null
          id?: string
          is_published?: boolean
          priority?: string
          publish_date?: string | null
          target_companies?: Json | null
          target_roles?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      recruiter_portal_messages: {
        Row: {
          attachment_urls: Json | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          priority: string
          read_at: string | null
          read_by: string | null
          recipient_companies: Json | null
          recipient_type: string
          recipient_users: Json | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachment_urls?: Json | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          priority?: string
          read_at?: string | null
          read_by?: string | null
          recipient_companies?: Json | null
          recipient_type?: string
          recipient_users?: Json | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachment_urls?: Json | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          priority?: string
          read_at?: string | null
          read_by?: string | null
          recipient_companies?: Json | null
          recipient_type?: string
          recipient_users?: Json | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recruiter_users: {
        Row: {
          company_id: string
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_name: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "recruiter_companies"
            referencedColumns: ["id"]
          },
        ]
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
      signals: {
        Row: {
          created_at: string
          form_submitted_at: string | null
          id: string
          intent_signals: Json | null
          last_email_open_at: string | null
          pageviews_7d: number | null
          student_id: string
          updated_at: string
          user_id: string
          webinar_attended: boolean | null
          yield_score: number | null
        }
        Insert: {
          created_at?: string
          form_submitted_at?: string | null
          id?: string
          intent_signals?: Json | null
          last_email_open_at?: string | null
          pageviews_7d?: number | null
          student_id: string
          updated_at?: string
          user_id: string
          webinar_attended?: boolean | null
          yield_score?: number | null
        }
        Update: {
          created_at?: string
          form_submitted_at?: string | null
          id?: string
          intent_signals?: Json | null
          last_email_open_at?: string | null
          pageviews_7d?: number | null
          student_id?: string
          updated_at?: string
          user_id?: string
          webinar_attended?: boolean | null
          yield_score?: number | null
        }
        Relationships: []
      }
      stage_history: {
        Row: {
          created_at: string
          from_stage: string | null
          from_substage: string | null
          id: string
          master_record_id: string
          metadata: Json | null
          to_stage: string
          to_substage: string | null
          transition_reason: string | null
          transitioned_at: string
          transitioned_by: string | null
        }
        Insert: {
          created_at?: string
          from_stage?: string | null
          from_substage?: string | null
          id?: string
          master_record_id: string
          metadata?: Json | null
          to_stage: string
          to_substage?: string | null
          transition_reason?: string | null
          transitioned_at?: string
          transitioned_by?: string | null
        }
        Update: {
          created_at?: string
          from_stage?: string | null
          from_substage?: string | null
          id?: string
          master_record_id?: string
          metadata?: Json | null
          to_stage?: string
          to_substage?: string | null
          transition_reason?: string | null
          transitioned_at?: string
          transitioned_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stage_history_master_record_id_fkey"
            columns: ["master_record_id"]
            isOneToOne: false
            referencedRelation: "master_records"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_substages: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          order_index: number | null
          stage: string
          substage_description: string | null
          substage_key: string
          substage_name: string
          transition_criteria: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          stage: string
          substage_description?: string | null
          substage_key: string
          substage_name: string
          transition_criteria?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          stage?: string
          substage_description?: string | null
          substage_key?: string
          substage_name?: string
          transition_criteria?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_actions: {
        Row: {
          action_type: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          instruction: string
          metadata: Json | null
          play_id: string | null
          priority: number
          reason_chips: string[] | null
          scheduled_at: string | null
          status: string
          student_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          instruction: string
          metadata?: Json | null
          play_id?: string | null
          priority?: number
          reason_chips?: string[] | null
          scheduled_at?: string | null
          status?: string
          student_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          instruction?: string
          metadata?: Json | null
          play_id?: string | null
          priority?: number
          reason_chips?: string[] | null
          scheduled_at?: string | null
          status?: string
          student_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_actions_play_id_fkey"
            columns: ["play_id"]
            isOneToOne: false
            referencedRelation: "plays"
            referencedColumns: ["id"]
          },
        ]
      }
      student_applications: {
        Row: {
          acceptance_likelihood: number | null
          application_deadline: string | null
          application_number: string
          created_at: string
          documents: Json | null
          estimated_decision: string | null
          id: string
          next_step: string | null
          program_id: string | null
          progress: number | null
          requirements: Json | null
          stage: string
          status: string
          student_id: string
          submission_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          acceptance_likelihood?: number | null
          application_deadline?: string | null
          application_number: string
          created_at?: string
          documents?: Json | null
          estimated_decision?: string | null
          id?: string
          next_step?: string | null
          program_id?: string | null
          progress?: number | null
          requirements?: Json | null
          stage?: string
          status?: string
          student_id: string
          submission_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          acceptance_likelihood?: number | null
          application_deadline?: string | null
          application_number?: string
          created_at?: string
          documents?: Json | null
          estimated_decision?: string | null
          id?: string
          next_step?: string | null
          program_id?: string | null
          progress?: number | null
          requirements?: Json | null
          stage?: string
          status?: string
          student_id?: string
          submission_date?: string | null
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
      student_journey_progress: {
        Row: {
          created_at: string
          current_stage_id: string | null
          current_substage: string | null
          id: string
          journey_id: string
          metadata: Json | null
          requirements_completed: Json | null
          stage_completed_at: string | null
          stage_started_at: string | null
          stage_status: string
          student_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_stage_id?: string | null
          current_substage?: string | null
          id?: string
          journey_id: string
          metadata?: Json | null
          requirements_completed?: Json | null
          stage_completed_at?: string | null
          stage_started_at?: string | null
          stage_status?: string
          student_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_stage_id?: string | null
          current_substage?: string | null
          id?: string
          journey_id?: string
          metadata?: Json | null
          requirements_completed?: Json | null
          stage_completed_at?: string | null
          stage_started_at?: string | null
          stage_status?: string
          student_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_portal_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          config_key: string
          config_value: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_portal_content: {
        Row: {
          author: string | null
          capacity: number | null
          content: string | null
          content_type: string
          created_at: string
          date: string | null
          description: string | null
          event_type: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          location: string | null
          max_capacity: number | null
          metadata: Json | null
          read_time: string | null
          registered_count: number | null
          target_audience: Json | null
          time: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author?: string | null
          capacity?: number | null
          content?: string | null
          content_type: string
          created_at?: string
          date?: string | null
          description?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string | null
          max_capacity?: number | null
          metadata?: Json | null
          read_time?: string | null
          registered_count?: number | null
          target_audience?: Json | null
          time?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string | null
          capacity?: number | null
          content?: string | null
          content_type?: string
          created_at?: string
          date?: string | null
          description?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string | null
          max_capacity?: number | null
          metadata?: Json | null
          read_time?: string | null
          registered_count?: number | null
          target_audience?: Json | null
          time?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_portal_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string
          metadata: Json | null
          parent_message_id: string | null
          priority: string | null
          read_at: string | null
          sender_id: string | null
          sender_name: string
          sender_type: string
          student_id: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string
          metadata?: Json | null
          parent_message_id?: string | null
          priority?: string | null
          read_at?: string | null
          sender_id?: string | null
          sender_name: string
          sender_type?: string
          student_id: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string
          metadata?: Json | null
          parent_message_id?: string | null
          priority?: string | null
          read_at?: string | null
          sender_id?: string | null
          sender_name?: string
          sender_type?: string
          student_id?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          academic_progress: number | null
          acceptance_likelihood: number | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          enrollment_date: string | null
          first_name: string
          graduation_timeline: string | null
          id: string
          last_name: string
          lead_score: number | null
          master_record_id: string | null
          phone: string | null
          program: string
          progress: number | null
          recruiter_company_id: string | null
          recruiter_id: string | null
          risk_level: string | null
          stage: string
          state: string | null
          student_id: string
          student_id_number: string | null
          substage: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_progress?: number | null
          acceptance_likelihood?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          enrollment_date?: string | null
          first_name: string
          graduation_timeline?: string | null
          id?: string
          last_name: string
          lead_score?: number | null
          master_record_id?: string | null
          phone?: string | null
          program: string
          progress?: number | null
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          risk_level?: string | null
          stage?: string
          state?: string | null
          student_id: string
          student_id_number?: string | null
          substage?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_progress?: number | null
          acceptance_likelihood?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          enrollment_date?: string | null
          first_name?: string
          graduation_timeline?: string | null
          id?: string
          last_name?: string
          lead_score?: number | null
          master_record_id?: string | null
          phone?: string | null
          program?: string
          progress?: number | null
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          risk_level?: string | null
          stage?: string
          state?: string | null
          student_id?: string
          student_id_number?: string | null
          substage?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_master_record_id_fkey"
            columns: ["master_record_id"]
            isOneToOne: false
            referencedRelation: "master_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_recruiter_company_id_fkey"
            columns: ["recruiter_company_id"]
            isOneToOne: false
            referencedRelation: "recruiter_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiter_users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          category: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          notes: string | null
          priority: string
          reminder_at: string | null
          status: string
          tags: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          priority?: string
          reminder_at?: string | null
          status?: string
          tags?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          priority?: string
          reminder_at?: string | null
          status?: string
          tags?: Json | null
          title?: string
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
      universal_tasks: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          category: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          notes: string | null
          priority: string
          reminder_at: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          category: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          priority?: string
          reminder_at?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          priority?: string
          reminder_at?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      waste_radar: {
        Row: {
          created_at: string
          duplicate_flag: boolean | null
          id: string
          last_meaningful_contact: string | null
          student_id: string
          student_name: string
          touch_count: number | null
          unresponsive_30d: boolean | null
          updated_at: string
          user_id: string
          wrong_intake: boolean | null
        }
        Insert: {
          created_at?: string
          duplicate_flag?: boolean | null
          id?: string
          last_meaningful_contact?: string | null
          student_id: string
          student_name: string
          touch_count?: number | null
          unresponsive_30d?: boolean | null
          updated_at?: string
          user_id: string
          wrong_intake?: boolean | null
        }
        Update: {
          created_at?: string
          duplicate_flag?: boolean | null
          id?: string
          last_meaningful_contact?: string | null
          student_id?: string
          student_name?: string
          touch_count?: number | null
          unresponsive_30d?: boolean | null
          updated_at?: string
          user_id?: string
          wrong_intake?: boolean | null
        }
        Relationships: []
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
            referencedRelation: "plays"
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
            referencedRelation: "plays"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_demo_data_to_user: {
        Args: { demo_enabled?: boolean; target_email: string }
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
