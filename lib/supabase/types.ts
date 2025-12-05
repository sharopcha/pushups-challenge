export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      pushup_entries: {
        Row: {
          id: string
          user_id: string
          count: number
          performed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          count: number
          performed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          count?: number
          performed_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      weekly_leaderboard_current: {
        Row: {
          week_start: string | null
          user_id: string | null
          total_pushups: number | null
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type PushupEntry = Database['public']['Tables']['pushup_entries']['Row']
export type LeaderboardEntry = Database['public']['Views']['weekly_leaderboard_current']['Row'] & {
  profiles: Profile | null
}
