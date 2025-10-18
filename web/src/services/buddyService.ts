/**
 * Music Buddy Service - Handles all persona matching and storage
 */

import { supabase, BuddyPersona, BuddyPersonaInsert } from '../lib/supabase'
import { Persona } from '../utils/dataLoader'

/**
 * Generate a unique access token for a user
 */
function generateAccessToken(): string {
  return `bt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Calculate similarity score between two personas (0-100)
 */
export function calculateSimilarity(personaA: BuddyPersona, personaB: BuddyPersona): number {
  let score = 0
  
  // Same persona type? +50%
  if (personaA.persona_id === personaB.persona_id) {
    score += 0.5
  }
  
  // Shared vibe tags? +30%
  const sharedTags = personaA.vibe_tags.filter(tag => 
    personaB.vibe_tags.includes(tag)
  )
  if (personaA.vibe_tags.length > 0) {
    score += (sharedTags.length / personaA.vibe_tags.length) * 0.3
  }
  
  // Same city? +20%
  if (personaA.city && personaB.city && 
      personaA.city.toLowerCase() === personaB.city.toLowerCase()) {
    score += 0.2
  }
  
  return Math.round(score * 100) // Return as percentage
}

/**
 * Extract vibe tags from persona traits
 */
function extractVibeTags(persona: Persona): string[] {
  const tags: string[] = []
  
  // Add characteristics as tags
  if (persona.characteristics && Array.isArray(persona.characteristics)) {
    tags.push(...persona.characteristics.slice(0, 3))
  }
  
  // Add traits as tags
  if (persona.traits && typeof persona.traits === 'object') {
    Object.keys(persona.traits).forEach(key => {
      const value = (persona.traits as any)[key]
      if (typeof value === 'string') {
        tags.push(value.toLowerCase())
      }
    })
  }
  
  return [...new Set(tags)].slice(0, 5) // Unique tags, max 5
}

/**
 * Save a new buddy persona
 */
export async function saveBuddyPersona(data: {
  persona: Persona
  nickname: string
  city?: string
  email?: string
  linkedinUrl?: string
  isDiscoverable: boolean
  showContactsPublicly: boolean
}): Promise<{ success: boolean; accessToken?: string; error?: string }> {
  try {
    const accessToken = generateAccessToken()
    const vibeTags = extractVibeTags(data.persona)
    
    const personaData: BuddyPersonaInsert = {
      persona_id: data.persona.id,
      persona_name: data.persona.name,
      traits: data.persona.traits,
      vibe_tags: vibeTags,
      nickname: data.nickname,
      city: data.city,
      email: data.email,
      linkedin_url: data.linkedinUrl,
      is_discoverable: data.isDiscoverable,
      show_contacts_publicly: data.showContactsPublicly,
      access_token: accessToken
    }
    
    const { error } = await supabase
      .from('buddy_personas')
      .insert(personaData)
      .select()
      .single()
    
    if (error) {
      console.error('Error saving persona:', error)
      return { success: false, error: error.message }
    }
    
    // Store access token in localStorage for user to manage later
    localStorage.setItem('buddy-access-token', accessToken)
    
    return { success: true, accessToken }
  } catch (error: any) {
    console.error('Error saving persona:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Browse discoverable personas
 */
export async function browsePersonas(filters?: {
  personaId?: number
  city?: string
  excludeMyself?: boolean
}): Promise<{ success: boolean; personas?: BuddyPersona[]; error?: string }> {
  try {
    let query = supabase
      .from('buddy_personas')
      .select('*')
      .eq('is_discoverable', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(20)
    
    // Filter by persona type if specified
    if (filters?.personaId !== undefined) {
      query = query.eq('persona_id', filters.personaId)
    }
    
    // Filter by city if specified
    if (filters?.city) {
      query = query.eq('city', filters.city)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error browsing personas:', error)
      return { success: false, error: error.message }
    }
    
    // Exclude current user's persona if requested
    let personas = data || []
    if (filters?.excludeMyself) {
      const myToken = localStorage.getItem('buddy-access-token')
      if (myToken) {
        personas = personas.filter(p => p.access_token !== myToken)
      }
    }
    
    return { success: true, personas }
  } catch (error: any) {
    console.error('Error browsing personas:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get a specific persona by ID
 */
export async function getPersona(id: string): Promise<{ success: boolean; persona?: BuddyPersona; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('buddy_personas')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true, persona: data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Reveal contact info (only if user allows public sharing)
 */
export async function revealContact(personaId: string): Promise<{
  success: boolean
  contact?: { email?: string; linkedin_url?: string }
  error?: string
}> {
  try {
    const { data, error } = await supabase
      .from('buddy_personas')
      .select('email, linkedin_url, show_contacts_publicly')
      .eq('id', personaId)
      .single()
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    if (!data.show_contacts_publicly) {
      return {
        success: false,
        error: 'This user prefers not to share contact info publicly'
      }
    }
    
    return {
      success: true,
      contact: {
        email: data.email,
        linkedin_url: data.linkedin_url
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get my saved persona using access token
 */
export async function getMyPersona(): Promise<{ success: boolean; persona?: BuddyPersona; error?: string }> {
  try {
    const accessToken = localStorage.getItem('buddy-access-token')
    if (!accessToken) {
      return { success: false, error: 'No saved persona found' }
    }
    
    const { data, error } = await supabase
      .from('buddy_personas')
      .select('*')
      .eq('access_token', accessToken)
      .single()
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true, persona: data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Update my persona settings
 */
export async function updateMyPersona(updates: {
  nickname?: string
  city?: string
  email?: string
  linkedin_url?: string
  is_discoverable?: boolean
  show_contacts_publicly?: boolean
}): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = localStorage.getItem('buddy-access-token')
    if (!accessToken) {
      return { success: false, error: 'No access token found' }
    }
    
    const { error } = await supabase
      .from('buddy_personas')
      .update(updates)
      .eq('access_token', accessToken)
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Delete my persona
 */
export async function deleteMyPersona(): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = localStorage.getItem('buddy-access-token')
    if (!accessToken) {
      return { success: false, error: 'No access token found' }
    }
    
    const { error } = await supabase
      .from('buddy_personas')
      .delete()
      .eq('access_token', accessToken)
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    // Clear local storage
    localStorage.removeItem('buddy-access-token')
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get suggested matches for current user
 */
export async function getSuggestedMatches(myPersona: BuddyPersona, limit: number = 10): Promise<{
  success: boolean
  matches?: Array<{ persona: BuddyPersona; similarity: number; sharedTags: string[] }>
  error?: string
}> {
  try {
    // Get all discoverable personas
    const { success, personas, error } = await browsePersonas({
      excludeMyself: true
    })
    
    if (!success || !personas) {
      return { success: false, error }
    }
    
    // Calculate similarity for each persona
    const matches = personas.map(persona => {
      const similarity = calculateSimilarity(myPersona, persona)
      const sharedTags = myPersona.vibe_tags.filter(tag =>
        persona.vibe_tags.includes(tag)
      )
      
      return { persona, similarity, sharedTags }
    })
    
    // Sort by similarity (highest first) and limit
    matches.sort((a, b) => b.similarity - a.similarity)
    
    return {
      success: true,
      matches: matches.slice(0, limit)
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

