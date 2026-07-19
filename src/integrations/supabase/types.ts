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
      campaign_tasks: {
        Row: {
          admin_note: string | null
          approved_at: string | null
          campaign_id: string
          created_at: string | null
          id: string
          proof_data: Json | null
          proof_url: string | null
          reward_amount: number | null
          status: string | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          approved_at?: string | null
          campaign_id: string
          created_at?: string | null
          id?: string
          proof_data?: Json | null
          proof_url?: string | null
          reward_amount?: number | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          approved_at?: string | null
          campaign_id?: string
          created_at?: string | null
          id?: string
          proof_data?: Json | null
          proof_url?: string | null
          reward_amount?: number | null
          status?: string | null
          submitted_at?: string | null
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
          campaign_type: string | null
          client_id: string
          completed_tasks: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          max_tasks: number | null
          proof_requirements: string | null
          reward_per_task: number | null
          spent_budget: number | null
          start_date: string | null
          status: string | null
          target_age_max: number | null
          target_age_min: number | null
          target_cities: string[] | null
          target_countries: string[] | null
          target_interests: string[] | null
          target_platform: string | null
          target_url: string | null
          title: string
          total_budget: number | null
        }
        Insert: {
          campaign_type?: string | null
          client_id: string
          completed_tasks?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          max_tasks?: number | null
          proof_requirements?: string | null
          reward_per_task?: number | null
          spent_budget?: number | null
          start_date?: string | null
          status?: string | null
          target_age_max?: number | null
          target_age_min?: number | null
          target_cities?: string[] | null
          target_countries?: string[] | null
          target_interests?: string[] | null
          target_platform?: string | null
          target_url?: string | null
          title: string
          total_budget?: number | null
        }
        Update: {
          campaign_type?: string | null
          client_id?: string
          completed_tasks?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          max_tasks?: number | null
          proof_requirements?: string | null
          reward_per_task?: number | null
          spent_budget?: number | null
          start_date?: string | null
          status?: string | null
          target_age_max?: number | null
          target_age_min?: number | null
          target_cities?: string[] | null
          target_countries?: string[] | null
          target_interests?: string[] | null
          target_platform?: string | null
          target_url?: string | null
          title?: string
          total_budget?: number | null
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
      clients: {
        Row: {
          business_email: string | null
          company_name: string
          created_at: string | null
          id: string
          total_spent: number | null
          user_id: string
          verification_status: string | null
          wallet_balance: number | null
        }
        Insert: {
          business_email?: string | null
          company_name: string
          created_at?: string | null
          id?: string
          total_spent?: number | null
          user_id: string
          verification_status?: string | null
          wallet_balance?: number | null
        }
        Update: {
          business_email?: string | null
          company_name?: string
          created_at?: string | null
          id?: string
          total_spent?: number | null
          user_id?: string
          verification_status?: string | null
          wallet_balance?: number | null
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
        Relationships: [
          {
            foreignKeyName: "comment_replies_replier_user_id_fkey"
            columns: ["replier_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_topics: {
        Row: {
          author: string | null
          created_at: string | null
          id: string
          replies: number | null
          title: string
          trending: boolean | null
          url: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          id?: string
          replies?: number | null
          title: string
          trending?: boolean | null
          url?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          id?: string
          replies?: number | null
          title?: string
          trending?: boolean | null
          url?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string | null
          rating: number | null
          total_reviews: number | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string | null
          rating?: number | null
          total_reviews?: number | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string | null
          rating?: number | null
          total_reviews?: number | null
          website_url?: string | null
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
            foreignKeyName: "company_comments_commenter_user_id_fkey"
            columns: ["commenter_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "company_comments_company_id_fkey"
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
          sender_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: string | null
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
        Relationships: [
          {
            foreignKeyName: "points_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes: number | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      profile_details: {
        Row: {
          badge: string | null
          company: string | null
          created_at: string | null
          current_role: string | null
          full_name: string | null
          id: string
          industry: string | null
          profile_id: string
          referral_code: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          badge?: string | null
          company?: string | null
          created_at?: string | null
          current_role?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          profile_id: string
          referral_code?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          badge?: string | null
          company?: string | null
          created_at?: string | null
          current_role?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          profile_id?: string
          referral_code?: string | null
          updated_at?: string | null
          username?: string | null
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
          created_at: string | null
          description: string | null
          employment_type: string | null
          end_date: string | null
          id: string
          location: string | null
          profile_id: string
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          profile_id: string
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          profile_id?: string
          start_date?: string
          title?: string
          updated_at?: string | null
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
          created_at: string | null
          id: string
          image_url: string
          profile_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          profile_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
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
      profile_posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          likes: number | null
          profile_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          profile_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
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
          created_at: string | null
          date_of_birth: string | null
          display_name: string | null
          email: string | null
          facebook_url: string | null
          follower_count: number | null
          following_count: number | null
          id: string
          instagram_url: string | null
          is_verified: boolean | null
          key_skills: string | null
          kyc_status: string | null
          languages: string | null
          linkedin_url: string | null
          networker_type: string | null
          phone: string | null
          points: number | null
          profile_image_url: string | null
          profile_views: number | null
          rank: string | null
          referral_user_id: string | null
          specialization: string | null
          streak: number | null
          team_level1: number | null
          team_level2: number | null
          team_level3: number | null
          team_size: number | null
          time_zone: string | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string
          website_url: string | null
          withdrawal_details: Json | null
          withdrawal_method: string | null
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
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          email?: string | null
          facebook_url?: string | null
          follower_count?: number | null
          following_count?: number | null
          id?: string
          instagram_url?: string | null
          is_verified?: boolean | null
          key_skills?: string | null
          kyc_status?: string | null
          languages?: string | null
          linkedin_url?: string | null
          networker_type?: string | null
          phone?: string | null
          points?: number | null
          profile_image_url?: string | null
          profile_views?: number | null
          rank?: string | null
          referral_user_id?: string | null
          specialization?: string | null
          streak?: number | null
          team_level1?: number | null
          team_level2?: number | null
          team_level3?: number | null
          team_size?: number | null
          time_zone?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
          withdrawal_details?: Json | null
          withdrawal_method?: string | null
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
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          email?: string | null
          facebook_url?: string | null
          follower_count?: number | null
          following_count?: number | null
          id?: string
          instagram_url?: string | null
          is_verified?: boolean | null
          key_skills?: string | null
          kyc_status?: string | null
          languages?: string | null
          linkedin_url?: string | null
          networker_type?: string | null
          phone?: string | null
          points?: number | null
          profile_image_url?: string | null
          profile_views?: number | null
          rank?: string | null
          referral_user_id?: string | null
          specialization?: string | null
          streak?: number | null
          team_level1?: number | null
          team_level2?: number | null
          team_level3?: number | null
          team_size?: number | null
          time_zone?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
          withdrawal_details?: Json | null
          withdrawal_method?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          rating: number | null
          review: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          review: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
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
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      service_pricing: {
        Row: {
          created_at: string | null
          display_label: string
          id: string
          is_active: boolean | null
          notes: string | null
          point_cost: number
          service_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_label: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          point_cost?: number
          service_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_label?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          point_cost?: number
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          created_at: string | null
          follower_count: number | null
          id: string
          last_updated: string | null
          platform: string
          profile_url: string | null
          user_id: string
          username: string | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          follower_count?: number | null
          id?: string
          last_updated?: string | null
          platform: string
          profile_url?: string | null
          user_id: string
          username?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          follower_count?: number | null
          id?: string
          last_updated?: string | null
          platform?: string
          profile_url?: string | null
          user_id?: string
          username?: string | null
          verification_status?: string | null
          verified_at?: string | null
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
        Relationships: [
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          created_by: string | null
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
          created_by?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          payout_points?: number
          proof_type?: string
          title: string
          type: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
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
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          note: string | null
          related_id: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string | null
          id?: string
          note?: string | null
          related_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          note?: string | null
          related_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profile_comments: {
        Row: {
          commented_user_id: string
          commenter_user_id: string
          content: string
          created_at: string | null
          id: string
        }
        Insert: {
          commented_user_id: string
          commenter_user_id: string
          content: string
          created_at?: string | null
          id?: string
        }
        Update: {
          commented_user_id?: string
          commenter_user_id?: string
          content?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_comments_commented_user_id_fkey"
            columns: ["commented_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_profile_comments_commenter_user_id_fkey"
            columns: ["commenter_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profile_reviews: {
        Row: {
          created_at: string | null
          id: string
          rating: number | null
          review: string
          reviewed_user_id: string
          reviewer_user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review: string
          reviewed_user_id: string
          reviewer_user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number | null
          review?: string
          reviewed_user_id?: string
          reviewer_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_reviews_reviewed_user_id_fkey"
            columns: ["reviewed_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_profile_reviews_reviewer_user_id_fkey"
            columns: ["reviewer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_referrals: {
        Row: {
          id: string
          referred_at: string | null
          referrer_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          referred_at?: string | null
          referrer_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          referred_at?: string | null
          referrer_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          current_streak: number | null
          total_points_earned: number | null
          total_tasks_completed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_streak?: number | null
          total_points_earned?: number | null
          total_tasks_completed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_streak?: number | null
          total_points_earned?: number | null
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
          proof_text: string | null
          proof_url: string | null
          status: string | null
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          proof_text?: string | null
          proof_url?: string | null
          status?: string | null
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          proof_text?: string | null
          proof_url?: string | null
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
          {
            foreignKeyName: "user_task_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
      generate_campaign_tasks: {
        Args: { campaign_id_param: string }
        Returns: undefined
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
