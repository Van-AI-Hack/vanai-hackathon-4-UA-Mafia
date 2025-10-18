import { supabase } from '../lib/supabase';
import { Venue, Event, EventSearchFilters, SavedEvent } from '../types/events';

// Mock data for venues and events (in a real app, this would come from APIs like Google Places, Yelp, etc.)
const mockVenues: Venue[] = [
  {
    id: 'venue-1',
    name: 'Karaoke Central',
    address: '123 Music Street, Toronto, ON',
    city: 'Toronto',
    category: 'karaoke',
    rating: 4.5,
    userRatingsTotal: 234,
    priceLevel: 2,
    phone: '+1-416-555-0123',
    website: 'https://karaokecentral.com',
    photoUrl: '/images/venues/karaoke-central.jpg',
    lat: 43.6532,
    lng: -79.3832,
    features: ['private_rooms', 'live_band', 'dance_floor', 'bar'],
    openingHours: ['Mon-Thu: 6PM-2AM', 'Fri-Sat: 6PM-3AM', 'Sun: 7PM-1AM'],
    description: 'Premier karaoke destination with private rooms and live music'
  },
  {
    id: 'venue-2',
    name: 'The Melody Lounge',
    address: '456 Harmony Ave, Toronto, ON',
    city: 'Toronto',
    category: 'live_music',
    rating: 4.8,
    userRatingsTotal: 189,
    priceLevel: 3,
    phone: '+1-416-555-0456',
    website: 'https://melodylounge.ca',
    photoUrl: '/images/venues/melody-lounge.jpg',
    lat: 43.6426,
    lng: -79.3871,
    features: ['live_band', 'acoustic_nights', 'wine_bar'],
    openingHours: ['Tue-Sun: 7PM-12AM'],
    description: 'Intimate venue for live music and acoustic performances'
  },
  {
    id: 'venue-3',
    name: 'Sing & Sip Cafe',
    address: '789 Vocal Blvd, Toronto, ON',
    city: 'Toronto',
    category: 'music_cafe',
    rating: 4.2,
    userRatingsTotal: 156,
    priceLevel: 1,
    phone: '+1-416-555-0789',
    photoUrl: '/images/venues/sing-sip-cafe.jpg',
    lat: 43.6764,
    lng: -79.4113,
    features: ['open_mic', 'coffee', 'light_food'],
    openingHours: ['Mon-Sun: 8AM-10PM'],
    description: 'Cozy cafe with regular open mic nights and coffee'
  },
  {
    id: 'venue-4',
    name: 'Rhythm & Blues Bar',
    address: '321 Beat Street, Toronto, ON',
    city: 'Toronto',
    category: 'dance_club',
    rating: 4.6,
    userRatingsTotal: 312,
    priceLevel: 3,
    phone: '+1-416-555-0321',
    website: 'https://rhythmandblues.ca',
    photoUrl: '/images/venues/rhythm-blues.jpg',
    lat: 43.6629,
    lng: -79.3957,
    features: ['dance_floor', 'live_dj', 'cocktails', 'late_night'],
    openingHours: ['Thu-Sat: 9PM-3AM'],
    description: 'Vibrant dance club with live DJs and great cocktails'
  }
];

const mockEvents: Event[] = [
  {
    id: 'event-1',
    venueId: 'venue-1',
    venue: mockVenues[0],
    title: 'Friday Night Karaoke Madness',
    description: 'Join us for an epic karaoke night with prizes for best performances!',
    date: '2024-01-19',
    time: '20:00',
    duration: 240,
    maxParticipants: 50,
    currentParticipants: 23,
    organizer: 'Karaoke Central',
    price: 15,
    eventType: 'karaoke_night',
    tags: ['karaoke', 'prizes', 'fun', 'singing'],
    isRecurring: true,
    recurringPattern: 'weekly',
    status: 'upcoming'
  },
  {
    id: 'event-2',
    venueId: 'venue-2',
    venue: mockVenues[1],
    title: 'Acoustic Open Mic Night',
    description: 'Showcase your acoustic talents in our intimate setting',
    date: '2024-01-20',
    time: '19:30',
    duration: 180,
    maxParticipants: 30,
    currentParticipants: 12,
    organizer: 'The Melody Lounge',
    price: 10,
    eventType: 'open_mic',
    tags: ['acoustic', 'open_mic', 'intimate', 'original_music'],
    isRecurring: true,
    recurringPattern: 'weekly',
    status: 'upcoming'
  },
  {
    id: 'event-3',
    venueId: 'venue-3',
    venue: mockVenues[2],
    title: 'Singing Workshop: Vocal Techniques',
    description: 'Learn proper breathing and vocal techniques from professional instructors',
    date: '2024-01-21',
    time: '14:00',
    duration: 120,
    maxParticipants: 15,
    currentParticipants: 8,
    organizer: 'Sing & Sip Cafe',
    price: 25,
    eventType: 'singing_workshop',
    tags: ['workshop', 'learning', 'technique', 'beginner_friendly'],
    isRecurring: false,
    status: 'upcoming'
  },
  {
    id: 'event-4',
    venueId: 'venue-4',
    venue: mockVenues[3],
    title: 'Saturday Night Dance Party',
    description: 'Dance the night away to the best hits and live DJ sets',
    date: '2024-01-20',
    time: '22:00',
    duration: 300,
    maxParticipants: 100,
    currentParticipants: 67,
    organizer: 'Rhythm & Blues Bar',
    price: 20,
    eventType: 'dance_party',
    tags: ['dancing', 'dj', 'party', 'late_night'],
    isRecurring: true,
    recurringPattern: 'weekly',
    status: 'upcoming'
  }
];

export class EventService {
  // Search for venues based on filters
  static async searchVenues(filters: EventSearchFilters): Promise<Venue[]> {
    // In a real app, this would call Google Places API or similar
    let results = [...mockVenues];
    
    // Filter by city
    if (filters.city) {
      results = results.filter(venue => 
        venue.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    // Filter by category
    if (filters.category) {
      results = results.filter(venue => venue.category === filters.category);
    }
    
    // Filter by rating
    if (filters.minRating) {
      results = results.filter(venue => venue.rating >= filters.minRating!);
    }
    
    // Filter by price
    if (filters.maxPrice) {
      results = results.filter(venue => {
        const priceMap = { 1: 20, 2: 50, 3: 100, 4: 200 };
        return priceMap[venue.priceLevel] <= filters.maxPrice!;
      });
    }
    
    // Calculate distances if lat/lng provided
    if (filters.lat && filters.lng) {
      results = results.map(venue => ({
        ...venue,
        distance: calculateDistance(filters.lat!, filters.lng!, venue.lat, venue.lng)
      }));
      
      // Sort by distance
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      // Filter by radius
      if (filters.radius) {
        results = results.filter(venue => (venue.distance || 0) <= filters.radius!);
      }
    }
    
    return results;
  }
  
  // Search for events based on filters
  static async searchEvents(filters: EventSearchFilters): Promise<Event[]> {
    let results = [...mockEvents];
    
    // Filter by date range
    if (filters.dateFrom) {
      results = results.filter(event => event.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      results = results.filter(event => event.date <= filters.dateTo!);
    }
    
    // Filter by event type
    if (filters.eventType) {
      results = results.filter(event => event.eventType === filters.eventType);
    }
    
    // Filter by price
    if (filters.maxPrice) {
      results = results.filter(event => !event.price || event.price <= filters.maxPrice!);
    }
    
    // Filter by venue location if provided
    if (filters.city) {
      results = results.filter(event => 
        event.venue.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    // Sort by date
    results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return results;
  }
  
  // Get events for a specific venue
  static async getVenueEvents(venueId: string): Promise<Event[]> {
    return mockEvents.filter(event => event.venueId === venueId);
  }
  
  // Save an event for a user
  static async saveEvent(eventId: string, userId: string, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('saved_events')
      .insert({
        event_id: eventId,
        user_id: userId,
        notes: notes,
        saved_at: new Date().toISOString()
      });
    
    if (error) {
      throw new Error(`Failed to save event: ${error.message}`);
    }
  }
  
  // Get saved events for a user
  static async getSavedEvents(userId: string): Promise<SavedEvent[]> {
    const { data, error } = await supabase
      .from('saved_events')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to get saved events: ${error.message}`);
    }
    
    return data || [];
  }
  
  // Remove a saved event
  static async unsaveEvent(eventId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_events')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);
    
    if (error) {
      throw new Error(`Failed to unsave event: ${error.message}`);
    }
  }
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
