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
      activity_log: {
        Row: {
          event_type: string
          id: string
          text: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          event_type: string
          id?: string
          text?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          event_type?: string
          id?: string
          text?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      classified_ads: {
        Row: {
          description: string
          expires_at: string | null
          id: string
          image_url: string | null
          paid: boolean | null
          posted_at: string | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          description: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          paid?: boolean | null
          posted_at?: string | null
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          description?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          paid?: boolean | null
          posted_at?: string | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      comment_replies: {
        Row: {
          comment_type: string
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string
          replier_user_id: string
          updated_at: string | null
        }
        Insert: {
          comment_type: string
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id: string
          replier_user_id: string
          updated_at?: string | null
        }
        Update: {
          comment_type?: string
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string
          replier_user_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
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
          created_at: string | null
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
          updated_at: string | null
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
          created_at?: string | null
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
          updated_at?: string | null
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
          created_at?: string | null
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
          updated_at?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      company_comments: {
        Row: {
          commenter_user_id: string
          company_id: string
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          commenter_user_id: string
          company_id: string
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          commenter_user_id?: string
          company_id?: string
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_comments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
          description: string | null
          host: string
          id: string
          spots: number | null
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          host: string
          id?: string
          spots?: number | null
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          host?: string
          id?: string
          spots?: number | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          attending_at: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          attending_at?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          attending_at?: string | null
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
          created_at: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
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
          is_paid: boolean | null
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
          is_paid?: boolean | null
          location_type: string
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
          is_paid?: boolean | null
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
      login_history: {
        Row: {
          attempted_at: string | null
          device_type: Database["public"]["Enums"]["device_type"] | null
          failure_reason: string | null
          id: string
          ip_address: unknown
          is_suspicious: boolean | null
          location: Json | null
          session_id: string | null
          status: Database["public"]["Enums"]["login_status"]
          user_agent: string | null
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          device_type?: Database["public"]["Enums"]["device_type"] | null
          failure_reason?: string | null
          id?: string
          ip_address: unknown
          is_suspicious?: boolean | null
          location?: Json | null
          session_id?: string | null
          status: Database["public"]["Enums"]["login_status"]
          user_agent?: string | null
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          device_type?: Database["public"]["Enums"]["device_type"] | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown
          is_suspicious?: boolean | null
          location?: Json | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["login_status"]
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      monthly_contest_companies: {
        Row: {
          application_notes: string | null
          company_id: string
          contest_month: string
          created_at: string | null
          id: string
          is_candidate: boolean | null
          is_winner: boolean | null
          updated_at: string | null
        }
        Insert: {
          application_notes?: string | null
          company_id: string
          contest_month: string
          created_at?: string | null
          id?: string
          is_candidate?: boolean | null
          is_winner?: boolean | null
          updated_at?: string | null
        }
        Update: {
          application_notes?: string | null
          company_id?: string
          contest_month?: string
          created_at?: string | null
          id?: string
          is_candidate?: boolean | null
          is_winner?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      monthly_contest_company_votes: {
        Row: {
          contest_company_id: string
          id: string
          user_id: string
          voted_at: string | null
        }
        Insert: {
          contest_company_id: string
          id?: string
          user_id: string
          voted_at?: string | null
        }
        Update: {
          contest_company_id?: string
          id?: string
          user_id?: string
          voted_at?: string | null
        }
        Relationships: []
      }
      monthly_contest_networker_votes: {
        Row: {
          contest_networker_id: string
          id: string
          user_id: string
          voted_at: string | null
        }
        Insert: {
          contest_networker_id: string
          id?: string
          user_id: string
          voted_at?: string | null
        }
        Update: {
          contest_networker_id?: string
          id?: string
          user_id?: string
          voted_at?: string | null
        }
        Relationships: []
      }
      monthly_contest_networkers: {
        Row: {
          application_notes: string | null
          contest_month: string
          created_at: string | null
          id: string
          is_candidate: boolean | null
          is_winner: boolean | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          application_notes?: string | null
          contest_month: string
          created_at?: string | null
          id?: string
          is_candidate?: boolean | null
          is_winner?: boolean | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          application_notes?: string | null
          contest_month?: string
          created_at?: string | null
          id?: string
          is_candidate?: boolean | null
          is_winner?: boolean | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      Net: {
        Row: {
          created_at: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          id?: number
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          category: string
          content: string | null
          created_at: string | null
          date: string | null
          headline: string
          id: string
          image_url: string | null
          slug: string | null
        }
        Insert: {
          author?: string | null
          category: string
          content?: string | null
          created_at?: string | null
          date?: string | null
          headline: string
          id?: string
          image_url?: string | null
          slug?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string | null
          date?: string | null
          headline?: string
          id?: string
          image_url?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown
          token_hash: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown
          token_hash: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          token_hash?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      points_ledger: {
        Row: {
          amount: number
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
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
      profile_followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_locked_until: string | null
          achievements: string | null
          availability_status: string | null
          avatar_url: string | null
          backup_codes: string[] | null
          bio: string | null
          city: string | null
          connection_count: number | null
          country: string | null
          cover_image_url: string | null
          created_at: string | null
          current_company: string | null
          current_position: string | null
          date_of_birth: string | null
          display_name: string
          email: string | null
          email_verified_at: string | null
          facebook_url: string | null
          failed_login_attempts: number | null
          follower_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          instagram_url: string | null
          is_verified: boolean | null
          key_skills: string | null
          kyc_status: string | null
          language: string | null
          languages: string | null
          last_active_at: string | null
          last_login_at: string | null
          last_login_ip: unknown
          linkedin_url: string | null
          location: string | null
          mfa_enabled: boolean | null
          networker_type: string | null
          notification_preferences: Json | null
          password_changed_at: string | null
          phone: string | null
          phone_verified_at: string | null
          points: number | null
          profile_image_url: string | null
          profile_views: number | null
          rank: string | null
          referral_user_id: string | null
          referrals_this_month: number | null
          role: string | null
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
          updated_at: string | null
          user_id: string
          username: string | null
          wallet_balance: number | null
          website: string | null
          website_url: string | null
          withdrawal_details: Json | null
          withdrawal_method: string | null
          xp_level: number | null
          xp_required: number | null
          years_experience: number | null
          youtube_url: string | null
        }
        Insert: {
          account_locked_until?: string | null
          achievements?: string | null
          availability_status?: string | null
          avatar_url?: string | null
          backup_codes?: string[] | null
          bio?: string | null
          city?: string | null
          connection_count?: number | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          date_of_birth?: string | null
          display_name: string
          email?: string | null
          email_verified_at?: string | null
          facebook_url?: string | null
          failed_login_attempts?: number | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          instagram_url?: string | null
          is_verified?: boolean | null
          key_skills?: string | null
          kyc_status?: string | null
          language?: string | null
          languages?: string | null
          last_active_at?: string | null
          last_login_at?: string | null
          last_login_ip?: unknown
          linkedin_url?: string | null
          location?: string | null
          mfa_enabled?: boolean | null
          networker_type?: string | null
          notification_preferences?: Json | null
          password_changed_at?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          points?: number | null
          profile_image_url?: string | null
          profile_views?: number | null
          rank?: string | null
          referral_user_id?: string | null
          referrals_this_month?: number | null
          role?: string | null
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
          updated_at?: string | null
          user_id: string
          username?: string | null
          wallet_balance?: number | null
          website?: string | null
          website_url?: string | null
          withdrawal_details?: Json | null
          withdrawal_method?: string | null
          xp_level?: number | null
          xp_required?: number | null
          years_experience?: number | null
          youtube_url?: string | null
        }
        Update: {
          account_locked_until?: string | null
          achievements?: string | null
          availability_status?: string | null
          avatar_url?: string | null
          backup_codes?: string[] | null
          bio?: string | null
          city?: string | null
          connection_count?: number | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          date_of_birth?: string | null
          display_name?: string
          email?: string | null
          email_verified_at?: string | null
          facebook_url?: string | null
          failed_login_attempts?: number | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          instagram_url?: string | null
          is_verified?: boolean | null
          key_skills?: string | null
          kyc_status?: string | null
          language?: string | null
          languages?: string | null
          last_active_at?: string | null
          last_login_at?: string | null
          last_login_ip?: unknown
          linkedin_url?: string | null
          location?: string | null
          mfa_enabled?: boolean | null
          networker_type?: string | null
          notification_preferences?: Json | null
          password_changed_at?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          points?: number | null
          profile_image_url?: string | null
          profile_views?: number | null
          rank?: string | null
          referral_user_id?: string | null
          referrals_this_month?: number | null
          role?: string | null
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
          updated_at?: string | null
          user_id?: string
          username?: string | null
          wallet_balance?: number | null
          website?: string | null
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
          created_at: string | null
          id: string
          rating: number
          review: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          rating: number
          review: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
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
      security_events: {
        Row: {
          acknowledged_at: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string
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
      task_event_logs: {
        Row: {
          created_at: string | null
          event_by: string | null
          event_note: string | null
          event_type: string
          id: string
          task_id: string
          task_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_by?: string | null
          event_note?: string | null
          event_type: string
          id?: string
          task_id: string
          task_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
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
          created_at: string | null
          id: string
          reviewed_at: string | null
          screenshot_url: string
          status: string | null
          task_id: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          screenshot_url: string
          status?: string | null
          task_id: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          screenshot_url?: string
          status?: string | null
          task_id?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          created_by: string
          description: string
          id: string
          is_active: boolean | null
          payout_points: number
          proof_type: string
          title: string
          type: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description: string
          id?: string
          is_active?: boolean | null
          payout_points: number
          proof_type: string
          title: string
          type: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string
          id?: string
          is_active?: boolean | null
          payout_points?: number
          proof_type?: string
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      user_ad_views: {
        Row: {
          ad_id: string
          id: string
          status: string | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          ad_id: string
          id?: string
          status?: string | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          ad_id?: string
          id?: string
          status?: string | null
          user_id?: string
          viewed_at?: string | null
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
      user_mfa: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          last_used_at: string | null
          method: Database["public"]["Enums"]["mfa_method"]
          phone_number: string | null
          secret_key: string | null
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          last_used_at?: string | null
          method: Database["public"]["Enums"]["mfa_method"]
          phone_number?: string | null
          secret_key?: string | null
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          last_used_at?: string | null
          method?: Database["public"]["Enums"]["mfa_method"]
          phone_number?: string | null
          secret_key?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding_task_completions: {
        Row: {
          completed_at: string | null
          id: string
          onboarding_task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          onboarding_task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          onboarding_task_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          user_id: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          user_id: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      user_referrals: {
        Row: {
          grand_referrer_id: string | null
          great_grand_referrer_id: string | null
          id: string
          referred_at: string | null
          referrer_id: string | null
          user_id: string
        }
        Insert: {
          grand_referrer_id?: string | null
          great_grand_referrer_id?: string | null
          id?: string
          referred_at?: string | null
          referrer_id?: string | null
          user_id: string
        }
        Update: {
          grand_referrer_id?: string | null
          great_grand_referrer_id?: string | null
          id?: string
          referred_at?: string | null
          referrer_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address: unknown
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          badges: string[] | null
          created_at: string | null
          current_streak: number | null
          id: string
          last_task_completed_at: string | null
          level: number | null
          longest_streak: number | null
          success_rate: number | null
          total_earnings: number | null
          total_tasks_completed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badges?: string[] | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_task_completed_at?: string | null
          level?: number | null
          longest_streak?: number | null
          success_rate?: number | null
          total_earnings?: number | null
          total_tasks_completed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badges?: string[] | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_task_completed_at?: string | null
          level?: number | null
          longest_streak?: number | null
          success_rate?: number | null
          total_earnings?: number | null
          total_tasks_completed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_task_completions: {
        Row: {
          completed_at: string | null
          id: string
          status: string | null
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          status?: string | null
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          status?: string | null
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
          created_at: string | null
          id: string
          requested_points: number
          reviewed_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string | null
          id?: string
          requested_points: number
          reviewed_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string | null
          id?: string
          requested_points?: number
          reviewed_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_reset_tokens: { Args: never; Returns: number }
      cleanup_expired_sessions: { Args: never; Returns: number }
      generate_aa_referral_user_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_event_data?: Json
          p_event_type: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      rand_5_digits: { Args: never; Returns: string }
      record_login_attempt: {
        Args: {
          p_device_type?: Database["public"]["Enums"]["device_type"]
          p_failure_reason?: string
          p_ip_address: unknown
          p_location?: Json
          p_session_id?: string
          p_status: Database["public"]["Enums"]["login_status"]
          p_user_agent: string
          p_user_id: string
        }
        Returns: string
      }
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
      device_type: "desktop" | "mobile" | "tablet" | "unknown"
      login_status: "success" | "failed" | "blocked" | "suspicious"
      mfa_method: "totp" | "sms" | "email"
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
      user_role: "admin" | "moderator" | "user"
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
      device_type: ["desktop", "mobile", "tablet", "unknown"],
      login_status: ["success", "failed", "blocked", "suspicious"],
      mfa_method: ["totp", "sms", "email"],
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
      user_role: ["admin", "moderator", "user"],
    },
  },
} as const
