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
      app_settings: {
        Row: {
          created_at: string
          featured_property_enabled: boolean | null
          id: string
          logo_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          featured_property_enabled?: boolean | null
          id?: string
          logo_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          featured_property_enabled?: boolean | null
          id?: string
          logo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_notifications: {
        Row: {
          created_at: string | null
          email_type: string
          id: string
          payload: Json
          processed_at: string | null
          recipient: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          recipient: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          recipient?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      footer_settings: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          enabled: boolean | null
          id: string
          logo_url: string | null
          phone: string | null
          subscribe_email: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          subscribe_email?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          subscribe_email?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          contact_message: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          inquiry_property_id: string | null
          inquiry_property_name: string | null
          last_contact: string | null
          phone: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          contact_message?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          inquiry_property_id?: string | null
          inquiry_property_name?: string | null
          last_contact?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          contact_message?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          inquiry_property_id?: string | null
          inquiry_property_name?: string | null
          last_contact?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_inquiry_property_id_fkey"
            columns: ["inquiry_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      news_posts: {
        Row: {
          content: string
          created_at: string
          feature_image_url: string | null
          id: string
          images: string[] | null
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          feature_image_url?: string | null
          id?: string
          images?: string[] | null
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          feature_image_url?: string | null
          id?: string
          images?: string[] | null
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          contact_message: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          inquiry_property_id: string | null
          inquiry_property_name: string | null
          last_contact: string | null
          phone: string | null
          tags: string[] | null
          ui_template: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          contact_message?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          inquiry_property_id?: string | null
          inquiry_property_name?: string | null
          last_contact?: string | null
          phone?: string | null
          tags?: string[] | null
          ui_template?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          contact_message?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          inquiry_property_id?: string | null
          inquiry_property_name?: string | null
          last_contact?: string | null
          phone?: string | null
          tags?: string[] | null
          ui_template?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_inquiry_property_id_fkey"
            columns: ["inquiry_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          area: number | null
          arv: number | null
          bathrooms: number
          bedrooms: number
          build_year: number
          created_at: string
          currency: string | null
          description: string | null
          enable_border_beam: boolean | null
          feature_image_position: string | null
          feature_image_url: string | null
          features: string[] | null
          google_maps_url: string | null
          heated_area: number | null
          height: number | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          mode: string | null
          name: string
          price: number
          price_per_sqm: number | null
          property_type: string | null
          reference_number: string | null
          status: string | null
          updated_at: string
          width: number | null
          youtube_autoplay: boolean | null
          youtube_controls: boolean | null
          youtube_muted: boolean | null
          youtube_url: string | null
        }
        Insert: {
          address: string
          area?: number | null
          arv?: number | null
          bathrooms: number
          bedrooms: number
          build_year: number
          created_at?: string
          currency?: string | null
          description?: string | null
          enable_border_beam?: boolean | null
          feature_image_position?: string | null
          feature_image_url?: string | null
          features?: string[] | null
          google_maps_url?: string | null
          heated_area?: number | null
          height?: number | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          mode?: string | null
          name: string
          price: number
          price_per_sqm?: number | null
          property_type?: string | null
          reference_number?: string | null
          status?: string | null
          updated_at?: string
          width?: number | null
          youtube_autoplay?: boolean | null
          youtube_controls?: boolean | null
          youtube_muted?: boolean | null
          youtube_url?: string | null
        }
        Update: {
          address?: string
          area?: number | null
          arv?: number | null
          bathrooms?: number
          bedrooms?: number
          build_year?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          enable_border_beam?: boolean | null
          feature_image_position?: string | null
          feature_image_url?: string | null
          features?: string[] | null
          google_maps_url?: string | null
          heated_area?: number | null
          height?: number | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          mode?: string | null
          name?: string
          price?: number
          price_per_sqm?: number | null
          property_type?: string | null
          reference_number?: string | null
          status?: string | null
          updated_at?: string
          width?: number | null
          youtube_autoplay?: boolean | null
          youtube_controls?: boolean | null
          youtube_muted?: boolean | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          en: Json
          es: Json
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          en?: Json
          es?: Json
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          en?: Json
          es?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_type: string | null
          id: string
          payload: Json | null
          source: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          id?: string
          payload?: Json | null
          source?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string | null
          id?: string
          payload?: Json | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      contacts_export: {
        Row: {
          contact_message: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          inquiry_property_name: string | null
          last_contact: string | null
          phone: string | null
          tags: string[] | null
          user_type: string | null
        }
        Relationships: []
      }
      leads_export: {
        Row: {
          contact_message: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          inquiry_property_name: string | null
          last_contact: string | null
          phone: string | null
          status: string | null
          tags: string[] | null
        }
        Insert: {
          contact_message?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          inquiry_property_name?: string | null
          last_contact?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
        }
        Update: {
          contact_message?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          inquiry_property_name?: string | null
          last_contact?: string | null
          phone?: string | null
          status?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
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
