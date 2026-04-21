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
      activity_log: {
        Row: {
          event_type: string
          id: string
          text: string
          timestamp: string
          user_id: string
        }
        Insert: {
          event_type: string
          id?: string
          text: string
          timestamp?: string
          user_id: string
        }
        Update: {
          event_type?: string
          id?: string
          text?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      campaign_tasks: {
        Row: {
          admin_note: string | null
          approved_at: string | null
          assigned_at: string | null
          campaign_id: string
          created_at: string
          id: string
          proof_data: Json | null
          proof_url: string | null
          reward_amount: number
          status: Database["public"]["Enums"]["task_status"]
          submitted_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          approved_at?: string | null
          assigned_at?: string | null
          campaign_id: string
          created_at?: string
          id?: string
          proof_data?: Json | null
          proof_url?: string | null
          reward_amount: number
          status?: Database["public"]["Enums"]["task_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          approved_at?: string | null
          assigned_at?: string | null
          campaign_id?: string
          created_at?: string
          id?: string
          proof_data?: Json | null
          proof_url?: string | null
          reward_amount?: number
          status?: Database["public"]["Enums"]["task_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_tasks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          campaign_type: Database["public"]["Enums"]["campaign_type"]
          client_id: string
          completed_tasks: number
          created_at: string
          description: string
          end_date: string | null
          id: string
          max_tasks: number
          proof_requirements: string | null
          proof_type: Database["public"]["Enums"]["proof_type"]
          reward_per_task: number
          spent_budget: number
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          target_age_max: number | null
          target_age_min: number | null
          target_cities: string[] | null
          target_countries: string[] | null
          target_interests: string[] | null
          target_platform: Database["public"]["Enums"]["social_platform"]
          target_url: string | null
          title: string
          total_budget: number
          updated_at: string
        }
        Insert: {
          campaign_type: Database["public"]["Enums"]["campaign_type"]
          client_id: string
          completed_tasks?: number
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          max_tasks: number
          proof_requirements?: string | null
          proof_type?: Database["public"]["Enums"]["proof_type"]
          reward_per_task: number
          spent_budget?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_age_max?: number | null
          target_age_min?: number | null
          target_cities?: string[] | null
          target_countries?: string[] | null
          target_interests?: string[] | null
          target_platform: Database["public"]["Enums"]["social_platform"]
          target_url?: string | null
          title: string
          total_budget: number
          updated_at?: string
        }
        Update: {
          campaign_type?: Database["public"]["Enums"]["campaign_type"]
          client_id?: string
          completed_tasks?: number
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          max_tasks?: number
          proof_requirements?: string | null
          proof_type?: Database["public"]["Enums"]["proof_type"]
          reward_per_task?: number
          spent_budget?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_age_max?: number | null
          target_age_min?: number | null
          target_cities?: string[] | null
          target_countries?: string[] | null
          target_interests?: string[] | null
          target_platform?: Database["public"]["Enums"]["social_platform"]
          target_url?: string | null
          title?: string
          total_budget?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_connections: {
        Row: {
          accepted_at: string | null
          created_at: string
          declined_at: string | null
          id: string
          status: string
          user_a: string
          user_b: string
          withdrawn_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          declined_at?: string | null
          id?: string
          status?: string
          user_a: string
          user_b: string
          withdrawn_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          declined_at?: string | null
          id?: string
          status?: string
          user_a?: string
          user_b?: string
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          connection_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          connection_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          connection_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "chat_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      classified_ads: {
        Row: {
          description: string
          expires_at: string | null
          id: string
          image_url: string | null
          paid: boolean
          posted_at: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          description: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          paid?: boolean
          posted_at?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          description?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          paid?: boolean
          posted_at?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          business_email: string
          business_phone: string | null
          city: string | null
          company_description: string | null
          company_name: string
          company_website: string | null
          country: string | null
          created_at: string
          id: string
          industry: string | null
          total_spent: number
          updated_at: string
          user_id: string
          verification_status: string
          wallet_balance: number
        }
        Insert: {
          business_email: string
          business_phone?: string | null
          city?: string | null
          company_description?: string | null
          company_name: string
          company_website?: string | null
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          total_spent?: number
          updated_at?: string
          user_id: string
          verification_status?: string
          wallet_balance?: number
        }
        Update: {
          business_email?: string
          business_phone?: string | null
          city?: string | null
          company_description?: string | null
          company_name?: string
          company_website?: string | null
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          total_spent?: number
          updated_at?: string
          user_id?: string
          verification_status?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      comment_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_replies_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      community_topics: {
        Row: {
          author: string
          created_at: string | null
          id: string
          replies: number
          title: string
          trending: boolean
          url: string | null
        }
        Insert: {
          author: string
          created_at?: string | null
          id?: string
          replies?: number
          title: string
          trending?: boolean
          url?: string | null
        }
        Update: {
          author?: string
          created_at?: string | null
          id?: string
          replies?: number
          title?: string
          trending?: boolean
          url?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          ceo_name: string | null
          city: string | null
          company_type: string | null
          company_video_url: string | null
          country: string | null
          created_at: string
          creator_user_id: string | null
          description: string | null
          employee_count: number | null
          facebook_url: string | null
          founded_year: number | null
          headquarters: string | null
          id: string
          industry: string | null
          instagram_url: string | null
          is_verified: boolean | null
          linkedin_url: string | null
          logo_url: string | null
          name: string
          phone: string | null
          products_services: string | null
          rating: number | null
          state: string | null
          total_reviews: number | null
          twitter_url: string | null
          updated_at: string
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          ceo_name?: string | null
          city?: string | null
          company_type?: string | null
          company_video_url?: string | null
          country?: string | null
          created_at?: string
          creator_user_id?: string | null
          description?: string | null
          employee_count?: number | null
          facebook_url?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          instagram_url?: string | null
          is_verified?: boolean | null
          linkedin_url?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          products_services?: string | null
          rating?: number | null
          state?: string | null
          total_reviews?: number | null
          twitter_url?: string | null
          updated_at?: string
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          ceo_name?: string | null
          city?: string | null
          company_type?: string | null
          company_video_url?: string | null
          country?: string | null
          created_at?: string
          creator_user_id?: string | null
          description?: string | null
          employee_count?: number | null
          facebook_url?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          instagram_url?: string | null
          is_verified?: boolean | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          products_services?: string | null
          rating?: number | null
          state?: string | null
          total_reviews?: number | null
          twitter_url?: string | null
          updated_at?: string
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      company_followers: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_followers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_team_members: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          join_date: string | null
          performance_rank: number | null
          position: string | null
          profile_id: string
          total_sales: number | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          join_date?: string | null
          performance_rank?: number | null
          position?: string | null
          profile_id: string
          total_sales?: number | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          join_date?: string | null
          performance_rank?: number | null
          position?: string | null
          profile_id?: string
          total_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          receiver_id: string
          responded_at: string | null
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id: string
          responded_at?: string | null
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string
          responded_at?: string | null
          sender_id?: string
          status?: string
        }
        Relationships: []
      }
      discovery_calls: {
        Row: {
          created_at: string | null
          date: string
          host: string
          id: string
          spots: string
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          host: string
          id?: string
          spots: string
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          host?: string
          id?: string
          spots?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          attending_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          attending_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          attending_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_comments: {
        Row: {
          content: string
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date: string
          end_time: string | null
          id: string
          is_paid: boolean
          location_type: string
          start_time: string | null
          state: string | null
          title: string
          type: string
          url: string | null
          webinar_url: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date: string
          end_time?: string | null
          id?: string
          is_paid?: boolean
          location_type?: string
          start_time?: string | null
          state?: string | null
          title: string
          type: string
          url?: string | null
          webinar_url?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date?: string
          end_time?: string | null
          id?: string
          is_paid?: boolean
          location_type?: string
          start_time?: string | null
          state?: string | null
          title?: string
          type?: string
          url?: string | null
          webinar_url?: string | null
        }
        Relationships: []
      }
      monthly_contest_companies: {
        Row: {
          application_notes: string | null
          company_id: string
          contest_month: string
          created_at: string
          id: string
          is_candidate: boolean
          is_winner: boolean
          updated_at: string
        }
        Insert: {
          application_notes?: string | null
          company_id: string
          contest_month: string
          created_at?: string
          id?: string
          is_candidate?: boolean
          is_winner?: boolean
          updated_at?: string
        }
        Update: {
          application_notes?: string | null
          company_id?: string
          contest_month?: string
          created_at?: string
          id?: string
          is_candidate?: boolean
          is_winner?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_contest_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_contest_company_votes: {
        Row: {
          contest_company_id: string
          id: string
          user_id: string
          voted_at: string
        }
        Insert: {
          contest_company_id: string
          id?: string
          user_id: string
          voted_at?: string
        }
        Update: {
          contest_company_id?: string
          id?: string
          user_id?: string
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_contest_company_votes_contest_company_id_fkey"
            columns: ["contest_company_id"]
            isOneToOne: false
            referencedRelation: "monthly_contest_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_contest_networker_votes: {
        Row: {
          contest_networker_id: string
          id: string
          user_id: string
          voted_at: string
        }
        Insert: {
          contest_networker_id: string
          id?: string
          user_id: string
          voted_at?: string
        }
        Update: {
          contest_networker_id?: string
          id?: string
          user_id?: string
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_contest_networker_votes_contest_networker_id_fkey"
            columns: ["contest_networker_id"]
            isOneToOne: false
            referencedRelation: "monthly_contest_networkers"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_contest_networkers: {
        Row: {
          application_notes: string | null
          contest_month: string
          created_at: string
          id: string
          is_candidate: boolean
          is_winner: boolean
          profile_id: string
          updated_at: string
        }
        Insert: {
          application_notes?: string | null
          contest_month: string
          created_at?: string
          id?: string
          is_candidate?: boolean
          is_winner?: boolean
          profile_id: string
          updated_at?: string
        }
        Update: {
          application_notes?: string | null
          contest_month?: string
          created_at?: string
          id?: string
          is_candidate?: boolean
          is_winner?: boolean
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_contest_networkers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Net: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          created_at: string | null
          date: string
          headline: string
          id: string
          image_url: string | null
          keywords: string[] | null
          slug: string | null
          tags: string[] | null
          url: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          date: string
          headline: string
          id?: string
          image_url?: string | null
          keywords?: string[] | null
          slug?: string | null
          tags?: string[] | null
          url?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          date?: string
          headline?: string
          id?: string
          image_url?: string | null
          keywords?: string[] | null
          slug?: string | null
          tags?: string[] | null
          url?: string | null
        }
        Relationships: []
      }
      onboarding_tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          points: number
          type: string
          updated_at: string
          verification_type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          points?: number
          type?: string
          updated_at?: string
          verification_type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          points?: number
          type?: string
          updated_at?: string
          verification_type?: string | null
        }
        Relationships: []
      }
      points_ledger: {
        Row: {
          amount: number
          created_at: string
          event_code: string
          event_metadata: Json | null
          id: string
          note: string | null
          related_user_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          event_code: string
          event_metadata?: Json | null
          id?: string
          note?: string | null
          related_user_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          event_code?: string
          event_metadata?: Json | null
          id?: string
          note?: string | null
          related_user_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          likes: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes?: number
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes?: number
          user_id?: string
        }
        Relationships: []
      }
      profile_companies: {
        Row: {
          association_type: string
          company_id: string
          ended_year: number | null
          id: string
          profile_id: string
          started_year: number | null
        }
        Insert: {
          association_type: string
          company_id: string
          ended_year?: number | null
          id?: string
          profile_id: string
          started_year?: number | null
        }
        Update: {
          association_type?: string
          company_id?: string
          ended_year?: number | null
          id?: string
          profile_id?: string
          started_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_companies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_details: {
        Row: {
          availability: string | null
          badge: string | null
          collab_interests: string[] | null
          company: string | null
          current_role: string | null
          full_name: string | null
          how_found: string | null
          id: string
          industry: string | null
          linkedin: string | null
          looking_for: string[] | null
          profile_id: string
          referral_code: string | null
          social_links: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          availability?: string | null
          badge?: string | null
          collab_interests?: string[] | null
          company?: string | null
          current_role?: string | null
          full_name?: string | null
          how_found?: string | null
          id?: string
          industry?: string | null
          linkedin?: string | null
          looking_for?: string[] | null
          profile_id: string
          referral_code?: string | null
          social_links?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          availability?: string | null
          badge?: string | null
          collab_interests?: string[] | null
          company?: string | null
          current_role?: string | null
          full_name?: string | null
          how_found?: string | null
          id?: string
          industry?: string | null
          linkedin?: string | null
          looking_for?: string[] | null
          profile_id?: string
          referral_code?: string | null
          social_links?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_experience: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          employment_type: string | null
          end_date: string | null
          id: string
          location: string | null
          profile_id: string
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          profile_id: string
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          profile_id?: string
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_experience_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_gallery: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          profile_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          profile_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_gallery_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "profile_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_post_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "profile_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_post_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          profile_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          profile_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          achievements: string | null
          availability_status: string | null
          bio: string | null
          city: string | null
          connection_count: number | null
          country: string | null
          cover_image_url: string | null
          created_at: string
          current_company: string | null
          current_position: string | null
          date_of_birth: string | null
          display_name: string
          email: string | null
          facebook_url: string | null
          follower_count: number | null
          following_count: number | null
          id: string
          instagram_url: string | null
          is_verified: boolean
          key_skills: string | null
          kyc_status: string
          languages: string | null
          last_active_at: string | null
          linkedin_url: string | null
          networker_type: string
          phone: string | null
          points: number
          profile_image_url: string | null
          profile_views: number | null
          rank: string | null
          referral_user_id: string
          referrals_this_month: number | null
          specialization: string | null
          streak: number | null
          streak_popup_shown: boolean | null
          team_level1: number | null
          team_level2: number | null
          team_level3: number | null
          team_size: number | null
          tiktok_url: string | null
          time_zone: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          wallet_balance: number | null
          website_url: string | null
          withdrawal_details: Json | null
          withdrawal_method: string | null
          xp_level: number | null
          xp_required: number | null
          years_experience: number | null
          youtube_url: string | null
        }
        Insert: {
          achievements?: string | null
          availability_status?: string | null
          bio?: string | null
          city?: string | null
          connection_count?: number | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          date_of_birth?: string | null
          display_name: string
          email?: string | null
          facebook_url?: string | null
          follower_count?: number | null
          following_count?: number | null
          id?: string
          instagram_url?: string | null
          is_verified?: boolean
          key_skills?: string | null
          kyc_status?: string
          languages?: string | null
          last_active_at?: string | null
          linkedin_url?: string | null
          networker_type?: string
          phone?: string | null
          points?: number
          profile_image_url?: string | null
          profile_views?: number | null
          rank?: string | null
          referral_user_id: string
          referrals_this_month?: number | null
          specialization?: string | null
          streak?: number | null
          streak_popup_shown?: boolean | null
          team_level1?: number | null
          team_level2?: number | null
          team_level3?: number | null
          team_size?: number | null
          tiktok_url?: string | null
          time_zone?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          wallet_balance?: number | null
          website_url?: string | null
          withdrawal_details?: Json | null
          withdrawal_method?: string | null
          xp_level?: number | null
          xp_required?: number | null
          years_experience?: number | null
          youtube_url?: string | null
        }
        Update: {
          achievements?: string | null
          availability_status?: string | null
          bio?: string | null
          city?: string | null
          connection_count?: number | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          date_of_birth?: string | null
          display_name?: string
          email?: string | null
          facebook_url?: string | null
          follower_count?: number | null
          following_count?: number | null
          id?: string
          instagram_url?: string | null
          is_verified?: boolean
          key_skills?: string | null
          kyc_status?: string
          languages?: string | null
          last_active_at?: string | null
          linkedin_url?: string | null
          networker_type?: string
          phone?: string | null
          points?: number
          profile_image_url?: string | null
          profile_views?: number | null
          rank?: string | null
          referral_user_id?: string
          referrals_this_month?: number | null
          specialization?: string | null
          streak?: number | null
          streak_popup_shown?: boolean | null
          team_level1?: number | null
          team_level2?: number | null
          team_level3?: number | null
          team_size?: number | null
          tiktok_url?: string | null
          time_zone?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          wallet_balance?: number | null
          website_url?: string | null
          withdrawal_details?: Json | null
          withdrawal_method?: string | null
          xp_level?: number | null
          xp_required?: number | null
          years_experience?: number | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          company_id: string
          created_at: string
          id: string
          rating: number
          review: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          rating: number
          review: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          rating?: number
          review?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      scam_alert_votes: {
        Row: {
          created_at: string
          id: string
          scam_alert_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          scam_alert_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          scam_alert_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "scam_alert_votes_scam_alert_id_fkey"
            columns: ["scam_alert_id"]
            isOneToOne: false
            referencedRelation: "scam_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      scam_alerts: {
        Row: {
          blacklisted: boolean
          company: string
          created_at: string | null
          id: string
          issue: string
          proof: string | null
          status: string
        }
        Insert: {
          blacklisted?: boolean
          company: string
          created_at?: string | null
          id?: string
          issue: string
          proof?: string | null
          status: string
        }
        Update: {
          blacklisted?: boolean
          company?: string
          created_at?: string | null
          id?: string
          issue?: string
          proof?: string | null
          status?: string
        }
        Relationships: []
      }
      service_pricing: {
        Row: {
          display_label: string
          id: string
          is_active: boolean
          notes: string | null
          point_cost: number
          service_name: string
          updated_at: string
        }
        Insert: {
          display_label: string
          id?: string
          is_active?: boolean
          notes?: string | null
          point_cost: number
          service_name: string
          updated_at?: string
        }
        Update: {
          display_label?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          point_cost?: number
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          created_at: string
          follower_count: number | null
          id: string
          last_updated: string
          platform: Database["public"]["Enums"]["social_platform"]
          profile_url: string
          user_id: string
          username: string
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          follower_count?: number | null
          id?: string
          last_updated?: string
          platform: Database["public"]["Enums"]["social_platform"]
          profile_url: string
          user_id: string
          username: string
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          follower_count?: number | null
          id?: string
          last_updated?: string
          platform?: Database["public"]["Enums"]["social_platform"]
          profile_url?: string
          user_id?: string
          username?: string
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      task_event_logs: {
        Row: {
          created_at: string
          event_by: string | null
          event_note: string | null
          event_type: string
          id: string
          task_id: string
          task_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_by?: string | null
          event_note?: string | null
          event_type: string
          id?: string
          task_id: string
          task_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_by?: string | null
          event_note?: string | null
          event_type?: string
          id?: string
          task_id?: string
          task_type?: string
          user_id?: string
        }
        Relationships: []
      }
      task_submissions: {
        Row: {
          admin_note: string | null
          created_at: string
          id: string
          reviewed_at: string | null
          screenshot_url: string
          status: string
          task_id: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          id?: string
          reviewed_at?: string | null
          screenshot_url: string
          status?: string
          task_id: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          id?: string
          reviewed_at?: string | null
          screenshot_url?: string
          status?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          is_active: boolean
          payout_points: number
          proof_type: string
          title: string
          type: string
          url: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: string
          is_active?: boolean
          payout_points: number
          proof_type?: string
          title: string
          type: string
          url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          is_active?: boolean
          payout_points?: number
          proof_type?: string
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          campaign_id: string | null
          client_id: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          reference_id: string | null
          status: string
          task_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          client_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          task_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          client_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          task_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "campaign_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ad_views: {
        Row: {
          ad_id: string
          id: string
          status: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          ad_id: string
          id?: string
          status?: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          ad_id?: string
          id?: string
          status?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ad_views_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "classified_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding_task_completions: {
        Row: {
          completed_at: string
          id: string
          onboarding_task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          onboarding_task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          onboarding_task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_onboarding_task_completions_onboarding_task_id_fkey"
            columns: ["onboarding_task_id"]
            isOneToOne: false
            referencedRelation: "onboarding_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_referrals: {
        Row: {
          grand_referrer_id: string | null
          great_grand_referrer_id: string | null
          id: string
          referred_at: string
          referrer_id: string | null
          user_id: string
        }
        Insert: {
          grand_referrer_id?: string | null
          great_grand_referrer_id?: string | null
          id?: string
          referred_at?: string
          referrer_id?: string | null
          user_id: string
        }
        Update: {
          grand_referrer_id?: string | null
          great_grand_referrer_id?: string | null
          id?: string
          referred_at?: string
          referrer_id?: string | null
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
      user_stats: {
        Row: {
          badges: string[] | null
          created_at: string
          current_streak: number
          id: string
          last_task_completed_at: string | null
          level: number
          longest_streak: number
          success_rate: number
          total_earnings: number
          total_tasks_completed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          badges?: string[] | null
          created_at?: string
          current_streak?: number
          id?: string
          last_task_completed_at?: string | null
          level?: number
          longest_streak?: number
          success_rate?: number
          total_earnings?: number
          total_tasks_completed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          badges?: string[] | null
          created_at?: string
          current_streak?: number
          id?: string
          last_task_completed_at?: string | null
          level?: number
          longest_streak?: number
          success_rate?: number
          total_earnings?: number
          total_tasks_completed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_task_completions: {
        Row: {
          completed_at: string
          id: string
          status: string
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          status?: string
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          status?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_note: string | null
          created_at: string
          id: string
          requested_points: number
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          id?: string
          requested_points: number
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          id?: string
          requested_points?: number
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_task_to_user: {
        Args: { task_id: string; user_id: string }
        Returns: boolean
      }
      generate_aa_referral_user_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      rand_5_digits: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "moderator" | "user" | "client"
      campaign_status: "draft" | "active" | "paused" | "completed" | "cancelled"
      campaign_type:
        | "follower_growth"
        | "engagement_boost"
        | "content_amplification"
        | "surveys"
        | "app_installs"
        | "social_media_follow"
        | "social_media_like"
        | "social_media_share"
        | "social_media_comment"
      proof_type:
        | "screenshot"
        | "api_validation"
        | "manual_review"
        | "link_submission"
      social_platform:
        | "instagram"
        | "facebook"
        | "linkedin"
        | "twitter"
        | "youtube"
        | "tiktok"
        | "telegram"
      task_status:
        | "available"
        | "assigned"
        | "submitted"
        | "approved"
        | "rejected"
        | "expired"
      transaction_type:
        | "task_reward"
        | "campaign_payment"
        | "withdrawal"
        | "refund"
        | "commission"
        | "bonus"
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
      app_role: ["super_admin", "admin", "moderator", "user", "client"],
      campaign_status: ["draft", "active", "paused", "completed", "cancelled"],
      campaign_type: [
        "follower_growth",
        "engagement_boost",
        "content_amplification",
        "surveys",
        "app_installs",
        "social_media_follow",
        "social_media_like",
        "social_media_share",
        "social_media_comment",
      ],
      proof_type: [
        "screenshot",
        "api_validation",
        "manual_review",
        "link_submission",
      ],
      social_platform: [
        "instagram",
        "facebook",
        "linkedin",
        "twitter",
        "youtube",
        "tiktok",
        "telegram",
      ],
      task_status: [
        "available",
        "assigned",
        "submitted",
        "approved",
        "rejected",
        "expired",
      ],
      transaction_type: [
        "task_reward",
        "campaign_payment",
        "withdrawal",
        "refund",
        "commission",
        "bonus",
      ],
    },
  },
} as const
