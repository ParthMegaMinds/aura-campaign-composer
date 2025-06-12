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
      calendar_items: {
        Row: {
          assignee: string | null
          content_id: string | null
          created_at: string | null
          date: string
          graphic_id: string | null
          id: string
          platform: string
          social_media_details: Json | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          assignee?: string | null
          content_id?: string | null
          created_at?: string | null
          date: string
          graphic_id?: string | null
          id?: string
          platform: string
          social_media_details?: Json | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          assignee?: string | null
          content_id?: string | null
          created_at?: string | null
          date?: string
          graphic_id?: string | null
          id?: string
          platform?: string
          social_media_details?: Json | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_items_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_items_graphic_id_fkey"
            columns: ["graphic_id"]
            isOneToOne: false
            referencedRelation: "graphics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          calendar_items: string[] | null
          contents: string[] | null
          created_at: string | null
          description: string | null
          end_date: string
          graphics: string[] | null
          icp_id: string
          id: string
          start_date: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calendar_items?: string[] | null
          contents?: string[] | null
          created_at?: string | null
          description?: string | null
          end_date: string
          graphics?: string[] | null
          icp_id: string
          id?: string
          start_date: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calendar_items?: string[] | null
          contents?: string[] | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          graphics?: string[] | null
          icp_id?: string
          id?: string
          start_date?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_icp_id_fkey"
            columns: ["icp_id"]
            isOneToOne: false
            referencedRelation: "icps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          ai_generated: boolean | null
          content: string
          created_at: string | null
          icp_id: string
          id: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          content: string
          created_at?: string | null
          icp_id: string
          id?: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          content?: string
          created_at?: string | null
          icp_id?: string
          id?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_icp_id_fkey"
            columns: ["icp_id"]
            isOneToOne: false
            referencedRelation: "icps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      graphics: {
        Row: {
          content_id: string | null
          created_at: string | null
          format: string
          id: string
          image_url: string
          title: string
          user_id: string
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          format: string
          id?: string
          image_url: string
          title: string
          user_id: string
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          format?: string
          id?: string
          image_url?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "graphics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graphics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      icps: {
        Row: {
          business_size: string
          created_at: string | null
          designations: string[] | null
          id: string
          industry: string
          location: string
          name: string
          persona: string[]
          tech_stack: string[]
          tone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_size: string
          created_at?: string | null
          designations?: string[] | null
          id?: string
          industry: string
          location: string
          name: string
          persona?: string[]
          tech_stack?: string[]
          tone: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_size?: string
          created_at?: string | null
          designations?: string[] | null
          id?: string
          industry?: string
          location?: string
          name?: string
          persona?: string[]
          tech_stack?: string[]
          tone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "icps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
