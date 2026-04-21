export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          parent_id: string | null
          type: 'perfume' | 'clothing' | 'bags'
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          parent_id?: string | null
          type: 'perfume' | 'clothing' | 'bags'
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          slug?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          type?: 'perfume' | 'clothing' | 'bags'
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          brand: string
          category_id: string
          base_price: number
          currency: string
          is_published: boolean
          featured: boolean
          search_vector: unknown | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          brand: string
          category_id: string
          base_price: number
          currency?: string
          is_published?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          name?: string
          description?: string | null
          brand?: string
          category_id?: string
          base_price?: number
          currency?: string
          is_published?: boolean
          featured?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          size: string | null
          color: string | null
          price_override: number | null
          stock_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku: string
          size?: string | null
          color?: string | null
          price_override?: number | null
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          sku?: string
          size?: string | null
          color?: string | null
          price_override?: number | null
          stock_quantity?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      product_media: {
        Row: {
          id: string
          product_id: string
          url: string
          type: 'image' | 'video'
          sort_order: number
          alt_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          type: 'image' | 'video'
          sort_order?: number
          alt_text?: string | null
          created_at?: string
        }
        Update: {
          url?: string
          type?: 'image' | 'video'
          sort_order?: number
          alt_text?: string | null
        }
        Relationships: []
      }
      product_attributes: {
        Row: {
          id: string
          product_id: string
          key: string
          value: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          key: string
          value: string
          created_at?: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string | null
          session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          variant_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          variant_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cart_items_cart_id_fkey'
            columns: ['cart_id']
            isOneToOne: false
            referencedRelation: 'carts'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status:
            | 'pending'
            | 'paid'
            | 'fulfilled'
            | 'shipped'
            | 'delivered'
            | 'cancelled'
            | 'refunded'
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          subtotal: number
          shipping: number
          tax: number
          total: number
          currency: string
          shipping_address: Json | null
          billing_address: Json | null
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?:
            | 'pending'
            | 'paid'
            | 'fulfilled'
            | 'shipped'
            | 'delivered'
            | 'cancelled'
            | 'refunded'
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal: number
          shipping?: number
          tax?: number
          total: number
          currency?: string
          shipping_address?: Json | null
          billing_address?: Json | null
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?:
            | 'pending'
            | 'paid'
            | 'fulfilled'
            | 'shipped'
            | 'delivered'
            | 'cancelled'
            | 'refunded'
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string
          product_name: string
          variant_sku: string
          variant_size: string | null
          variant_color: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id: string
          product_name: string
          variant_sku: string
          variant_size?: string | null
          variant_color?: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          [key: string]: never
        }
        Relationships: []
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string | null
          full_name: string
          line1: string
          line2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label?: string | null
          full_name: string
          line1: string
          line2?: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          label?: string | null
          full_name?: string
          line1?: string
          line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string | null
          is_default?: boolean
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          [key: string]: never
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          before_data: Json | null
          after_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          before_data?: Json | null
          after_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          [key: string]: never
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      search_products: {
        Args: {
          query: string
          category_filter: string | null
          min_price: number | null
          max_price: number | null
        }
        Returns: {
          id: string
          slug: string
          name: string
          brand: string
          base_price: number
          category_id: string
          rank: number
        }[]
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'customer' | 'admin'
      category_type: 'perfume' | 'clothing' | 'bags'
      media_type: 'image' | 'video'
      order_status:
        | 'pending'
        | 'paid'
        | 'fulfilled'
        | 'shipped'
        | 'delivered'
        | 'cancelled'
        | 'refunded'
    }
    CompositeTypes: Record<string, never>
  }
}
