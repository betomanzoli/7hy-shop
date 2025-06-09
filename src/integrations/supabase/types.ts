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
      affiliate_clicks: {
        Row: {
          clicked_at: string
          created_at: string
          id: string
          marketplace_id: string
          product_id: string
          referrer: string | null
          user_id: string | null
        }
        Insert: {
          clicked_at: string
          created_at?: string
          id?: string
          marketplace_id: string
          product_id: string
          referrer?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_at?: string
          created_at?: string
          id?: string
          marketplace_id?: string
          product_id?: string
          referrer?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_credentials: {
        Row: {
          credentials: Json
          id: string
          last_updated: string
          marketplace_id: string
        }
        Insert: {
          credentials: Json
          id?: string
          last_updated?: string
          marketplace_id: string
        }
        Update: {
          credentials?: Json
          id?: string
          last_updated?: string
          marketplace_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channels: Database["public"]["Enums"]["notification_channel"][] | null
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          sent_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          sent_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          sent_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      price_alerts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          notification_sent: boolean | null
          product_id: string
          target_price: number
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_sent?: boolean | null
          product_id: string
          target_price: number
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_sent?: boolean | null
          product_id?: string
          target_price?: number
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "price_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          currency: string | null
          id: string
          is_promotion: boolean | null
          original_price: number | null
          price: number
          product_id: string
          promotion_details: Json | null
          recorded_at: string | null
          source: string | null
        }
        Insert: {
          currency?: string | null
          id?: string
          is_promotion?: boolean | null
          original_price?: number | null
          price: number
          product_id: string
          promotion_details?: Json | null
          recorded_at?: string | null
          source?: string | null
        }
        Update: {
          currency?: string | null
          id?: string
          is_promotion?: boolean | null
          original_price?: number | null
          price?: number
          product_id?: string
          promotion_details?: Json | null
          recorded_at?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      product_comparisons: {
        Row: {
          comparison_data: Json | null
          created_at: string | null
          id: string
          is_public: boolean | null
          name: string
          products: Json
          share_token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comparison_data?: Json | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          products: Json
          share_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comparison_data?: Json | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          products?: Json
          share_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_comparisons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_comparisons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          author_name: string | null
          content: string | null
          created_at: string | null
          helpful_votes: number | null
          id: string
          language: string | null
          marketplace: Database["public"]["Enums"]["marketplace_type"]
          product_id: string
          rating: number
          review_date: string | null
          review_id: string | null
          sentiment_label: string | null
          sentiment_score: number | null
          title: string | null
          updated_at: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          author_name?: string | null
          content?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          language?: string | null
          marketplace: Database["public"]["Enums"]["marketplace_type"]
          product_id: string
          rating: number
          review_date?: string | null
          review_id?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          title?: string | null
          updated_at?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          author_name?: string | null
          content?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          language?: string | null
          marketplace?: Database["public"]["Enums"]["marketplace_type"]
          product_id?: string
          rating?: number
          review_date?: string | null
          review_id?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          title?: string | null
          updated_at?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: Json | null
          affiliate_url: string
          category_id: string | null
          click_count: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          dimensions: Json | null
          features: Json | null
          id: string
          image_url: string | null
          is_deal: boolean | null
          is_featured: boolean | null
          is_in_stock: boolean | null
          is_prime: boolean | null
          last_price_check: string | null
          marketplace: Database["public"]["Enums"]["marketplace_type"]
          marketplace_id: string
          meta_description: string | null
          meta_title: string | null
          original_price: number | null
          original_url: string
          price: number
          rating: number | null
          review_count: number | null
          sales_count: number | null
          scraped_at: string | null
          search_vector: unknown | null
          seller_name: string | null
          seller_rating: number | null
          shipping_info: Json | null
          short_description: string | null
          specifications: Json | null
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number | null
          tags: Json | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          additional_images?: Json | null
          affiliate_url: string
          category_id?: string | null
          click_count?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          dimensions?: Json | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_deal?: boolean | null
          is_featured?: boolean | null
          is_in_stock?: boolean | null
          is_prime?: boolean | null
          last_price_check?: string | null
          marketplace: Database["public"]["Enums"]["marketplace_type"]
          marketplace_id: string
          meta_description?: string | null
          meta_title?: string | null
          original_price?: number | null
          original_url: string
          price: number
          rating?: number | null
          review_count?: number | null
          sales_count?: number | null
          scraped_at?: string | null
          search_vector?: unknown | null
          seller_name?: string | null
          seller_rating?: number | null
          shipping_info?: Json | null
          short_description?: string | null
          specifications?: Json | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          additional_images?: Json | null
          affiliate_url?: string
          category_id?: string | null
          click_count?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          dimensions?: Json | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_deal?: boolean | null
          is_featured?: boolean | null
          is_in_stock?: boolean | null
          is_prime?: boolean | null
          last_price_check?: string | null
          marketplace?: Database["public"]["Enums"]["marketplace_type"]
          marketplace_id?: string
          meta_description?: string | null
          meta_title?: string | null
          original_price?: number | null
          original_url?: string
          price?: number
          rating?: number | null
          review_count?: number | null
          sales_count?: number | null
          scraped_at?: string | null
          search_vector?: unknown | null
          seller_name?: string | null
          seller_rating?: number | null
          shipping_info?: Json | null
          short_description?: string | null
          specifications?: Json | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_jobs: {
        Row: {
          attempts: number | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          error_message: string | null
          id: string
          marketplace: Database["public"]["Enums"]["marketplace_type"]
          max_attempts: number | null
          next_retry_at: string | null
          priority: number | null
          result_data: Json | null
          started_at: string | null
          status: Database["public"]["Enums"]["scraping_status"] | null
          url: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          marketplace: Database["public"]["Enums"]["marketplace_type"]
          max_attempts?: number | null
          next_retry_at?: string | null
          priority?: number | null
          result_data?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["scraping_status"] | null
          url: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          marketplace?: Database["public"]["Enums"]["marketplace_type"]
          max_attempts?: number | null
          next_retry_at?: string | null
          priority?: number | null
          result_data?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["scraping_status"] | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "scraping_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "scraping_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          product_id: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          last_login: string | null
          notification_preferences: Json | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          last_login?: string | null
          notification_preferences?: Json | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_login?: string | null
          notification_preferences?: Json | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          added_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          priority: number | null
          product_id: string
          target_price: number | null
          wishlist_id: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          product_id: string
          target_price?: number | null
          wishlist_id: string
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          product_id?: string
          target_price?: number | null
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "wishlist_items_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_collaborative: boolean | null
          is_public: boolean | null
          name: string
          share_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_collaborative?: boolean | null
          is_public?: boolean | null
          name?: string
          share_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_collaborative?: boolean | null
          is_public?: boolean | null
          name?: string
          share_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      products_with_stats: {
        Row: {
          additional_images: Json | null
          affiliate_url: string | null
          avg_rating: number | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          click_count: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          dimensions: Json | null
          features: Json | null
          highest_price: number | null
          id: string | null
          image_url: string | null
          is_deal: boolean | null
          is_featured: boolean | null
          is_in_stock: boolean | null
          is_prime: boolean | null
          last_price_check: string | null
          lowest_price: number | null
          marketplace: Database["public"]["Enums"]["marketplace_type"] | null
          marketplace_id: string | null
          meta_description: string | null
          meta_title: string | null
          original_price: number | null
          original_url: string | null
          price: number | null
          price_trend: string | null
          rating: number | null
          review_count: number | null
          sales_count: number | null
          scraped_at: string | null
          search_vector: unknown | null
          seller_name: string | null
          seller_rating: number | null
          shipping_info: Json | null
          short_description: string | null
          specifications: Json | null
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number | null
          tags: Json | null
          title: string | null
          total_reviews: number | null
          updated_at: string | null
          view_count: number | null
          wishlist_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dashboard_stats: {
        Row: {
          active_price_alerts: number | null
          clicks_last_month: number | null
          full_name: string | null
          total_savings: number | null
          total_wishlist_items: number | null
          total_wishlists: number | null
          unread_notifications: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_product_recommendations: {
        Args: {
          user_id_param: string
          product_id_param?: string
          limit_count?: number
        }
        Returns: {
          id: string
          title: string
          price: number
          image_url: string
          rating: number
          marketplace: Database["public"]["Enums"]["marketplace_type"]
          relevance_score: number
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      search_products: {
        Args: {
          search_term?: string
          category_filter?: string
          marketplace_filter?: Database["public"]["Enums"]["marketplace_type"]
          min_price?: number
          max_price?: number
          min_rating?: number
          sort_by?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          price: number
          original_price: number
          image_url: string
          rating: number
          marketplace: Database["public"]["Enums"]["marketplace_type"]
          category_name: string
          is_featured: boolean
          rank: number
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      marketplace_type: "amazon" | "shopee" | "mercadolivre"
      notification_channel: "email" | "push" | "sms" | "whatsapp"
      notification_type:
        | "price_drop"
        | "back_in_stock"
        | "promotion"
        | "new_product"
        | "wishlist"
      product_status: "active" | "inactive" | "out_of_stock" | "discontinued"
      scraping_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "retry"
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
    Enums: {
      marketplace_type: ["amazon", "shopee", "mercadolivre"],
      notification_channel: ["email", "push", "sms", "whatsapp"],
      notification_type: [
        "price_drop",
        "back_in_stock",
        "promotion",
        "new_product",
        "wishlist",
      ],
      product_status: ["active", "inactive", "out_of_stock", "discontinued"],
      scraping_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "retry",
      ],
    },
  },
} as const
