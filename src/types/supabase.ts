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
      completed_clips: {
        Row: {
          id: string
          created_at: string
          name: string
          audio_url: string
          transcript: string
          duration: number
          language: string
          voice_id: string
          created_by: string | null
          scheduled_clip_id: string | null
          genre: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          audio_url: string
          transcript: string
          duration: number
          language: string
          voice_id: string
          created_by?: string | null
          scheduled_clip_id?: string | null
          genre?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          audio_url?: string
          transcript?: string
          duration?: number
          language?: string
          voice_id?: string
          created_by?: string | null
          scheduled_clip_id?: string | null
          genre?: string | null
        }
      }
    }
  }
}