export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      active_sessions: {
        Row: {
          id: string
          last_seen: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          id?: string
          last_seen?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          id?: string
          last_seen?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "active_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_issues: {
        Row: {
          browser_info: string | null
          component_name: string | null
          created_at: string
          error_message: string
          error_stack: string | null
          id: string
          route_path: string | null
          user_id: string | null
        }
        Insert: {
          browser_info?: string | null
          component_name?: string | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          id?: string
          route_path?: string | null
          user_id?: string | null
        }
        Update: {
          browser_info?: string | null
          component_name?: string | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          id?: string
          route_path?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_issues_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_id: string
          thesis_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_id: string
          thesis_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          thesis_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      citations: {
        Row: {
          authors: string[]
          created_at: string
          doi: string | null
          id: string
          issue: string | null
          journal: string | null
          pages: string | null
          publisher: string | null
          source: string
          text: string
          thesis_id: string
          type: string
          updated_at: string
          url: string | null
          volume: string | null
          year: string
        }
        Insert: {
          authors?: string[]
          created_at?: string
          doi?: string | null
          id?: string
          issue?: string | null
          journal?: string | null
          pages?: string | null
          publisher?: string | null
          source: string
          text: string
          thesis_id: string
          type: string
          updated_at?: string
          url?: string | null
          volume?: string | null
          year: string
        }
        Update: {
          authors?: string[]
          created_at?: string
          doi?: string | null
          id?: string
          issue?: string | null
          journal?: string | null
          pages?: string | null
          publisher?: string | null
          source?: string
          text?: string
          thesis_id?: string
          type?: string
          updated_at?: string
          url?: string | null
          volume?: string | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "citations_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citations_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          created_at: string | null
          description: string | null
          health: string
          id: string
          is_sub_feature: boolean | null
          last_updated: string | null
          name: string
          parent_id: string | null
          pricing_tier: string | null
          status: string
          trial_days: number | null
          usage_data: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          health?: string
          id?: string
          is_sub_feature?: boolean | null
          last_updated?: string | null
          name: string
          parent_id?: string | null
          pricing_tier?: string | null
          status?: string
          trial_days?: number | null
          usage_data?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          health?: string
          id?: string
          is_sub_feature?: boolean | null
          last_updated?: string | null
          name?: string
          parent_id?: string | null
          pricing_tier?: string | null
          status?: string
          trial_days?: number | null
          usage_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "features_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
        ]
      }
      footnotes: {
        Row: {
          content: string
          created_at: string
          id: string
          number: number
          section_id: string
          thesis_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          number: number
          section_id: string
          thesis_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          number?: number
          section_id?: string
          thesis_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "footnotes_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "footnotes_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          thesis_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          thesis_id: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          thesis_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string
          full_name: string | null
          id: string
          program: string | null
          role_id: string | null
          student_id: string | null
          year_of_study: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          full_name?: string | null
          id: string
          program?: string | null
          role_id?: string | null
          student_id?: string | null
          year_of_study?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string | null
          id?: string
          program?: string | null
          role_id?: string | null
          student_id?: string | null
          year_of_study?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      section_managers: {
        Row: {
          created_at: string
          id: string
          section_id: string
          settings: Json | null
          thesis_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          section_id: string
          settings?: Json | null
          thesis_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          section_id?: string
          settings?: Json | null
          thesis_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "section_managers_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_managers_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_managers_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          content: string | null
          created_at: string
          id: string
          thesis_id: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          thesis_id?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          thesis_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      theses: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          id: string
          language: string
          permissions: Json | null
          status: string | null
          supervisor_email: string | null
          supervisor_id: string | null
          title: string
          updated_at: string
          user_id: string
          version: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          language?: string
          permissions?: Json | null
          status?: string | null
          supervisor_email?: string | null
          supervisor_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          version?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          language?: string
          permissions?: Json | null
          status?: string | null
          supervisor_email?: string | null
          supervisor_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theses_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_annotations: {
        Row: {
          content: Json
          created_at: string
          id: string
          reviewer_id: string | null
          section_id: string
          thesis_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          reviewer_id?: string | null
          section_id: string
          thesis_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          reviewer_id?: string | null
          section_id?: string
          thesis_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "thesis_annotations_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_annotations_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_annotations_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_collaborators: {
        Row: {
          created_at: string
          id: string
          role: string
          thesis_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          thesis_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          thesis_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thesis_collaborators_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_collaborators_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_references: {
        Row: {
          authors: string[]
          created_at: string
          doi: string | null
          id: string
          issue: string | null
          journal: string | null
          pages: string | null
          publisher: string | null
          source: string
          text: string
          thesis_id: string
          title: string
          type: string
          updated_at: string
          url: string | null
          volume: string | null
          year: string
        }
        Insert: {
          authors?: string[]
          created_at?: string
          doi?: string | null
          id?: string
          issue?: string | null
          journal?: string | null
          pages?: string | null
          publisher?: string | null
          source: string
          text: string
          thesis_id: string
          title: string
          type: string
          updated_at?: string
          url?: string | null
          volume?: string | null
          year: string
        }
        Update: {
          authors?: string[]
          created_at?: string
          doi?: string | null
          id?: string
          issue?: string | null
          journal?: string | null
          pages?: string | null
          publisher?: string | null
          source?: string
          text?: string
          thesis_id?: string
          title?: string
          type?: string
          updated_at?: string
          url?: string | null
          volume?: string | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "thesis_references_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_references_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_reviews: {
        Row: {
          content: Json
          created_at: string
          id: string
          parent_id: string | null
          reviewer_id: string
          section_id: string
          status: string
          thesis_id: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          parent_id?: string | null
          reviewer_id: string
          section_id: string
          status?: string
          thesis_id: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          parent_id?: string | null
          reviewer_id?: string
          section_id?: string
          status?: string
          thesis_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "thesis_reviews_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thesis_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_reviews_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_reviews_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          language: string
          name: string
          structure: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          language?: string
          name: string
          structure: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          language?: string
          name?: string
          structure?: Json
          updated_at?: string
        }
        Relationships: []
      }
      thesis_versions: {
        Row: {
          content: Json
          created_at: string
          created_by: string
          description: string | null
          id: string
          language: string
          thesis_id: string
          version_number: number
        }
        Insert: {
          content?: Json
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          language?: string
          thesis_id: string
          version_number: number
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          language?: string
          thesis_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "thesis_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_versions_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "supervisor_theses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_versions_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_settings: {
        Row: {
          created_at: string
          id: string
          trial_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          trial_days?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_features: {
        Row: {
          access_type: string
          created_at: string
          expires_at: string | null
          feature_id: string | null
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_type: string
          created_at?: string
          expires_at?: string | null
          feature_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_type?: string
          created_at?: string
          expires_at?: string | null
          feature_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_features_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          created_at: string
          element_class: string | null
          element_id: string | null
          event_type: string
          id: string
          page_path: string | null
          scroll_depth: number | null
          user_id: string | null
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          event_type: string
          id?: string
          page_path?: string | null
          scroll_depth?: number | null
          user_id?: string | null
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          event_type?: string
          id?: string
          page_path?: string | null
          scroll_depth?: number | null
          user_id?: string | null
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      supervisor_theses: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string | null
          language: string | null
          student_email: string | null
          supervisor_email: string | null
          supervisor_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theses_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_section: {
        Args: {
          p_thesis_id: string
          p_section_id: string
          p_section_title: string
          p_section_type: Database["public"]["Enums"]["sectiontype"]
        }
        Returns: {
          content: string | null
          created_at: string
          id: string
          thesis_id: string | null
          title: string
          type: string
          updated_at: string
        }[]
      }
      create_section_if_not_exists: {
        Args: {
          p_thesis_id: string
          p_section_title: string
          p_section_type: string
        }
        Returns: {
          content: string | null
          created_at: string
          id: string
          thesis_id: string | null
          title: string
          type: string
          updated_at: string
        }[]
      }
      get_latest_thesis_version: {
        Args: {
          p_thesis_id: string
        }
        Returns: {
          content: Json
          created_at: string
          created_by: string
          description: string | null
          id: string
          language: string
          thesis_id: string
          version_number: number
        }
      }
    }
    Enums: {
      section_type:
        | "abstract"
        | "general-introduction"
        | "introduction"
        | "chapter"
        | "conclusion"
        | "general-conclusion"
        | "references"
        | "appendix"
        | "table-of-contents"
        | "acknowledgments"
      sectiontype:
        | "abstract"
        | "general_introduction"
        | "introduction"
        | "chapter"
        | "conclusion"
        | "general_conclusion"
        | "references"
        | "appendix"
        | "table-of-contents"
        | "acknowledgments"
        | "structure-overview"
        | "custom"
        | "title"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
