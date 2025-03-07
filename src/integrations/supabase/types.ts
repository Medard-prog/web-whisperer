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
      messages: {
        Row: {
          attachment_type: string | null
          attachment_url: string | null
          content: string
          created_at: string | null
          id: string
          is_admin: boolean | null
          project_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attachment_type?: string | null
          attachment_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          project_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attachment_type?: string | null
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          project_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          is_admin: boolean | null
          name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          is_admin?: boolean | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_admin?: boolean | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_messages: {
        Row: {
          attachment_type: string | null
          attachment_url: string | null
          content: string
          created_at: string | null
          id: string
          is_admin: boolean | null
          project_id: string
          user_id: string
        }
        Insert: {
          attachment_type?: string | null
          attachment_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          project_id: string
          user_id: string
        }
        Update: {
          attachment_type?: string | null
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          project_id?: string
          user_id?: string
        }
        Relationships: []
      }
      project_modification_requests: {
        Row: {
          budget: string
          created_at: string | null
          description: string
          id: string
          priority: string
          project_id: string
          status: string
          timeline: string
          user_id: string
        }
        Insert: {
          budget: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string
          project_id: string
          status?: string
          timeline: string
          user_id: string
        }
        Update: {
          budget?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          project_id?: string
          status?: string
          timeline?: string
          user_id?: string
        }
        Relationships: []
      }
      project_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          file_name: string | null
          file_path: string | null
          file_url: string | null
          id: string
          is_admin_only: boolean | null
          project_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          file_name?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          is_admin_only?: boolean | null
          project_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          file_name?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          is_admin_only?: boolean | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_notes_project_id_fkey1"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_requests: {
        Row: {
          budget: string
          business_goal: string | null
          communication_preference: string
          company: string | null
          created_at: string | null
          custom_budget: string | null
          custom_communication: string | null
          custom_timeline: string | null
          description: string
          design_complexity: string | null
          email: string
          file_description: string | null
          file_urls: string[] | null
          has_cms: boolean | null
          has_ecommerce: boolean | null
          has_files: boolean | null
          has_maintenance: boolean | null
          has_seo: boolean | null
          id: string
          name: string
          newsletter_consent: boolean | null
          page_count: number | null
          phone: string | null
          price: number | null
          project_name: string
          project_type: string
          specific_type: string | null
          status: string | null
          target_audience: string | null
          timeline: string
          user_id: string | null
        }
        Insert: {
          budget: string
          business_goal?: string | null
          communication_preference: string
          company?: string | null
          created_at?: string | null
          custom_budget?: string | null
          custom_communication?: string | null
          custom_timeline?: string | null
          description: string
          design_complexity?: string | null
          email: string
          file_description?: string | null
          file_urls?: string[] | null
          has_cms?: boolean | null
          has_ecommerce?: boolean | null
          has_files?: boolean | null
          has_maintenance?: boolean | null
          has_seo?: boolean | null
          id?: string
          name: string
          newsletter_consent?: boolean | null
          page_count?: number | null
          phone?: string | null
          price?: number | null
          project_name: string
          project_type: string
          specific_type?: string | null
          status?: string | null
          target_audience?: string | null
          timeline: string
          user_id?: string | null
        }
        Update: {
          budget?: string
          business_goal?: string | null
          communication_preference?: string
          company?: string | null
          created_at?: string | null
          custom_budget?: string | null
          custom_communication?: string | null
          custom_timeline?: string | null
          description?: string
          design_complexity?: string | null
          email?: string
          file_description?: string | null
          file_urls?: string[] | null
          has_cms?: boolean | null
          has_ecommerce?: boolean | null
          has_files?: boolean | null
          has_maintenance?: boolean | null
          has_seo?: boolean | null
          id?: string
          name?: string
          newsletter_consent?: boolean | null
          page_count?: number | null
          phone?: string | null
          price?: number | null
          project_name?: string
          project_type?: string
          specific_type?: string | null
          status?: string | null
          target_audience?: string | null
          timeline?: string
          user_id?: string | null
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          project_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          project_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          project_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          additional_info: string | null
          amount_paid: number | null
          created_at: string | null
          description: string | null
          design_complexity: string | null
          due_date: string | null
          example_urls: string[] | null
          has_cms: boolean | null
          has_ecommerce: boolean | null
          has_maintenance: boolean | null
          has_seo: boolean | null
          id: string
          page_count: number | null
          payment_status: string | null
          price: number | null
          status: string | null
          title: string
          type: string
          user_id: string | null
          website_type: string | null
        }
        Insert: {
          additional_info?: string | null
          amount_paid?: number | null
          created_at?: string | null
          description?: string | null
          design_complexity?: string | null
          due_date?: string | null
          example_urls?: string[] | null
          has_cms?: boolean | null
          has_ecommerce?: boolean | null
          has_maintenance?: boolean | null
          has_seo?: boolean | null
          id?: string
          page_count?: number | null
          payment_status?: string | null
          price?: number | null
          status?: string | null
          title: string
          type?: string
          user_id?: string | null
          website_type?: string | null
        }
        Update: {
          additional_info?: string | null
          amount_paid?: number | null
          created_at?: string | null
          description?: string | null
          design_complexity?: string | null
          due_date?: string | null
          example_urls?: string[] | null
          has_cms?: boolean | null
          has_ecommerce?: boolean | null
          has_maintenance?: boolean | null
          has_seo?: boolean | null
          id?: string
          page_count?: number | null
          payment_status?: string | null
          price?: number | null
          status?: string | null
          title?: string
          type?: string
          user_id?: string | null
          website_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_projects_with_cms: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_projects_with_ecommerce: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_projects_with_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_projects_with_seo: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      fetch_messages: {
        Args: {
          p_project_id: string
        }
        Returns: {
          id: string
          project_id: string
          user_id: string
          content: string
          is_admin: boolean
          created_at: string
          attachment_url: string
          attachment_type: string
        }[]
      }
      get_monthly_revenue: {
        Args: Record<PropertyKey, never>
        Returns: {
          month_year: string
          total_revenue: number
          total_collected: number
        }[]
      }
      get_payment_status_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          payment_status: string
          count: number
        }[]
      }
      get_project_request_status_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          count: number
        }[]
      }
      get_project_status_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          count: number
        }[]
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
