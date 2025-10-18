/**
 * Supabase client configuration for Music Buddy feature
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface BuddyPersona {
  id: string
  persona_id: number
  persona_name: string
  traits: Record<string, any>
  vibe_tags: string[]
  nickname: string
  city?: string
  email?: string
  linkedin_url?: string
  is_discoverable: boolean
  show_contacts_publicly: boolean
  access_token: string
  created_at: string
  expires_at: string
}

export interface BuddyPersonaInsert {
  persona_id: number
  persona_name: string
  traits: Record<string, any>
  vibe_tags: string[]
  nickname: string
  city?: string
  email?: string
  linkedin_url?: string
  is_discoverable?: boolean
  show_contacts_publicly?: boolean
  access_token: string
}

export interface BuddyMatch {
  personaA: BuddyPersona
  personaB: BuddyPersona
  similarity: number
  sharedTags: string[]
}

