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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type_id: number
          calendar_event_id: string | null
          calendar_provider: string | null
          calendar_sync_status: string | null
          created_at: string
          description: string | null
          end_time: string | null
          from_template_id: number | null
          id: string
          kind: Database["public"]["Enums"]["activity_kind"] | null
          metadata: Json | null
          planned_at: string | null
          start_time: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_type_id: number
          calendar_event_id?: string | null
          calendar_provider?: string | null
          calendar_sync_status?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          from_template_id?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["activity_kind"] | null
          metadata?: Json | null
          planned_at?: string | null
          start_time: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_type_id?: number
          calendar_event_id?: string | null
          calendar_provider?: string | null
          calendar_sync_status?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          from_template_id?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["activity_kind"] | null
          metadata?: Json | null
          planned_at?: string | null
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_activity_type_id_fkey"
            columns: ["activity_type_id"]
            isOneToOne: false
            referencedRelation: "activity_types"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_states: {
        Row: {
          activity_id: string
          created_at: string
          energy_after: number | null
          energy_before: number | null
          id: string
          metadata: Json | null
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          energy_after?: number | null
          energy_before?: number | null
          id?: string
          metadata?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          state?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          energy_after?: number | null
          energy_before?: number | null
          id?: string
          metadata?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_states_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          default_notes: string | null
          id: number
          is_public: boolean | null
          kind: Database["public"]["Enums"]["activity_kind"]
          metadata: Json | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          default_notes?: string | null
          id?: number
          is_public?: boolean | null
          kind: Database["public"]["Enums"]["activity_kind"]
          metadata?: Json | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          default_notes?: string | null
          id?: number
          is_public?: boolean | null
          kind?: Database["public"]["Enums"]["activity_kind"]
          metadata?: Json | null
          title?: string
        }
        Relationships: []
      }
      activity_types: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_diary_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          metadata: Json | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_diary_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_diary_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      ai_diary_sessions: {
        Row: {
          created_at: string | null
          emotional_state: Json | null
          ended_at: string | null
          id: string
          insights: Json | null
          session_id: string
          started_at: string | null
          summary: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emotional_state?: Json | null
          ended_at?: string | null
          id?: string
          insights?: Json | null
          session_id?: string
          started_at?: string | null
          summary?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          emotional_state?: Json | null
          ended_at?: string | null
          id?: string
          insights?: Json | null
          session_id?: string
          started_at?: string | null
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          ai_summary: string | null
          context: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          topic: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          context?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          topic: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          context?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      diary_entry_emotions: {
        Row: {
          entry_id: string
          id: number
          intensity: number | null
          label: string
        }
        Insert: {
          entry_id: string
          id?: number
          intensity?: number | null
          label: string
        }
        Update: {
          entry_id?: string
          id?: number
          intensity?: number | null
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_entry_emotions_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "diary_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_entry_metrics: {
        Row: {
          entry_id: string
          id: number
          key: string
          norm_max: number | null
          norm_min: number | null
          value: number
        }
        Insert: {
          entry_id: string
          id?: number
          key: string
          norm_max?: number | null
          norm_min?: number | null
          value: number
        }
        Update: {
          entry_id?: string
          id?: number
          key?: string
          norm_max?: number | null
          norm_min?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "diary_entry_metrics_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "diary_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_notes: {
        Row: {
          ai_followups: string[] | null
          ai_suggestions: string[] | null
          created_at: string | null
          id: string
          metadata: Json | null
          text: string
          topics: string[] | null
          user_id: string
        }
        Insert: {
          ai_followups?: string[] | null
          ai_suggestions?: string[] | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          text: string
          topics?: string[] | null
          user_id: string
        }
        Update: {
          ai_followups?: string[] | null
          ai_suggestions?: string[] | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          text?: string
          topics?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      four_scale_trackers: {
        Row: {
          activity_id: string | null
          created_at: string | null
          date: string
          day_part: Database["public"]["Enums"]["day_part"] | null
          energy_cost: number
          id: string
          metadata: Json | null
          process_satisfaction: number
          result_satisfaction: number
          scope: Database["public"]["Enums"]["tracker_scope"]
          stress_level: number
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          date: string
          day_part?: Database["public"]["Enums"]["day_part"] | null
          energy_cost: number
          id?: string
          metadata?: Json | null
          process_satisfaction: number
          result_satisfaction: number
          scope: Database["public"]["Enums"]["tracker_scope"]
          stress_level: number
          user_id: string
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          date?: string
          day_part?: Database["public"]["Enums"]["day_part"] | null
          energy_cost?: number
          id?: string
          metadata?: Json | null
          process_satisfaction?: number
          result_satisfaction?: number
          scope?: Database["public"]["Enums"]["tracker_scope"]
          stress_level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "four_scale_trackers_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_alerts: {
        Row: {
          created_at: string | null
          delivered: boolean | null
          entry_id: string
          id: number
          metric_key: string
          norm_max: number | null
          norm_min: number | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          delivered?: boolean | null
          entry_id: string
          id?: number
          metric_key: string
          norm_max?: number | null
          norm_min?: number | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          delivered?: boolean | null
          entry_id?: string
          id?: number
          metric_key?: string
          norm_max?: number | null
          norm_min?: number | null
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metric_alerts_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "diary_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_diary_entries: {
        Row: {
          body_areas: string[] | null
          context: string | null
          created_at: string
          emotions: Json
          id: string
          mood_score: number
          notes: string | null
          physical_sensations: string[] | null
          triggers: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body_areas?: string[] | null
          context?: string | null
          created_at?: string
          emotions?: Json
          id?: string
          mood_score: number
          notes?: string | null
          physical_sensations?: string[] | null
          triggers?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body_areas?: string[] | null
          context?: string | null
          created_at?: string
          emotions?: Json
          id?: string
          mood_score?: number
          notes?: string | null
          physical_sensations?: string[] | null
          triggers?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      practices: {
        Row: {
          benefits: string[]
          category: string | null
          created_at: string
          created_by: string
          description: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          duration_minutes: number | null
          id: number
          instructions: string[]
          metadata: Json
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string[]
          category?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          duration_minutes?: number | null
          id?: number
          instructions?: string[]
          metadata?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string[]
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          duration_minutes?: number | null
          id?: number
          instructions?: string[]
          metadata?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile_access_logs: {
        Row: {
          access_type: string
          accessed_fields: string[] | null
          accessed_user_id: string
          admin_user_id: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          reason: string | null
          user_agent: string | null
        }
        Insert: {
          access_type: string
          accessed_fields?: string[] | null
          accessed_user_id: string
          admin_user_id: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          reason?: string | null
          user_agent?: string | null
        }
        Update: {
          access_type?: string
          accessed_fields?: string[] | null
          accessed_user_id?: string
          admin_user_id?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          reason?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          facebook_url: string | null
          full_name: string | null
          id: string
          role: string | null
          telegram_handle: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          telegram_handle?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          telegram_handle?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      sleep_diary_entries: {
        Row: {
          bedtime: string
          created_at: string
          day_rest_effectiveness: number | null
          day_rest_type: string | null
          has_day_rest: boolean
          id: string
          morning_feeling: number
          night_awakenings: number
          overall_sleep_impact: number
          recommendations: string[] | null
          rest_comment: string | null
          sleep_comment: string | null
          sleep_disruptors: string[] | null
          sleep_duration: number
          sleep_quality: number
          updated_at: string
          user_id: string
          wake_up_time: string
        }
        Insert: {
          bedtime: string
          created_at?: string
          day_rest_effectiveness?: number | null
          day_rest_type?: string | null
          has_day_rest?: boolean
          id?: string
          morning_feeling: number
          night_awakenings?: number
          overall_sleep_impact: number
          recommendations?: string[] | null
          rest_comment?: string | null
          sleep_comment?: string | null
          sleep_disruptors?: string[] | null
          sleep_duration: number
          sleep_quality: number
          updated_at?: string
          user_id: string
          wake_up_time: string
        }
        Update: {
          bedtime?: string
          created_at?: string
          day_rest_effectiveness?: number | null
          day_rest_type?: string | null
          has_day_rest?: boolean
          id?: string
          morning_feeling?: number
          night_awakenings?: number
          overall_sleep_impact?: number
          recommendations?: string[] | null
          rest_comment?: string | null
          sleep_comment?: string | null
          sleep_disruptors?: string[] | null
          sleep_duration?: number
          sleep_quality?: number
          updated_at?: string
          user_id?: string
          wake_up_time?: string
        }
        Relationships: []
      }
      strategies: {
        Row: {
          category: string | null
          content: Json
          created_at: string
          created_by: string
          description: string | null
          id: number
          metadata: Json
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by: string
          description?: string | null
          id?: number
          metadata?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          metadata?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tests: {
        Row: {
          category: string | null
          content: Json
          created_at: string
          created_by: string
          description: string | null
          id: number
          metadata: Json
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by: string
          description?: string | null
          id?: number
          metadata?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          metadata?: Json
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      therapy_questions: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          parent_question_id: string | null
          question_code: string
          question_text: string
          question_type: string | null
          scenario_id: string | null
          sequence_number: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          parent_question_id?: string | null
          question_code: string
          question_text: string
          question_type?: string | null
          scenario_id?: string | null
          sequence_number?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          parent_question_id?: string | null
          question_code?: string
          question_text?: string
          question_type?: string | null
          scenario_id?: string | null
          sequence_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "therapy_questions_parent_question_id_fkey"
            columns: ["parent_question_id"]
            isOneToOne: false
            referencedRelation: "therapy_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapy_questions_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "therapy_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      therapy_scenarios: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string | null
          priority: number | null
          scenario_code: string
          scenario_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          priority?: number | null
          scenario_code: string
          scenario_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          priority?: number | null
          scenario_code?: string
          scenario_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      therapy_transitions: {
        Row: {
          condition_data: Json | null
          condition_type: string | null
          created_at: string | null
          from_question_id: string | null
          id: string
          next_question_id: string | null
          next_scenario_id: string | null
          priority: number | null
        }
        Insert: {
          condition_data?: Json | null
          condition_type?: string | null
          created_at?: string | null
          from_question_id?: string | null
          id?: string
          next_question_id?: string | null
          next_scenario_id?: string | null
          priority?: number | null
        }
        Update: {
          condition_data?: Json | null
          condition_type?: string | null
          created_at?: string | null
          from_question_id?: string | null
          id?: string
          next_question_id?: string | null
          next_scenario_id?: string | null
          priority?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "therapy_transitions_from_question_id_fkey"
            columns: ["from_question_id"]
            isOneToOne: false
            referencedRelation: "therapy_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapy_transitions_next_question_id_fkey"
            columns: ["next_question_id"]
            isOneToOne: false
            referencedRelation: "therapy_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapy_transitions_next_scenario_id_fkey"
            columns: ["next_scenario_id"]
            isOneToOne: false
            referencedRelation: "therapy_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_active_diaries: {
        Row: {
          created_at: string | null
          id: string
          scenario_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          scenario_slug: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          scenario_slug?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_therapy_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_question_id: string | null
          id: string
          insights: Json | null
          metrics: Json | null
          responses: Json | null
          scenario_id: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_question_id?: string | null
          id?: string
          insights?: Json | null
          metrics?: Json | null
          responses?: Json | null
          scenario_id?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_question_id?: string | null
          id?: string
          insights?: Json | null
          metrics?: Json | null
          responses?: Json | null
          scenario_id?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_therapy_progress_current_question_id_fkey"
            columns: ["current_question_id"]
            isOneToOne: false
            referencedRelation: "therapy_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_therapy_progress_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "therapy_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_daily_rli: {
        Row: {
          date: string | null
          day_recovery: number | null
          day_strain: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_default_norms: {
        Row: {
          metric_key: string | null
          norm_max: number | null
          norm_min: number | null
        }
        Relationships: []
      }
      v_diary_metrics_timeseries: {
        Row: {
          key: string | null
          norm_max: number | null
          norm_min: number | null
          topic: string | null
          ts: string | null
          user_id: string | null
          value: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_get_user_profiles: {
        Args: { limit_count?: number; offset_count?: number }
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          last_sign_in: string
          role: string
        }[]
      }
      ensure_ai_session: {
        Args: { p_session_id: string; p_user_id: string }
        Returns: {
          is_new: boolean
          session_id: string
        }[]
      }
      get_my_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string | null
          created_at: string
          email: string | null
          facebook_url: string | null
          full_name: string | null
          id: string
          role: string | null
          telegram_handle: string | null
          updated_at: string
          whatsapp_number: string | null
        }
      }
      get_user_profile_with_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          created_at: string
          email: string
          facebook_url: string
          full_name: string
          id: string
          role: string
          telegram_handle: string
          updated_at: string
          whatsapp_number: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      insert_test_mood_entries: {
        Args: Record<PropertyKey, never>
        Returns: {
          inserted_count: number
        }[]
      }
      log_profile_access: {
        Args: {
          access_type: string
          accessed_fields?: string[]
          accessed_user_id: string
          reason?: string
        }
        Returns: undefined
      }
      test_webhook_connection: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_activity_status: {
        Args: { activity_id: string; new_status: string; user_notes?: string }
        Returns: {
          id: string
          status: string
          title: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      activity_kind: "restorative" | "neutral" | "mixed" | "depleting"
      app_role: "admin" | "user"
      content_status: "draft" | "published"
      day_part: "morning" | "afternoon" | "evening"
      difficulty_level: "beginner" | "intermediate" | "advanced"
      tracker_scope: "day" | "day_part" | "activity"
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
      activity_kind: ["restorative", "neutral", "mixed", "depleting"],
      app_role: ["admin", "user"],
      content_status: ["draft", "published"],
      day_part: ["morning", "afternoon", "evening"],
      difficulty_level: ["beginner", "intermediate", "advanced"],
      tracker_scope: ["day", "day_part", "activity"],
    },
  },
} as const
