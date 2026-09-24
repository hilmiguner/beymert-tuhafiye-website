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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          cover_media_id: string | null
          created_at: string
          description: string
          id: string
          name: string
          published_at: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["cms_content_status"]
          updated_at: string
        }
        Insert: {
          cover_media_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name: string
          published_at?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["cms_content_status"]
          updated_at?: string
        }
        Update: {
          cover_media_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          published_at?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["cms_content_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_admins: {
        Row: {
          created_at: string
          display_name: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      concept_media: {
        Row: {
          concept_id: string
          is_cover: boolean
          media_id: string
          sort_order: number
        }
        Insert: {
          concept_id: string
          is_cover?: boolean
          media_id: string
          sort_order?: number
        }
        Update: {
          concept_id?: string
          is_cover?: boolean
          media_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "concept_media_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concept_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      concepts: {
        Row: {
          cover_media_id: string | null
          created_at: string
          description: string
          description_rich: Json | null
          id: string
          name: string
          published_at: string | null
          short_description: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["cms_content_status"]
          updated_at: string
        }
        Insert: {
          cover_media_id?: string | null
          created_at?: string
          description?: string
          description_rich?: Json | null
          id?: string
          name: string
          published_at?: string | null
          short_description?: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["cms_content_status"]
          updated_at?: string
        }
        Update: {
          cover_media_id?: string | null
          created_at?: string
          description?: string
          description_rich?: Json | null
          id?: string
          name?: string
          published_at?: string | null
          short_description?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["cms_content_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concepts_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          category_id: string | null
          concept_id: string | null
          created_at: string
          description: string
          id: string
          media_id: string
          published_at: string | null
          sort_order: number
          status: Database["public"]["Enums"]["cms_content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          concept_id?: string | null
          created_at?: string
          description?: string
          id?: string
          media_id: string
          published_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["cms_content_status"]
          title?: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          concept_id?: string | null
          created_at?: string
          description?: string
          id?: string
          media_id?: string
          published_at?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["cms_content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string
          created_at: string
          created_by: string | null
          height: number | null
          id: string
          mime_type: string | null
          storage_path: string
          width: number | null
        }
        Insert: {
          alt_text: string
          created_at?: string
          created_by?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          storage_path: string
          width?: number | null
        }
        Update: {
          alt_text?: string
          created_at?: string
          created_by?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          storage_path?: string
          width?: number | null
        }
        Relationships: []
      }
      product_concepts: {
        Row: {
          concept_id: string
          product_id: string
        }
        Insert: {
          concept_id: string
          product_id: string
        }
        Update: {
          concept_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_concepts_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_concepts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          is_cover: boolean
          media_id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          is_cover?: boolean
          media_id: string
          product_id: string
          sort_order?: number
        }
        Update: {
          is_cover?: boolean
          media_id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          colors: string[]
          created_at: string
          description: string
          description_rich: Json | null
          dimensions: string | null
          featured: boolean
          id: string
          name: string
          new_arrival: boolean
          published_at: string | null
          short_description: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["cms_content_status"]
          updated_at: string
          whatsapp_message: string | null
        }
        Insert: {
          category_id?: string | null
          colors?: string[]
          created_at?: string
          description?: string
          description_rich?: Json | null
          dimensions?: string | null
          featured?: boolean
          id?: string
          name: string
          new_arrival?: boolean
          published_at?: string | null
          short_description?: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["cms_content_status"]
          updated_at?: string
          whatsapp_message?: string | null
        }
        Update: {
          category_id?: string | null
          colors?: string[]
          created_at?: string
          description?: string
          description_rich?: Json | null
          dimensions?: string | null
          featured?: boolean
          id?: string
          name?: string
          new_arrival?: boolean
          published_at?: string | null
          short_description?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["cms_content_status"]
          updated_at?: string
          whatsapp_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          address: string | null
          id: number
          map_query: string | null
          opening_hours: Json
          phone: string | null
          social_links: Json
          updated_at: string
          updated_by: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          id?: number
          map_query?: string | null
          opening_hours?: Json
          phone?: string | null
          social_links?: Json
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          id?: number
          map_query?: string | null
          opening_hours?: Json
          phone?: string | null
          social_links?: Json
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_product_cover: {
        Args: { p_media_id: string; p_product_id: string }
        Returns: undefined
      }
    }
    Enums: {
      cms_content_status: "draft" | "published" | "archived"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      cms_content_status: ["draft", "published", "archived"],
    },
  },
} as const
