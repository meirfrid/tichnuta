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
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_type: string
          session_id: string
          user_email: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_type: string
          session_id: string
          user_email?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_type?: string
          session_id?: string
          user_email?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_free: boolean
          order_index: number
          presentation_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean
          order_index?: number
          presentation_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean
          order_index?: number
          presentation_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          active: boolean
          color: string
          created_at: string
          description: string
          duration: string
          features: string[]
          group_size: string
          icon: string
          id: string
          level: string
          price_number: number
          price_text: string
          school_id: string | null
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          color?: string
          created_at?: string
          description: string
          duration: string
          features?: string[]
          group_size: string
          icon?: string
          id?: string
          level: string
          price_number?: number
          price_text: string
          school_id?: string | null
          sort_order?: number
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string
          created_at?: string
          description?: string
          duration?: string
          features?: string[]
          group_size?: string
          icon?: string
          id?: string
          level?: string
          price_number?: number
          price_text?: string
          school_id?: string | null
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
          watch_time_seconds: number | null
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
          watch_time_seconds?: number | null
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          course: string
          created_at: string
          email: string
          grade: string | null
          id: string
          message: string | null
          name: string
          phone: string
          school_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          course: string
          created_at?: string
          email: string
          grade?: string | null
          id?: string
          message?: string | null
          name: string
          phone: string
          school_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          course?: string
          created_at?: string
          email?: string
          grade?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          school_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          active: boolean
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          amount_paid: number
          course_id: string
          currency: string
          expires_at: string | null
          id: string
          purchased_at: string
          status: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          course_id: string
          currency?: string
          expires_at?: string | null
          id?: string
          purchased_at?: string
          status?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          course_id?: string
          currency?: string
          expires_at?: string | null
          id?: string
          purchased_at?: string
          status?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_chat_sessions: {
        Args: { _user_id: string }
        Returns: {
          session_id: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
