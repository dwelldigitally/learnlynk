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
      academic_journey_stages: {
        Row: {
          auto_progression_rules: Json | null
          created_at: string
          description: string | null
          estimated_duration_days: number | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          name: string
          order_index: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_progression_rules?: Json | null
          created_at?: string
          description?: string | null
          estimated_duration_days?: number | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          name: string
          order_index: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_progression_rules?: Json | null
          created_at?: string
          description?: string | null
          estimated_duration_days?: number | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          name?: string
          order_index?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
            referencedRelation: "programs"
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
      academic_schedules: {
        Row: {
          created_at: string
          days_of_week: Json
          description: string | null
          duration_weeks: number | null
          id: string
          is_active: boolean | null
          is_template: boolean | null
          location_requirements: string | null
          max_capacity: number | null
          metadata: Json | null
          schedule_type: string
          template_name: string
          time_slots: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: Json
          description?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          location_requirements?: string | null
          max_capacity?: number | null
          metadata?: Json | null
          schedule_type?: string
          template_name: string
          time_slots?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: Json
          description?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          location_requirements?: string | null
          max_capacity?: number | null
          metadata?: Json | null
          schedule_type?: string
          template_name?: string
          time_slots?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academic_terms: {
        Row: {
          academic_year: string
          add_drop_deadline: string | null
          created_at: string
          description: string | null
          end_date: string
          id: string
          is_current: boolean | null
          metadata: Json | null
          name: string
          registration_end_date: string | null
          registration_start_date: string | null
          start_date: string
          status: string
          term_type: string
          updated_at: string
          user_id: string
          withdrawal_deadline: string | null
        }
        Insert: {
          academic_year: string
          add_drop_deadline?: string | null
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          name: string
          registration_end_date?: string | null
          registration_start_date?: string | null
          start_date: string
          status?: string
          term_type?: string
          updated_at?: string
          user_id: string
          withdrawal_deadline?: string | null
        }
        Update: {
          academic_year?: string
          add_drop_deadline?: string | null
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          name?: string
          registration_end_date?: string | null
          registration_start_date?: string | null
          start_date?: string
          status?: string
          term_type?: string
          updated_at?: string
          user_id?: string
          withdrawal_deadline?: string | null
        }
        Relationships: []
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
          capacity_per_week: number | null
          conversion_rate: number | null
          created_at: string
          current_weekly_assignments: number | null
          id: string
          is_available: boolean | null
          last_assignment_reset: string | null
          leads_assigned: number | null
          leads_contacted: number | null
          leads_converted: number | null
          max_daily_assignments: number | null
          performance_tier: string | null
          period_end: string
          period_start: string
          response_time_avg: number | null
          routing_enabled: boolean | null
          updated_at: string
          working_schedule: Json | null
        }
        Insert: {
          advisor_id: string
          capacity_per_week?: number | null
          conversion_rate?: number | null
          created_at?: string
          current_weekly_assignments?: number | null
          id?: string
          is_available?: boolean | null
          last_assignment_reset?: string | null
          leads_assigned?: number | null
          leads_contacted?: number | null
          leads_converted?: number | null
          max_daily_assignments?: number | null
          performance_tier?: string | null
          period_end: string
          period_start: string
          response_time_avg?: number | null
          routing_enabled?: boolean | null
          updated_at?: string
          working_schedule?: Json | null
        }
        Update: {
          advisor_id?: string
          capacity_per_week?: number | null
          conversion_rate?: number | null
          created_at?: string
          current_weekly_assignments?: number | null
          id?: string
          is_available?: boolean | null
          last_assignment_reset?: string | null
          leads_assigned?: number | null
          leads_contacted?: number | null
          leads_converted?: number | null
          max_daily_assignments?: number | null
          performance_tier?: string | null
          period_end?: string
          period_start?: string
          response_time_avg?: number | null
          routing_enabled?: boolean | null
          updated_at?: string
          working_schedule?: Json | null
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
      applicant_engagement_metrics: {
        Row: {
          applicant_id: string
          application_velocity_days: number | null
          created_at: string
          email_open_rate: number | null
          event_attendance_count: number | null
          first_response_time_hours: number | null
          id: string
          interview_show_rate: number | null
          last_activity_at: string | null
          nudge_responsiveness_score: number | null
          portal_login_count: number | null
          portal_time_spent_minutes: number | null
          self_scheduling_speed_hours: number | null
          sms_response_rate: number | null
          updated_at: string
        }
        Insert: {
          applicant_id: string
          application_velocity_days?: number | null
          created_at?: string
          email_open_rate?: number | null
          event_attendance_count?: number | null
          first_response_time_hours?: number | null
          id?: string
          interview_show_rate?: number | null
          last_activity_at?: string | null
          nudge_responsiveness_score?: number | null
          portal_login_count?: number | null
          portal_time_spent_minutes?: number | null
          self_scheduling_speed_hours?: number | null
          sms_response_rate?: number | null
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          application_velocity_days?: number | null
          created_at?: string
          email_open_rate?: number | null
          event_attendance_count?: number | null
          first_response_time_hours?: number | null
          id?: string
          interview_show_rate?: number | null
          last_activity_at?: string | null
          nudge_responsiveness_score?: number | null
          portal_login_count?: number | null
          portal_time_spent_minutes?: number | null
          self_scheduling_speed_hours?: number | null
          sms_response_rate?: number | null
          updated_at?: string
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
          custom_data: Json | null
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
          custom_data?: Json | null
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
          custom_data?: Json | null
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
      audience_templates: {
        Row: {
          audience_count: number | null
          created_at: string | null
          description: string | null
          filters: Json
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audience_count?: number | null
          created_at?: string | null
          description?: string | null
          filters?: Json
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audience_count?: number | null
          created_at?: string | null
          description?: string | null
          filters?: Json
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
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
      batch_students: {
        Row: {
          added_at: string
          assignment_id: string
          batch_id: string
          id: string
        }
        Insert: {
          added_at?: string
          assignment_id: string
          batch_id: string
          id?: string
        }
        Update: {
          added_at?: string
          assignment_id?: string
          batch_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_students_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "practicum_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_students_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "student_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          agenda: string | null
          attendees: Json | null
          cancelled_reason: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          end_time: string
          follow_up_tasks: string[] | null
          id: string
          lead_email: string | null
          lead_id: string | null
          lead_name: string | null
          lead_phone: string | null
          location_details: string | null
          location_type: string | null
          meeting_link: string | null
          meeting_notes: string | null
          meeting_platform: string | null
          objectives: string[] | null
          outcomes: string[] | null
          reminders: Json | null
          start_time: string
          status: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agenda?: string | null
          attendees?: Json | null
          cancelled_reason?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time: string
          follow_up_tasks?: string[] | null
          id?: string
          lead_email?: string | null
          lead_id?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          location_details?: string | null
          location_type?: string | null
          meeting_link?: string | null
          meeting_notes?: string | null
          meeting_platform?: string | null
          objectives?: string[] | null
          outcomes?: string[] | null
          reminders?: Json | null
          start_time: string
          status?: string | null
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agenda?: string | null
          attendees?: Json | null
          cancelled_reason?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_time?: string
          follow_up_tasks?: string[] | null
          id?: string
          lead_email?: string | null
          lead_id?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          location_details?: string | null
          location_type?: string | null
          meeting_link?: string | null
          meeting_notes?: string | null
          meeting_platform?: string | null
          objectives?: string[] | null
          outcomes?: string[] | null
          reminders?: Json | null
          start_time?: string
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_analytics: {
        Row: {
          action_metadata: Json | null
          action_type: string
          campaign_id: string
          created_at: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_metadata?: Json | null
          action_type: string
          campaign_id: string
          created_at?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_metadata?: Json | null
          action_type?: string
          campaign_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
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
          last_executed_at: string | null
          last_executed_by_user_id: string | null
          name: string
          start_date: string | null
          started_at: string | null
          started_by_user_id: string | null
          status: string
          target_audience: Json | null
          total_executions: number | null
          total_views: number | null
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
          last_executed_at?: string | null
          last_executed_by_user_id?: string | null
          name: string
          start_date?: string | null
          started_at?: string | null
          started_by_user_id?: string | null
          status?: string
          target_audience?: Json | null
          total_executions?: number | null
          total_views?: number | null
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
          last_executed_at?: string | null
          last_executed_by_user_id?: string | null
          name?: string
          start_date?: string | null
          started_at?: string | null
          started_by_user_id?: string | null
          status?: string
          target_audience?: Json | null
          total_executions?: number | null
          total_views?: number | null
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
          attachments: Json | null
          content: string
          content_format: string | null
          created_at: string
          generation_prompt: string | null
          html_content: string | null
          id: string
          is_active: boolean
          max_attachment_size: number | null
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
          attachments?: Json | null
          content: string
          content_format?: string | null
          created_at?: string
          generation_prompt?: string | null
          html_content?: string | null
          id?: string
          is_active?: boolean
          max_attachment_size?: number | null
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
          attachments?: Json | null
          content?: string
          content_format?: string | null
          created_at?: string
          generation_prompt?: string | null
          html_content?: string | null
          id?: string
          is_active?: boolean
          max_attachment_size?: number | null
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
          accent_color: string | null
          address: string | null
          city: string | null
          core_values: string | null
          country: string | null
          created_at: string
          currency: string | null
          data_residency_region: string | null
          default_language: string | null
          description: string | null
          email: string | null
          employee_count: number | null
          founded_year: number | null
          holidays: Json | null
          id: string
          logo_url: string | null
          mission: string | null
          mission_statement: string | null
          name: string
          phone: string | null
          postal_code: string | null
          primary_color: string | null
          secondary_color: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_twitter: string | null
          state: string | null
          state_province: string | null
          street_address: string | null
          timezone: string | null
          updated_at: string
          values: string | null
          vision: string | null
          vision_statement: string | null
          website: string | null
          working_hours: Json | null
          zip_code: string | null
        }
        Insert: {
          accent_color?: string | null
          address?: string | null
          city?: string | null
          core_values?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          data_residency_region?: string | null
          default_language?: string | null
          description?: string | null
          email?: string | null
          employee_count?: number | null
          founded_year?: number | null
          holidays?: Json | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          mission_statement?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          state?: string | null
          state_province?: string | null
          street_address?: string | null
          timezone?: string | null
          updated_at?: string
          values?: string | null
          vision?: string | null
          vision_statement?: string | null
          website?: string | null
          working_hours?: Json | null
          zip_code?: string | null
        }
        Update: {
          accent_color?: string | null
          address?: string | null
          city?: string | null
          core_values?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          data_residency_region?: string | null
          default_language?: string | null
          description?: string | null
          email?: string | null
          employee_count?: number | null
          founded_year?: number | null
          holidays?: Json | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          mission_statement?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          state?: string | null
          state_province?: string | null
          street_address?: string | null
          timezone?: string | null
          updated_at?: string
          values?: string | null
          vision?: string | null
          vision_statement?: string | null
          website?: string | null
          working_hours?: Json | null
          zip_code?: string | null
        }
        Relationships: []
      }
      compliance_report_configs: {
        Row: {
          columns: Json
          created_at: string
          filters: Json | null
          id: string
          is_default: boolean | null
          name: string
          report_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          columns?: Json
          created_at?: string
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          name: string
          report_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          columns?: Json
          created_at?: string
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          name?: string
          report_type?: string
          updated_at?: string
          user_id?: string
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
      custom_reports: {
        Row: {
          chart_config: Json | null
          created_at: string | null
          data_source: string
          description: string | null
          filters: Json
          id: string
          is_favorite: boolean | null
          name: string
          selected_fields: Json
          updated_at: string | null
          user_id: string
          visualization_type: string
        }
        Insert: {
          chart_config?: Json | null
          created_at?: string | null
          data_source: string
          description?: string | null
          filters?: Json
          id?: string
          is_favorite?: boolean | null
          name: string
          selected_fields?: Json
          updated_at?: string | null
          user_id: string
          visualization_type?: string
        }
        Update: {
          chart_config?: Json | null
          created_at?: string | null
          data_source?: string
          description?: string | null
          filters?: Json
          id?: string
          is_favorite?: boolean | null
          name?: string
          selected_fields?: Json
          updated_at?: string | null
          user_id?: string
          visualization_type?: string
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
      entry_requirements: {
        Row: {
          alternatives: string[] | null
          applicable_programs: string[] | null
          category: string | null
          created_at: string | null
          description: string
          details: string | null
          id: string
          is_system_template: boolean | null
          linked_document_templates: string[] | null
          mandatory: boolean
          minimum_grade: string | null
          title: string
          type: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          alternatives?: string[] | null
          applicable_programs?: string[] | null
          category?: string | null
          created_at?: string | null
          description: string
          details?: string | null
          id?: string
          is_system_template?: boolean | null
          linked_document_templates?: string[] | null
          mandatory?: boolean
          minimum_grade?: string | null
          title: string
          type: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          alternatives?: string[] | null
          applicable_programs?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string
          details?: string | null
          id?: string
          is_system_template?: boolean | null
          linked_document_templates?: string[] | null
          mandatory?: boolean
          minimum_grade?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
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
          ip_address: unknown
          lead_id: string | null
          student_portal_id: string | null
          submission_data: Json
          submitted_at: string
          user_agent: string | null
        }
        Insert: {
          form_id: string
          id?: string
          ip_address?: unknown
          lead_id?: string | null
          student_portal_id?: string | null
          submission_data?: Json
          submitted_at?: string
          user_agent?: string | null
        }
        Update: {
          form_id?: string
          id?: string
          ip_address?: unknown
          lead_id?: string | null
          student_portal_id?: string | null
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
          {
            foreignKeyName: "form_submissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_student_portal_id_fkey"
            columns: ["student_portal_id"]
            isOneToOne: false
            referencedRelation: "student_portals"
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
      invoice_templates: {
        Row: {
          body_html: string
          body_text: string
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          subject_line: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          body_html: string
          body_text: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          subject_line: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          body_html?: string
          body_text?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          subject_line?: string
          template_type?: string
          updated_at?: string | null
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
      journey_stage_progress: {
        Row: {
          completed_at: string | null
          completion_data: Json | null
          created_at: string
          id: string
          journey_instance_id: string
          notes: string | null
          stage_id: string
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completion_data?: Json | null
          created_at?: string
          id?: string
          journey_instance_id: string
          notes?: string | null
          stage_id: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completion_data?: Json | null
          created_at?: string
          id?: string
          journey_instance_id?: string
          notes?: string | null
          stage_id?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_stage_progress_journey_instance_id_fkey"
            columns: ["journey_instance_id"]
            isOneToOne: false
            referencedRelation: "student_journey_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_stage_progress_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_stages: {
        Row: {
          auto_transition_enabled: boolean | null
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
          auto_transition_enabled?: boolean | null
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
          auto_transition_enabled?: boolean | null
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
          inherits_from_template_id: string | null
          is_master_template: boolean | null
          is_system_template: boolean
          name: string
          program_type: string | null
          student_type: string | null
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
          inherits_from_template_id?: string | null
          is_master_template?: boolean | null
          is_system_template?: boolean
          name: string
          program_type?: string | null
          student_type?: string | null
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
          inherits_from_template_id?: string | null
          is_master_template?: boolean | null
          is_system_template?: boolean
          name?: string
          program_type?: string | null
          student_type?: string | null
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_templates_inherits_from_template_id_fkey"
            columns: ["inherits_from_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_academic_journeys: {
        Row: {
          created_at: string
          current_stage_id: string | null
          current_stage_name: string
          current_step: number | null
          enrolled_at: string
          estimated_completion_date: string | null
          id: string
          journey_name: string
          lead_id: string
          metadata: Json | null
          next_required_action: string | null
          total_steps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_stage_id?: string | null
          current_stage_name: string
          current_step?: number | null
          enrolled_at?: string
          estimated_completion_date?: string | null
          id?: string
          journey_name: string
          lead_id: string
          metadata?: Json | null
          next_required_action?: string | null
          total_steps: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_stage_id?: string | null
          current_stage_name?: string
          current_step?: number | null
          enrolled_at?: string
          estimated_completion_date?: string | null
          id?: string
          journey_name?: string
          lead_id?: string
          metadata?: Json | null
          next_required_action?: string | null
          total_steps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_academic_journeys_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "academic_journey_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_academic_journeys_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      lead_activity_logs: {
        Row: {
          action_category: string
          action_type: string
          created_at: string
          description: string | null
          id: string
          lead_id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_category: string
          action_type: string
          created_at?: string
          description?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_category?: string
          action_type?: string
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activity_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_communication_attachments: {
        Row: {
          communication_id: string | null
          created_at: string | null
          created_by: string | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string
        }
        Insert: {
          communication_id?: string | null
          created_at?: string | null
          created_by?: string | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          mime_type: string
        }
        Update: {
          communication_id?: string | null
          created_at?: string | null
          created_by?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_communication_attachments_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "lead_communications"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_communications: {
        Row: {
          ai_agent_id: string | null
          communication_date: string
          content: string
          created_at: string
          direction: string
          id: string
          is_ai_generated: boolean | null
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
          ai_agent_id?: string | null
          communication_date?: string
          content: string
          created_at?: string
          direction: string
          id?: string
          is_ai_generated?: boolean | null
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
          ai_agent_id?: string | null
          communication_date?: string
          content?: string
          created_at?: string
          direction?: string
          id?: string
          is_ai_generated?: boolean | null
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
      lead_documents: {
        Row: {
          admin_comments: string | null
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          admin_status: string | null
          ai_insight: string | null
          created_at: string
          document_name: string
          document_type: string
          entry_requirement_id: string | null
          file_path: string | null
          file_size: number | null
          id: string
          is_latest: boolean | null
          lead_id: string
          metadata: Json | null
          original_filename: string | null
          parent_document_id: string | null
          required: boolean | null
          requirement_id: string | null
          status: string
          superseded_at: string | null
          updated_at: string
          upload_date: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          admin_comments?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string | null
          ai_insight?: string | null
          created_at?: string
          document_name: string
          document_type: string
          entry_requirement_id?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_latest?: boolean | null
          lead_id: string
          metadata?: Json | null
          original_filename?: string | null
          parent_document_id?: string | null
          required?: boolean | null
          requirement_id?: string | null
          status?: string
          superseded_at?: string | null
          updated_at?: string
          upload_date?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          admin_comments?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string | null
          ai_insight?: string | null
          created_at?: string
          document_name?: string
          document_type?: string
          entry_requirement_id?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_latest?: boolean | null
          lead_id?: string
          metadata?: Json | null
          original_filename?: string | null
          parent_document_id?: string | null
          required?: boolean | null
          requirement_id?: string | null
          status?: string
          superseded_at?: string | null
          updated_at?: string
          upload_date?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_documents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "lead_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_entry_requirements: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          entry_requirement_id: string
          id: string
          is_mandatory: boolean | null
          lead_id: string
          linked_document_id: string | null
          notes: string | null
          requirement_description: string | null
          requirement_title: string
          requirement_type: string
          status: string
          threshold_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          entry_requirement_id: string
          id?: string
          is_mandatory?: boolean | null
          lead_id: string
          linked_document_id?: string | null
          notes?: string | null
          requirement_description?: string | null
          requirement_title: string
          requirement_type?: string
          status?: string
          threshold_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          entry_requirement_id?: string
          id?: string
          is_mandatory?: boolean | null
          lead_id?: string
          linked_document_id?: string | null
          notes?: string | null
          requirement_description?: string | null
          requirement_title?: string
          requirement_type?: string
          status?: string
          threshold_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_entry_requirements_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_entry_requirements_linked_document_id_fkey"
            columns: ["linked_document_id"]
            isOneToOne: false
            referencedRelation: "lead_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_journey_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          journey_id: string
          lead_id: string
          metadata: Json | null
          notes: string | null
          stage_id: string | null
          stage_name: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          journey_id: string
          lead_id: string
          metadata?: Json | null
          notes?: string | null
          stage_id?: string | null
          stage_name: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          journey_id?: string
          lead_id?: string
          metadata?: Json | null
          notes?: string | null
          stage_id?: string | null
          stage_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_journey_progress_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "lead_academic_journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_journey_progress_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_journey_progress_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "academic_journey_stages"
            referencedColumns: ["id"]
          },
        ]
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
          enrollment_config: Json | null
          id: string
          is_active: boolean
          name: string
          priority: number
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_config: Json
          conditions: Json
          created_at?: string
          description?: string | null
          enrollment_config?: Json | null
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          assignment_config?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          enrollment_config?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          updated_at?: string
          user_id?: string
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
          academic_term_id: string | null
          ai_score: number | null
          assigned_at: string | null
          assigned_to: string | null
          assignment_method:
            | Database["public"]["Enums"]["assignment_method"]
            | null
          city: string | null
          country: string | null
          created_at: string
          custom_data: Json | null
          email: string
          first_name: string
          id: string
          ip_address: unknown
          last_contacted_at: string | null
          last_name: string
          lead_score: number | null
          master_record_id: string | null
          next_follow_up_at: string | null
          notes: string | null
          phone: string | null
          preferred_intake_id: string | null
          priority: Database["public"]["Enums"]["lead_priority"]
          program_interest: string[] | null
          qualification_stage: string | null
          recruiter_company_id: string | null
          recruiter_id: string | null
          referrer_url: string | null
          search_vector: unknown
          source: Database["public"]["Enums"]["lead_source"]
          source_details: string | null
          state: string | null
          status: Database["public"]["Enums"]["lead_status"]
          student_type: string | null
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
          academic_term_id?: string | null
          ai_score?: number | null
          assigned_at?: string | null
          assigned_to?: string | null
          assignment_method?:
            | Database["public"]["Enums"]["assignment_method"]
            | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_data?: Json | null
          email: string
          first_name: string
          id?: string
          ip_address?: unknown
          last_contacted_at?: string | null
          last_name: string
          lead_score?: number | null
          master_record_id?: string | null
          next_follow_up_at?: string | null
          notes?: string | null
          phone?: string | null
          preferred_intake_id?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          program_interest?: string[] | null
          qualification_stage?: string | null
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          referrer_url?: string | null
          search_vector?: unknown
          source: Database["public"]["Enums"]["lead_source"]
          source_details?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          student_type?: string | null
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
          academic_term_id?: string | null
          ai_score?: number | null
          assigned_at?: string | null
          assigned_to?: string | null
          assignment_method?:
            | Database["public"]["Enums"]["assignment_method"]
            | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_data?: Json | null
          email?: string
          first_name?: string
          id?: string
          ip_address?: unknown
          last_contacted_at?: string | null
          last_name?: string
          lead_score?: number | null
          master_record_id?: string | null
          next_follow_up_at?: string | null
          notes?: string | null
          phone?: string | null
          preferred_intake_id?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"]
          program_interest?: string[] | null
          qualification_stage?: string | null
          recruiter_company_id?: string | null
          recruiter_id?: string | null
          referrer_url?: string | null
          search_vector?: unknown
          source?: Database["public"]["Enums"]["lead_source"]
          source_details?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          student_type?: string | null
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
            foreignKeyName: "leads_academic_term_id_fkey"
            columns: ["academic_term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_master_record_id_fkey"
            columns: ["master_record_id"]
            isOneToOne: false
            referencedRelation: "master_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_preferred_intake_id_fkey"
            columns: ["preferred_intake_id"]
            isOneToOne: false
            referencedRelation: "intakes"
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
          custom_data: Json | null
          email: string
          first_name: string
          id: string
          ip_address: unknown
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
          custom_data?: Json | null
          email: string
          first_name: string
          id?: string
          ip_address?: unknown
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
          custom_data?: Json | null
          email?: string
          first_name?: string
          id?: string
          ip_address?: unknown
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
          linked_document_templates: string[] | null
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
          linked_document_templates?: string[] | null
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
          linked_document_templates?: string[] | null
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
      notification_types: {
        Row: {
          available_channels: string[] | null
          category: string
          created_at: string | null
          default_enabled: boolean | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_system: boolean | null
          priority_default: string | null
          type_key: string
        }
        Insert: {
          available_channels?: string[] | null
          category: string
          created_at?: string | null
          default_enabled?: boolean | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_system?: boolean | null
          priority_default?: string | null
          type_key: string
        }
        Update: {
          available_channels?: string[] | null
          category?: string
          created_at?: string | null
          default_enabled?: boolean | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_system?: boolean | null
          priority_default?: string | null
          type_key?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      otp_rate_limits: {
        Row: {
          attempts: number
          created_at: string
          id: string
          identifier: string
          limit_type: string
          window_start: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: string
          identifier: string
          limit_type: string
          window_start?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: string
          identifier?: string
          limit_type?: string
          window_start?: string
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          attempts: number
          created_at: string
          email: string
          expires_at: string
          id: string
          ip_address: unknown
          max_attempts: number
          otp_hash: string
          user_agent: string | null
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          max_attempts?: number
          otp_hash: string
          user_agent?: string | null
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          max_attempts?: number
          otp_hash?: string
          user_agent?: string | null
          verified_at?: string | null
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
      payment_transactions: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          payment_id: string
          status: string
          stripe_transaction_id: string | null
          transaction_type: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_id: string
          status: string
          stripe_transaction_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_id?: string
          status?: string
          stripe_transaction_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          financial_record_id: string | null
          id: string
          invoice_sent_at: string | null
          invoice_template_id: string | null
          lead_id: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          payment_type: string
          status: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          financial_record_id?: string | null
          id?: string
          invoice_sent_at?: string | null
          invoice_template_id?: string | null
          lead_id: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_type: string
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          financial_record_id?: string | null
          id?: string
          invoice_sent_at?: string | null
          invoice_template_id?: string | null
          lead_id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_type?: string
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_financial_record_id_fkey"
            columns: ["financial_record_id"]
            isOneToOne: false
            referencedRelation: "financial_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_template_id_fkey"
            columns: ["invoice_template_id"]
            isOneToOne: false
            referencedRelation: "invoice_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          permission_description: string | null
          permission_name: string
          risk_level: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          permission_description?: string | null
          permission_name: string
          risk_level?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          permission_description?: string | null
          permission_name?: string
          risk_level?: string | null
          updated_at?: string | null
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
      practicum_assignments: {
        Row: {
          batch_id: string | null
          completion_percentage: number | null
          created_at: string
          current_step: number | null
          end_date: string | null
          hours_approved: number | null
          hours_completed: number | null
          id: string
          instructor_id: string | null
          journey_id: string | null
          lead_id: string | null
          notes: string | null
          preceptor_id: string | null
          program_id: string | null
          site_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          batch_id?: string | null
          completion_percentage?: number | null
          created_at?: string
          current_step?: number | null
          end_date?: string | null
          hours_approved?: number | null
          hours_completed?: number | null
          id?: string
          instructor_id?: string | null
          journey_id?: string | null
          lead_id?: string | null
          notes?: string | null
          preceptor_id?: string | null
          program_id?: string | null
          site_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          batch_id?: string | null
          completion_percentage?: number | null
          created_at?: string
          current_step?: number | null
          end_date?: string | null
          hours_approved?: number | null
          hours_completed?: number | null
          id?: string
          instructor_id?: string | null
          journey_id?: string | null
          lead_id?: string | null
          notes?: string | null
          preceptor_id?: string | null
          program_id?: string | null
          site_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practicum_assignments_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "practicum_journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practicum_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practicum_assignments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "practicum_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practicum_assignments_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "practicum_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      practicum_competencies: {
        Row: {
          category: string | null
          competency_description: string | null
          competency_name: string
          created_at: string
          id: string
          is_required: boolean | null
          order_index: number | null
          program_id: string | null
          required_occurrences: number | null
          rubric_criteria: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          competency_description?: string | null
          competency_name: string
          created_at?: string
          id?: string
          is_required?: boolean | null
          order_index?: number | null
          program_id?: string | null
          required_occurrences?: number | null
          rubric_criteria?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          competency_description?: string | null
          competency_name?: string
          created_at?: string
          id?: string
          is_required?: boolean | null
          order_index?: number | null
          program_id?: string | null
          required_occurrences?: number | null
          rubric_criteria?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practicum_competencies_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "practicum_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      practicum_evaluations: {
        Row: {
          areas_for_improvement: string | null
          assignment_id: string | null
          competencies_evaluation: Json | null
          completed_date: string | null
          created_at: string
          due_date: string | null
          evaluation_type: string
          id: string
          instructor_evaluation: Json | null
          is_completed: boolean | null
          overall_rating: string | null
          preceptor_evaluation: Json | null
          recommendations: string | null
          strengths: string | null
          student_id: string
          student_self_evaluation: Json | null
          updated_at: string
        }
        Insert: {
          areas_for_improvement?: string | null
          assignment_id?: string | null
          competencies_evaluation?: Json | null
          completed_date?: string | null
          created_at?: string
          due_date?: string | null
          evaluation_type: string
          id?: string
          instructor_evaluation?: Json | null
          is_completed?: boolean | null
          overall_rating?: string | null
          preceptor_evaluation?: Json | null
          recommendations?: string | null
          strengths?: string | null
          student_id: string
          student_self_evaluation?: Json | null
          updated_at?: string
        }
        Update: {
          areas_for_improvement?: string | null
          assignment_id?: string | null
          competencies_evaluation?: Json | null
          completed_date?: string | null
          created_at?: string
          due_date?: string | null
          evaluation_type?: string
          id?: string
          instructor_evaluation?: Json | null
          is_completed?: boolean | null
          overall_rating?: string | null
          preceptor_evaluation?: Json | null
          recommendations?: string | null
          strengths?: string | null
          student_id?: string
          student_self_evaluation?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practicum_evaluations_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "practicum_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      practicum_journeys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          journey_name: string
          program_id: string | null
          steps: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          journey_name: string
          program_id?: string | null
          steps?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          journey_name?: string
          program_id?: string | null
          steps?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practicum_journeys_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "practicum_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      practicum_programs: {
        Row: {
          competencies_required: Json | null
          created_at: string
          documents_required: Json | null
          evaluation_criteria: Json | null
          id: string
          is_active: boolean | null
          program_name: string
          total_hours_required: number
          updated_at: string
          user_id: string
          weeks_duration: number | null
        }
        Insert: {
          competencies_required?: Json | null
          created_at?: string
          documents_required?: Json | null
          evaluation_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          program_name: string
          total_hours_required?: number
          updated_at?: string
          user_id: string
          weeks_duration?: number | null
        }
        Update: {
          competencies_required?: Json | null
          created_at?: string
          documents_required?: Json | null
          evaluation_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          program_name?: string
          total_hours_required?: number
          updated_at?: string
          user_id?: string
          weeks_duration?: number | null
        }
        Relationships: []
      }
      practicum_records: {
        Row: {
          assignment_id: string | null
          clock_in_address: string | null
          clock_in_latitude: number | null
          clock_in_longitude: number | null
          clock_out_address: string | null
          clock_out_latitude: number | null
          clock_out_longitude: number | null
          competency_id: string | null
          competency_name: string | null
          created_at: string
          evaluation_data: Json | null
          final_status: string | null
          hours_submitted: number | null
          id: string
          instructor_approved_at: string | null
          instructor_feedback: string | null
          instructor_id: string | null
          instructor_status: string | null
          journal_content: string | null
          metadata: Json | null
          preceptor_approved_at: string | null
          preceptor_feedback: string | null
          preceptor_id: string | null
          preceptor_status: string | null
          record_date: string
          record_type: string
          student_id: string
          student_notes: string | null
          time_in: string | null
          time_out: string | null
          updated_at: string
        }
        Insert: {
          assignment_id?: string | null
          clock_in_address?: string | null
          clock_in_latitude?: number | null
          clock_in_longitude?: number | null
          clock_out_address?: string | null
          clock_out_latitude?: number | null
          clock_out_longitude?: number | null
          competency_id?: string | null
          competency_name?: string | null
          created_at?: string
          evaluation_data?: Json | null
          final_status?: string | null
          hours_submitted?: number | null
          id?: string
          instructor_approved_at?: string | null
          instructor_feedback?: string | null
          instructor_id?: string | null
          instructor_status?: string | null
          journal_content?: string | null
          metadata?: Json | null
          preceptor_approved_at?: string | null
          preceptor_feedback?: string | null
          preceptor_id?: string | null
          preceptor_status?: string | null
          record_date: string
          record_type: string
          student_id: string
          student_notes?: string | null
          time_in?: string | null
          time_out?: string | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string | null
          clock_in_address?: string | null
          clock_in_latitude?: number | null
          clock_in_longitude?: number | null
          clock_out_address?: string | null
          clock_out_latitude?: number | null
          clock_out_longitude?: number | null
          competency_id?: string | null
          competency_name?: string | null
          created_at?: string
          evaluation_data?: Json | null
          final_status?: string | null
          hours_submitted?: number | null
          id?: string
          instructor_approved_at?: string | null
          instructor_feedback?: string | null
          instructor_id?: string | null
          instructor_status?: string | null
          journal_content?: string | null
          metadata?: Json | null
          preceptor_approved_at?: string | null
          preceptor_feedback?: string | null
          preceptor_id?: string | null
          preceptor_status?: string | null
          record_date?: string
          record_type?: string
          student_id?: string
          student_notes?: string | null
          time_in?: string | null
          time_out?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practicum_records_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "practicum_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      practicum_site_programs: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          max_students_per_term: number | null
          program_id: string
          site_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_students_per_term?: number | null
          program_id: string
          site_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_students_per_term?: number | null
          program_id?: string
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practicum_site_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "practicum_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practicum_site_programs_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "practicum_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      practicum_sites: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          max_capacity_per_month: number | null
          max_capacity_per_semester: number | null
          max_capacity_per_year: number | null
          name: string
          organization: string
          postal_code: string | null
          requirements: Json | null
          specializations: string[] | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          max_capacity_per_month?: number | null
          max_capacity_per_semester?: number | null
          max_capacity_per_year?: number | null
          name: string
          organization: string
          postal_code?: string | null
          requirements?: Json | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          max_capacity_per_month?: number | null
          max_capacity_per_semester?: number | null
          max_capacity_per_year?: number | null
          name?: string
          organization?: string
          postal_code?: string | null
          requirements?: Json | null
          specializations?: string[] | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      practicum_user_roles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          max_students_per_semester: number | null
          notification_preferences: Json | null
          organization: string | null
          phone: string | null
          role_type: string
          site_ids: string[] | null
          specializations: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          max_students_per_semester?: number | null
          notification_preferences?: Json | null
          organization?: string | null
          phone?: string | null
          role_type: string
          site_ids?: string[] | null
          specializations?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          max_students_per_semester?: number | null
          notification_preferences?: Json | null
          organization?: string | null
          phone?: string | null
          role_type?: string
          site_ids?: string[] | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      preceptors: {
        Row: {
          availability_notes: string | null
          bio: string | null
          communication_preferences: Json | null
          created_at: string
          current_students: number | null
          department: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          id: string
          is_active: boolean | null
          is_primary_contact: boolean | null
          last_name: string
          license_expiry: string | null
          license_number: string | null
          max_students: number | null
          phone: string | null
          qualifications: Json | null
          schedule_preferences: Json | null
          site_id: string
          specialization: string | null
          title: string | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          availability_notes?: string | null
          bio?: string | null
          communication_preferences?: Json | null
          created_at?: string
          current_students?: number | null
          department?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          is_primary_contact?: boolean | null
          last_name: string
          license_expiry?: string | null
          license_number?: string | null
          max_students?: number | null
          phone?: string | null
          qualifications?: Json | null
          schedule_preferences?: Json | null
          site_id: string
          specialization?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          availability_notes?: string | null
          bio?: string | null
          communication_preferences?: Json | null
          created_at?: string
          current_students?: number | null
          department?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          is_primary_contact?: boolean | null
          last_name?: string
          license_expiry?: string | null
          license_number?: string | null
          max_students?: number | null
          phone?: string | null
          qualifications?: Json | null
          schedule_preferences?: Json | null
          site_id?: string
          specialization?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_preceptors_site_id"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "practicum_sites"
            referencedColumns: ["id"]
          },
        ]
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
          setup_completed_at: string | null
          setup_progress: number | null
          theme_preference: string | null
          timezone: string | null
          title: string | null
          updated_at: string
          user_id: string
          user_role: string | null
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
          setup_completed_at?: string | null
          setup_progress?: number | null
          theme_preference?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          user_role?: string | null
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
          setup_completed_at?: string | null
          setup_progress?: number | null
          theme_preference?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          user_role?: string | null
        }
        Relationships: []
      }
      program_capacity: {
        Row: {
          class_shaping_rules: Json | null
          created_at: string
          diversity_targets: Json | null
          filled_seats: number
          id: string
          intake_period: string | null
          program_name: string
          target_domestic_ratio: number | null
          target_gpa_max: number | null
          target_gpa_min: number | null
          target_international_ratio: number | null
          total_seats: number
          updated_at: string
          user_id: string
        }
        Insert: {
          class_shaping_rules?: Json | null
          created_at?: string
          diversity_targets?: Json | null
          filled_seats?: number
          id?: string
          intake_period?: string | null
          program_name: string
          target_domestic_ratio?: number | null
          target_gpa_max?: number | null
          target_gpa_min?: number | null
          target_international_ratio?: number | null
          total_seats?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          class_shaping_rules?: Json | null
          created_at?: string
          diversity_targets?: Json | null
          filled_seats?: number
          id?: string
          intake_period?: string | null
          program_name?: string
          target_domestic_ratio?: number | null
          target_gpa_max?: number | null
          target_gpa_min?: number | null
          target_international_ratio?: number | null
          total_seats?: number
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
      program_fit_assessments: {
        Row: {
          academic_alignment_score: number | null
          ai_confidence_score: number | null
          applicant_id: string
          assessed_at: string | null
          assessed_by: string | null
          assessment_data: Json | null
          assessment_notes: string | null
          behavioral_signals_score: number | null
          created_at: string
          engagement_intent_score: number | null
          financial_readiness_score: number | null
          hard_eligibility_passed: boolean
          id: string
          program_fit_score: number
          risk_flags_count: number | null
          updated_at: string
          user_id: string
          yield_propensity_score: number
        }
        Insert: {
          academic_alignment_score?: number | null
          ai_confidence_score?: number | null
          applicant_id: string
          assessed_at?: string | null
          assessed_by?: string | null
          assessment_data?: Json | null
          assessment_notes?: string | null
          behavioral_signals_score?: number | null
          created_at?: string
          engagement_intent_score?: number | null
          financial_readiness_score?: number | null
          hard_eligibility_passed?: boolean
          id?: string
          program_fit_score?: number
          risk_flags_count?: number | null
          updated_at?: string
          user_id: string
          yield_propensity_score?: number
        }
        Update: {
          academic_alignment_score?: number | null
          ai_confidence_score?: number | null
          applicant_id?: string
          assessed_at?: string | null
          assessed_by?: string | null
          assessment_data?: Json | null
          assessment_notes?: string | null
          behavioral_signals_score?: number | null
          created_at?: string
          engagement_intent_score?: number | null
          financial_readiness_score?: number | null
          hard_eligibility_passed?: boolean
          id?: string
          program_fit_score?: number
          risk_flags_count?: number | null
          updated_at?: string
          user_id?: string
          yield_propensity_score?: number
        }
        Relationships: []
      }
      program_term_schedules: {
        Row: {
          capacity_limit: number | null
          classroom_location: string | null
          created_at: string
          enrollment_count: number | null
          id: string
          instructor_assigned: string | null
          notes: string | null
          prerequisites: Json | null
          program_id: string | null
          schedule_id: string
          special_requirements: string | null
          status: string
          term_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          capacity_limit?: number | null
          classroom_location?: string | null
          created_at?: string
          enrollment_count?: number | null
          id?: string
          instructor_assigned?: string | null
          notes?: string | null
          prerequisites?: Json | null
          program_id?: string | null
          schedule_id: string
          special_requirements?: string | null
          status?: string
          term_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          capacity_limit?: number | null
          classroom_location?: string | null
          created_at?: string
          enrollment_count?: number | null
          id?: string
          instructor_assigned?: string | null
          notes?: string | null
          prerequisites?: Json | null
          program_id?: string | null
          schedule_id?: string
          special_requirements?: string | null
          status?: string
          term_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          courses: Json | null
          created_at: string
          custom_questions: Json | null
          description: string | null
          document_requirements: Json | null
          duration: string
          enrollment_status: string | null
          entry_requirements: Json | null
          fee_structure: Json | null
          id: string
          journey_config: Json | null
          metadata: Json | null
          name: string
          next_intake: string | null
          practicum_config: Json | null
          requirements: string[] | null
          tuition: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          courses?: Json | null
          created_at?: string
          custom_questions?: Json | null
          description?: string | null
          document_requirements?: Json | null
          duration: string
          enrollment_status?: string | null
          entry_requirements?: Json | null
          fee_structure?: Json | null
          id?: string
          journey_config?: Json | null
          metadata?: Json | null
          name: string
          next_intake?: string | null
          practicum_config?: Json | null
          requirements?: string[] | null
          tuition?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          courses?: Json | null
          created_at?: string
          custom_questions?: Json | null
          description?: string | null
          document_requirements?: Json | null
          duration?: string
          enrollment_status?: string | null
          entry_requirements?: Json | null
          fee_structure?: Json | null
          id?: string
          journey_config?: Json | null
          metadata?: Json | null
          name?: string
          next_intake?: string | null
          practicum_config?: Json | null
          requirements?: string[] | null
          tuition?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      receipt_templates: {
        Row: {
          body_html: string
          body_text: string
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          body_html: string
          body_text: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          body_html?: string
          body_text?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          template_type?: string
          updated_at?: string | null
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
      role_permissions: {
        Row: {
          permission_id: string
          role: string
        }
        Insert: {
          permission_id: string
          role: string
        }
        Update: {
          permission_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      routing_enrollment_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          enrollment_type: string
          error_message: string | null
          id: string
          leads_assigned: number
          leads_processed: number
          leads_skipped: number
          options: Json | null
          rule_id: string
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          enrollment_type: string
          error_message?: string | null
          id?: string
          leads_assigned?: number
          leads_processed?: number
          leads_skipped?: number
          options?: Json | null
          rule_id: string
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          enrollment_type?: string
          error_message?: string | null
          id?: string
          leads_assigned?: number
          leads_processed?: number
          leads_skipped?: number
          options?: Json | null
          rule_id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "routing_enrollment_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "lead_routing_rules"
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
      sales_targets: {
        Row: {
          category: string
          created_at: string | null
          current_value: number | null
          id: string
          is_active: boolean | null
          name: string
          period_end: string
          period_start: string
          period_type: string
          priority: string | null
          target_value: number
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          period_end: string
          period_start: string
          period_type: string
          priority?: string | null
          target_value: number
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          period_end?: string
          period_start?: string
          period_type?: string
          priority?: string | null
          target_value?: number
          unit?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scheduling_preferences: {
        Row: {
          created_at: string
          id: string
          preference_type: string
          preference_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preference_type: string
          preference_value?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preference_type?: string
          preference_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduling_sessions: {
        Row: {
          assigned_students: number
          batch_id: string | null
          completed_at: string | null
          id: string
          session_data: Json | null
          session_name: string
          started_at: string
          status: string
          total_students: number
          user_id: string
        }
        Insert: {
          assigned_students?: number
          batch_id?: string | null
          completed_at?: string | null
          id?: string
          session_data?: Json | null
          session_name: string
          started_at?: string
          status?: string
          total_students?: number
          user_id: string
        }
        Update: {
          assigned_students?: number
          batch_id?: string | null
          completed_at?: string | null
          id?: string
          session_data?: Json | null
          session_name?: string
          started_at?: string
          status?: string
          total_students?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_sessions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "student_batches"
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
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      setup_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          status: string
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string
          task_id?: string
          updated_at?: string | null
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
      site_capacity_tracking: {
        Row: {
          available_spots: number | null
          created_at: string
          current_assignments: number
          id: string
          max_capacity: number
          period_end: string
          period_start: string
          program_id: string
          site_id: string
          updated_at: string
        }
        Insert: {
          available_spots?: number | null
          created_at?: string
          current_assignments?: number
          id?: string
          max_capacity?: number
          period_end: string
          period_start: string
          program_id: string
          site_id: string
          updated_at?: string
        }
        Update: {
          available_spots?: number | null
          created_at?: string
          current_assignments?: number
          id?: string
          max_capacity?: number
          period_end?: string
          period_start?: string
          program_id?: string
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_capacity_tracking_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "practicum_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_capacity_tracking_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "practicum_sites"
            referencedColumns: ["id"]
          },
        ]
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
      stage_transition_logs: {
        Row: {
          created_at: string | null
          from_stage_id: string | null
          id: string
          journey_id: string | null
          lead_id: string | null
          to_stage_id: string | null
          transition_data: Json | null
          trigger_id: string | null
          trigger_type: string | null
          triggered_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          from_stage_id?: string | null
          id?: string
          journey_id?: string | null
          lead_id?: string | null
          to_stage_id?: string | null
          transition_data?: Json | null
          trigger_id?: string | null
          trigger_type?: string | null
          triggered_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          from_stage_id?: string | null
          id?: string
          journey_id?: string | null
          lead_id?: string | null
          to_stage_id?: string | null
          transition_data?: Json | null
          trigger_id?: string | null
          trigger_type?: string | null
          triggered_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_transition_logs_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "academic_journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_transition_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_transition_triggers: {
        Row: {
          condition_config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          notify_admin: boolean | null
          notify_student: boolean | null
          stage_id: string | null
          target_stage_id: string | null
          trigger_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          condition_config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notify_admin?: boolean | null
          notify_student?: boolean | null
          stage_id?: string | null
          target_stage_id?: string | null
          trigger_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          condition_config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notify_admin?: boolean | null
          notify_student?: boolean | null
          stage_id?: string | null
          target_stage_id?: string | null
          trigger_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_transition_triggers_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_transition_triggers_target_stage_id_fkey"
            columns: ["target_stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          balance: number | null
          created: string
          currency: string | null
          delinquent: boolean | null
          description: string | null
          email: string
          id: string
          lead_id: string | null
          metadata: Json | null
          name: string | null
          phone: string | null
          synced_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created: string
          currency?: string | null
          delinquent?: boolean | null
          description?: string | null
          email: string
          id: string
          lead_id?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          synced_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created?: string
          currency?: string | null
          delinquent?: boolean | null
          description?: string | null
          email?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          synced_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_payment_intents: {
        Row: {
          amount: number
          created: string
          currency: string
          customer_id: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          receipt_email: string | null
          status: string
          synced_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created: string
          currency: string
          customer_id?: string | null
          description?: string | null
          id: string
          metadata?: Json | null
          payment_method?: string | null
          receipt_email?: string | null
          status: string
          synced_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created?: string
          currency?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          receipt_email?: string | null
          status?: string
          synced_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_payment_intents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "stripe_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_prices: {
        Row: {
          active: boolean | null
          created: string
          currency: string
          id: string
          metadata: Json | null
          product_id: string | null
          recurring_interval: string | null
          recurring_interval_count: number | null
          synced_at: string | null
          type: string | null
          unit_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created: string
          currency: string
          id: string
          metadata?: Json | null
          product_id?: string | null
          recurring_interval?: string | null
          recurring_interval_count?: number | null
          synced_at?: string | null
          type?: string | null
          unit_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created?: string
          currency?: string
          id?: string
          metadata?: Json | null
          product_id?: string | null
          recurring_interval?: string | null
          recurring_interval_count?: number | null
          synced_at?: string | null
          type?: string | null
          unit_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stripe_products"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_products: {
        Row: {
          active: boolean | null
          created: string
          default_price_id: string | null
          description: string | null
          id: string
          images: string[] | null
          metadata: Json | null
          name: string
          synced_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created: string
          default_price_id?: string | null
          description?: string | null
          id: string
          images?: string[] | null
          metadata?: Json | null
          name: string
          synced_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created?: string
          default_price_id?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          metadata?: Json | null
          name?: string
          synced_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_sync_log: {
        Row: {
          completed_at: string | null
          customers_matched: number | null
          duration_ms: number | null
          error_message: string | null
          id: string
          records_synced: Json | null
          started_at: string | null
          status: string
          sync_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          customers_matched?: number | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          records_synced?: Json | null
          started_at?: string | null
          status?: string
          sync_type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          customers_matched?: number | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          records_synced?: Json | null
          started_at?: string | null
          status?: string
          sync_type?: string
          user_id?: string
        }
        Relationships: []
      }
      student_academic_plans: {
        Row: {
          academic_level: string | null
          advisor_approved_at: string | null
          advisor_approved_by: string | null
          advisor_notes: string | null
          course_selections: Json | null
          created_at: string | null
          id: string
          intake_date: string | null
          lead_id: string
          prerequisites_status: Json | null
          program_name: string
          session_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          academic_level?: string | null
          advisor_approved_at?: string | null
          advisor_approved_by?: string | null
          advisor_notes?: string | null
          course_selections?: Json | null
          created_at?: string | null
          id?: string
          intake_date?: string | null
          lead_id: string
          prerequisites_status?: Json | null
          program_name: string
          session_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_level?: string | null
          advisor_approved_at?: string | null
          advisor_approved_by?: string | null
          advisor_notes?: string | null
          course_selections?: Json | null
          created_at?: string | null
          id?: string
          intake_date?: string | null
          lead_id?: string
          prerequisites_status?: Json | null
          program_name?: string
          session_id?: string
          status?: string | null
          updated_at?: string | null
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
      student_application_progress: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          estimated_completion: string | null
          id: string
          last_updated_by: string | null
          lead_id: string
          next_steps: string | null
          progress_percentage: number | null
          requirements_completed: Json | null
          requirements_pending: Json | null
          session_id: string
          stage: string
          status: string | null
          substage: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          estimated_completion?: string | null
          id?: string
          last_updated_by?: string | null
          lead_id: string
          next_steps?: string | null
          progress_percentage?: number | null
          requirements_completed?: Json | null
          requirements_pending?: Json | null
          session_id: string
          stage: string
          status?: string | null
          substage?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          estimated_completion?: string | null
          id?: string
          last_updated_by?: string | null
          lead_id?: string
          next_steps?: string | null
          progress_percentage?: number | null
          requirements_completed?: Json | null
          requirements_pending?: Json | null
          session_id?: string
          stage?: string
          status?: string | null
          substage?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      student_batches: {
        Row: {
          batch_name: string
          created_at: string
          description: string | null
          id: string
          program_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          batch_name: string
          created_at?: string
          description?: string | null
          id?: string
          program_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          batch_name?: string
          created_at?: string
          description?: string | null
          id?: string
          program_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_batches_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "practicum_programs"
            referencedColumns: ["id"]
          },
        ]
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
      student_document_uploads: {
        Row: {
          admin_comments: string | null
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          admin_status: string | null
          created_at: string | null
          document_name: string
          document_type: string
          file_path: string | null
          file_size: number | null
          id: string
          lead_id: string
          metadata: Json | null
          ocr_text: string | null
          requirement_id: string | null
          session_id: string
          updated_at: string | null
          upload_status: string | null
        }
        Insert: {
          admin_comments?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string | null
          created_at?: string | null
          document_name: string
          document_type: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          lead_id: string
          metadata?: Json | null
          ocr_text?: string | null
          requirement_id?: string | null
          session_id: string
          updated_at?: string | null
          upload_status?: string | null
        }
        Update: {
          admin_comments?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_status?: string | null
          created_at?: string | null
          document_name?: string
          document_type?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          ocr_text?: string | null
          requirement_id?: string | null
          session_id?: string
          updated_at?: string | null
          upload_status?: string | null
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
      student_fee_payments: {
        Row: {
          admin_confirmed_at: string | null
          admin_confirmed_by: string | null
          amount: number
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          lead_id: string
          paid_date: string | null
          payment_data: Json | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          payment_type: string
          session_id: string
          updated_at: string | null
        }
        Insert: {
          admin_confirmed_at?: string | null
          admin_confirmed_by?: string | null
          amount: number
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          lead_id: string
          paid_date?: string | null
          payment_data?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          payment_type: string
          session_id: string
          updated_at?: string | null
        }
        Update: {
          admin_confirmed_at?: string | null
          admin_confirmed_by?: string | null
          amount?: number
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string
          paid_date?: string | null
          payment_data?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          payment_type?: string
          session_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_journey_instances: {
        Row: {
          completed_at: string | null
          created_at: string
          current_stage_id: string | null
          id: string
          journey_id: string
          lead_id: string
          progress_data: Json | null
          started_at: string
          status: string
          student_type: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_stage_id?: string | null
          id?: string
          journey_id: string
          lead_id: string
          progress_data?: Json | null
          started_at?: string
          status?: string
          student_type: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_stage_id?: string | null
          id?: string
          journey_id?: string
          lead_id?: string
          progress_data?: Json | null
          started_at?: string
          status?: string
          student_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_journey_instances_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_journey_instances_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "academic_journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_journey_instances_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      student_portal_access: {
        Row: {
          access_token: string
          application_date: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          lead_id: string | null
          programs_applied: string[] | null
          status: string | null
          student_name: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          application_date?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          lead_id?: string | null
          programs_applied?: string[] | null
          status?: string | null
          student_name: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          application_date?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          lead_id?: string | null
          programs_applied?: string[] | null
          status?: string | null
          student_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_portal_access_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      student_portal_branding: {
        Row: {
          accent_color: string | null
          background_color: string | null
          created_at: string
          custom_css: string | null
          favicon_url: string | null
          font_family_body: string | null
          font_family_heading: string | null
          font_size_base: string | null
          footer_links: Json | null
          footer_text: string | null
          foreground_color: string | null
          hero_image_url: string | null
          id: string
          layout_template: string | null
          login_background_url: string | null
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          sidebar_position: string | null
          social_media_links: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accent_color?: string | null
          background_color?: string | null
          created_at?: string
          custom_css?: string | null
          favicon_url?: string | null
          font_family_body?: string | null
          font_family_heading?: string | null
          font_size_base?: string | null
          footer_links?: Json | null
          footer_text?: string | null
          foreground_color?: string | null
          hero_image_url?: string | null
          id?: string
          layout_template?: string | null
          login_background_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          sidebar_position?: string | null
          social_media_links?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accent_color?: string | null
          background_color?: string | null
          created_at?: string
          custom_css?: string | null
          favicon_url?: string | null
          font_family_body?: string | null
          font_family_heading?: string | null
          font_size_base?: string | null
          footer_links?: Json | null
          footer_text?: string | null
          foreground_color?: string | null
          hero_image_url?: string | null
          id?: string
          layout_template?: string | null
          login_background_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          sidebar_position?: string | null
          social_media_links?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      student_portal_communication_templates: {
        Row: {
          available_variables: Json | null
          body: string
          created_at: string
          delay_minutes: number | null
          html_body: string | null
          id: string
          is_active: boolean | null
          is_automated: boolean | null
          last_used_at: string | null
          priority: string | null
          scheduled_time: string | null
          send_time: string | null
          subject: string | null
          template_category: string | null
          template_name: string
          template_type: string
          times_used: number | null
          trigger_conditions: Json | null
          trigger_event: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          available_variables?: Json | null
          body: string
          created_at?: string
          delay_minutes?: number | null
          html_body?: string | null
          id?: string
          is_active?: boolean | null
          is_automated?: boolean | null
          last_used_at?: string | null
          priority?: string | null
          scheduled_time?: string | null
          send_time?: string | null
          subject?: string | null
          template_category?: string | null
          template_name: string
          template_type: string
          times_used?: number | null
          trigger_conditions?: Json | null
          trigger_event?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          available_variables?: Json | null
          body?: string
          created_at?: string
          delay_minutes?: number | null
          html_body?: string | null
          id?: string
          is_active?: boolean | null
          is_automated?: boolean | null
          last_used_at?: string | null
          priority?: string | null
          scheduled_time?: string | null
          send_time?: string | null
          subject?: string | null
          template_category?: string | null
          template_name?: string
          template_type?: string
          times_used?: number | null
          trigger_conditions?: Json | null
          trigger_event?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      student_portal_communications: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_read: boolean | null
          lead_id: string
          message: string
          message_type: string | null
          priority: string | null
          read_at: string | null
          recipient_id: string | null
          recipient_type: string
          sender_id: string | null
          sender_name: string
          sender_type: string
          session_id: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          lead_id: string
          message: string
          message_type?: string | null
          priority?: string | null
          read_at?: string | null
          recipient_id?: string | null
          recipient_type: string
          sender_id?: string | null
          sender_name: string
          sender_type: string
          session_id?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          lead_id?: string
          message?: string
          message_type?: string | null
          priority?: string | null
          read_at?: string | null
          recipient_id?: string | null
          recipient_type?: string
          sender_id?: string | null
          sender_name?: string
          sender_type?: string
          session_id?: string | null
          subject?: string | null
          updated_at?: string | null
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
      student_portal_content_categories: {
        Row: {
          category_description: string | null
          category_name: string
          category_slug: string
          color: string | null
          created_at: string
          icon: string | null
          id: string
          is_public: boolean | null
          parent_category_id: string | null
          position: number | null
          required_roles: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_description?: string | null
          category_name: string
          category_slug: string
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_public?: boolean | null
          parent_category_id?: string | null
          position?: number | null
          required_roles?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_description?: string | null
          category_name?: string
          category_slug?: string
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_public?: boolean | null
          parent_category_id?: string | null
          position?: number | null
          required_roles?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_portal_content_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "student_portal_content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      student_portal_media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          category: string | null
          created_at: string
          description: string | null
          duration: number | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          folder: string | null
          height: number | null
          id: string
          mime_type: string | null
          tags: Json | null
          times_used: number | null
          updated_at: string
          user_id: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          tags?: Json | null
          times_used?: number | null
          updated_at?: string
          user_id?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          tags?: Json | null
          times_used?: number | null
          updated_at?: string
          user_id?: string | null
          width?: number | null
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
      student_portal_navigation: {
        Row: {
          badge_color: string | null
          badge_text: string | null
          created_at: string
          description: string | null
          external_url: string | null
          icon: string | null
          id: string
          is_enabled: boolean | null
          is_visible: boolean | null
          label: string
          parent_id: string | null
          path: string | null
          position: number
          required_intakes: Json | null
          required_programs: Json | null
          required_roles: Json | null
          required_statuses: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          is_visible?: boolean | null
          label: string
          parent_id?: string | null
          path?: string | null
          position?: number
          required_intakes?: Json | null
          required_programs?: Json | null
          required_roles?: Json | null
          required_statuses?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          is_visible?: boolean | null
          label?: string
          parent_id?: string | null
          path?: string | null
          position?: number
          required_intakes?: Json | null
          required_programs?: Json | null
          required_roles?: Json | null
          required_statuses?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_portal_navigation_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "student_portal_navigation"
            referencedColumns: ["id"]
          },
        ]
      }
      student_portal_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          lead_id: string
          message: string
          metadata: Json | null
          notification_type: string
          priority: string | null
          read_at: string | null
          session_id: string | null
          title: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          lead_id: string
          message: string
          metadata?: Json | null
          notification_type: string
          priority?: string | null
          read_at?: string | null
          session_id?: string | null
          title: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          lead_id?: string
          message?: string
          metadata?: Json | null
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          session_id?: string | null
          title?: string
        }
        Relationships: []
      }
      student_portal_roles: {
        Row: {
          allowed_campuses: Json | null
          allowed_content_categories: Json | null
          allowed_programs: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          permissions: Json | null
          priority: number | null
          restricted_content_categories: Json | null
          role_description: string | null
          role_name: string
          role_type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          allowed_campuses?: Json | null
          allowed_content_categories?: Json | null
          allowed_programs?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          permissions?: Json | null
          priority?: number | null
          restricted_content_categories?: Json | null
          role_description?: string | null
          role_name: string
          role_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          allowed_campuses?: Json | null
          allowed_content_categories?: Json | null
          allowed_programs?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          permissions?: Json | null
          priority?: number | null
          restricted_content_categories?: Json | null
          role_description?: string | null
          role_name?: string
          role_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      student_portal_sessions: {
        Row: {
          access_token: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          is_active: boolean | null
          last_activity: string | null
          lead_id: string
          session_data: Json | null
          student_name: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          lead_id: string
          session_data?: Json | null
          student_name: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          lead_id?: string
          session_data?: Json | null
          student_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_portals: {
        Row: {
          access_token: string
          country: string | null
          created_at: string
          email: string
          id: string
          intake_date: string | null
          is_active: boolean
          phone: string | null
          portal_config: Json
          program: string
          student_name: string
          updated_at: string
        }
        Insert: {
          access_token?: string
          country?: string | null
          created_at?: string
          email: string
          id?: string
          intake_date?: string | null
          is_active?: boolean
          phone?: string | null
          portal_config?: Json
          program: string
          student_name: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          intake_date?: string | null
          is_active?: boolean
          phone?: string | null
          portal_config?: Json
          program?: string
          student_name?: string
          updated_at?: string
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
      system_properties: {
        Row: {
          category: string
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          metadata: Json | null
          order_index: number | null
          property_description: string | null
          property_key: string
          property_label: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          metadata?: Json | null
          order_index?: number | null
          property_description?: string | null
          property_key: string
          property_label: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          metadata?: Json | null
          order_index?: number | null
          property_description?: string | null
          property_key?: string
          property_label?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      team_goals: {
        Row: {
          assignee_ids: string[] | null
          assignee_names: string[] | null
          created_at: string
          created_by: string | null
          current_value: number
          description: string | null
          end_date: string
          goal_name: string
          goal_period: string
          goal_type: string
          id: string
          is_cascading: boolean
          metadata: Json | null
          metric_type: string
          parent_goal_id: string | null
          priority: string
          role_filter: string | null
          start_date: string
          status: string
          target_value: number
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee_ids?: string[] | null
          assignee_names?: string[] | null
          created_at?: string
          created_by?: string | null
          current_value?: number
          description?: string | null
          end_date: string
          goal_name: string
          goal_period: string
          goal_type: string
          id?: string
          is_cascading?: boolean
          metadata?: Json | null
          metric_type: string
          parent_goal_id?: string | null
          priority?: string
          role_filter?: string | null
          start_date: string
          status?: string
          target_value: number
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee_ids?: string[] | null
          assignee_names?: string[] | null
          created_at?: string
          created_by?: string | null
          current_value?: number
          description?: string | null
          end_date?: string
          goal_name?: string
          goal_period?: string
          goal_type?: string
          id?: string
          is_cascading?: boolean
          metadata?: Json | null
          metric_type?: string
          parent_goal_id?: string | null
          priority?: string
          role_filter?: string | null
          start_date?: string
          status?: string
          target_value?: number
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_goals_parent_goal_id_fkey"
            columns: ["parent_goal_id"]
            isOneToOne: false
            referencedRelation: "team_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      team_hierarchy: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          metadata: Json | null
          name: string
          parent_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          metadata?: Json | null
          name: string
          parent_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          metadata?: Json | null
          name?: string
          parent_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_hierarchy_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "team_hierarchy"
            referencedColumns: ["id"]
          },
        ]
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
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          first_name: string | null
          id: string
          invite_token: string
          invited_by: string | null
          last_name: string | null
          personal_message: string | null
          role: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          first_name?: string | null
          id?: string
          invite_token?: string
          invited_by?: string | null
          last_name?: string | null
          personal_message?: string | null
          role: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          first_name?: string | null
          id?: string
          invite_token?: string
          invited_by?: string | null
          last_name?: string | null
          personal_message?: string | null
          role?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      user_notification_preferences: {
        Row: {
          channel: string
          created_at: string | null
          digest_time: string | null
          enabled: boolean | null
          frequency: string | null
          id: string
          include_details: boolean | null
          notification_type: string
          priority_filter: string | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channel: string
          created_at?: string | null
          digest_time?: string | null
          enabled?: boolean | null
          frequency?: string | null
          id?: string
          include_details?: boolean | null
          notification_type: string
          priority_filter?: string | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string | null
          digest_time?: string | null
          enabled?: boolean | null
          frequency?: string | null
          id?: string
          include_details?: boolean | null
          notification_type?: string
          priority_filter?: string | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_id: string
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id: string
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          email_signature: string | null
          id: string
          outlook_access_token: string | null
          outlook_connected: boolean | null
          outlook_email: string | null
          outlook_refresh_token: string | null
          outlook_token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_signature?: string | null
          id?: string
          outlook_access_token?: string | null
          outlook_connected?: boolean | null
          outlook_email?: string | null
          outlook_refresh_token?: string | null
          outlook_token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_signature?: string | null
          id?: string
          outlook_access_token?: string | null
          outlook_connected?: boolean | null
          outlook_email?: string | null
          outlook_refresh_token?: string | null
          outlook_token_expires_at?: string | null
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
      array_remove_all: {
        Args: { arr: string[]; elements: string[] }
        Returns: string[]
      }
      assign_demo_data_to_user: {
        Args: { demo_enabled?: boolean; target_email: string }
        Returns: boolean
      }
      bulk_update_lead_tags: {
        Args: { p_lead_ids: string[]; p_operation: string; p_tags: string[] }
        Returns: number
      }
      cleanup_expired_otps: { Args: never; Returns: undefined }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      increment_advisor_weekly_assignments: {
        Args: { p_advisor_id: string }
        Returns: undefined
      }
      log_security_event: {
        Args: { p_action: string; p_record_id?: string; p_table_name?: string }
        Returns: undefined
      }
      reset_weekly_advisor_assignments: { Args: never; Returns: undefined }
      user_has_demo_data: { Args: { user_email?: string }; Returns: boolean }
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
        | "webform"
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
        "webform",
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
