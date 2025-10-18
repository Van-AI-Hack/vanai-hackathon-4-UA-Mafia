import { Venue, Event, EventSearchFilters } from '../types/events';

// API Keys and configuration (in production, these would be in environment variables)
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const EVENTBRITE_API_KEY = import.meta.env.VITE_EVENTBRITE_API_KEY;
const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

export interface SearchResult {
  venues: Venue[];
  events: Event[];
  lastUpdated: string;
  source: 'cache' | 'api' | 'mock';
}

export class WebSearchService {
  private static cache = new Map<string, { data: SearchResult; timestamp: number }>();
  private static CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  // Search for venues using Google Places API
  static async searchVenues(filters: EventSearchFilters): Promise<Venue[]> {
    const cacheKey = `venues_${JSON.stringify(filters)}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      console.log('📍 Using cached venue data');
      return cached.venues;
    }

    try {
      // Try Google Places API first
      if (GOOGLE_PLACES_API_KEY) {
        const venues = await this.searchGooglePlaces(filters);
        this.setCachedData(cacheKey, { venues, events: [], lastUpdated: new Date().toISOString(), source: 'api' });
        return venues;
      }
    } catch (error) {
      console.warn('Google Places API failed, falling back to mock data:', error);
    }

    // Fallback to mock data
    const mockVenues = await this.getMockVenues(filters);
    this.setCachedData(cacheKey, { venues: mockVenues, events: [], lastUpdated: new Date().toISOString(), source: 'mock' });
    return mockVenues;
  }

  // Search for events using multiple APIs
  static async searchEvents(filters: EventSearchFilters): Promise<Event[]> {
    const cacheKey = `events_${JSON.stringify(filters)}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      console.log('🎵 Using cached event data');
      return cached.events;
    }

    const allEvents: Event[] = [];

    try {
      // Search multiple event sources in parallel
      const [eventbriteEvents, ticketmasterEvents, localEvents] = await Promise.allSettled([
        this.searchEventbrite(filters),
        this.searchTicketmaster(filters),
        this.searchLocalEvents(filters)
      ]);

      // Combine results from all sources
      if (eventbriteEvents.status === 'fulfilled') allEvents.push(...eventbriteEvents.value);
      if (ticketmasterEvents.status === 'fulfilled') allEvents.push(...ticketmasterEvents.value);
      if (localEvents.status === 'fulfilled') allEvents.push(...localEvents.value);

      // Remove duplicates and sort by date
      const uniqueEvents = this.removeDuplicateEvents(allEvents);
      uniqueEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      this.setCachedData(cacheKey, { 
        venues: [], 
        events: uniqueEvents, 
        lastUpdated: new Date().toISOString(), 
        source: 'api' 
      });

      return uniqueEvents;
    } catch (error) {
      console.warn('Event search failed, using mock data:', error);
      const mockEvents = await this.getMockEvents(filters);
      this.setCachedData(cacheKey, { 
        venues: [], 
        events: mockEvents, 
        lastUpdated: new Date().toISOString(), 
        source: 'mock' 
      });
      return mockEvents;
    }
  }

  // Google Places API integration
  private static async searchGooglePlaces(filters: EventSearchFilters): Promise<Venue[]> {
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured');
    }

    const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const params = new URLSearchParams({
      key: GOOGLE_PLACES_API_KEY,
      radius: filters.radius ? (filters.radius * 1000).toString() : '5000',
      type: this.mapCategoryToGoogleType(filters.category || 'karaoke'),
    });

    if (filters.lat && filters.lng) {
      params.append('location', `${filters.lat},${filters.lng}`);
    } else if (filters.city) {
      // Geocode city to get coordinates first
      const coords = await this.geocodeCity(filters.city);
      params.append('location', `${coords.lat},${coords.lng}`);
    }

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return data.results.map((place: any) => this.mapGooglePlaceToVenue(place));
  }

  // Eventbrite API integration
  private static async searchEventbrite(filters: EventSearchFilters): Promise<Event[]> {
    if (!EVENTBRITE_API_KEY) {
      throw new Error('Eventbrite API key not configured');
    }

    const baseUrl = 'https://www.eventbriteapi.com/v3/events/search/';
    const params = new URLSearchParams({
      token: EVENTBRITE_API_KEY,
      'location.address': filters.city || 'Toronto',
      'categories': '103', // Music category
      'start_date.range_start': filters.dateFrom || new Date().toISOString(),
      'start_date.range_end': filters.dateTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      'expand': 'venue',
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    return data.events?.map((event: any) => this.mapEventbriteToEvent(event)) || [];
  }

  // Ticketmaster API integration
  private static async searchTicketmaster(filters: EventSearchFilters): Promise<Event[]> {
    if (!TICKETMASTER_API_KEY) {
      throw new Error('Ticketmaster API key not configured');
    }

    const baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
    const params = new URLSearchParams({
      apikey: TICKETMASTER_API_KEY,
      city: filters.city || 'Toronto',
      classificationName: 'Music',
      startDateTime: filters.dateFrom || new Date().toISOString(),
      endDateTime: filters.dateTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    return data._embedded?.events?.map((event: any) => this.mapTicketmasterToEvent(event)) || [];
  }

  // Search for local/community events (could integrate with Meetup, Facebook Events, etc.)
  private static async searchLocalEvents(filters: EventSearchFilters): Promise<Event[]> {
    // This would integrate with local event platforms
    // For now, return empty array
    return [];
  }

  // Geocode city name to coordinates
  private static async geocodeCity(city: string): Promise<{ lat: number; lng: number }> {
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured');
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${GOOGLE_PLACES_API_KEY}`
    );
    const data = await response.json();

    if (data.status !== 'OK' || !data.results[0]) {
      throw new Error(`Geocoding failed for city: ${city}`);
    }

    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }

  // Map category to Google Places type
  private static mapCategoryToGoogleType(category: string): string {
    const typeMap: Record<string, string> = {
      karaoke: 'night_club',
      live_music: 'night_club',
      music_cafe: 'cafe',
      concert_venue: 'establishment',
      dance_club: 'night_club'
    };
    return typeMap[category] || 'establishment';
  }

  // Map Google Place to Venue
  private static mapGooglePlaceToVenue(place: any): Venue {
    return {
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      city: place.vicinity.split(',')[1]?.trim() || 'Unknown',
      category: this.determineCategory(place.types),
      rating: place.rating || 0,
      userRatingsTotal: place.user_ratings_total || 0,
      priceLevel: place.price_level || 1,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      features: place.types || [],
      description: place.name
    };
  }

  // Map Eventbrite event to Event
  private static mapEventbriteToEvent(event: any): Event {
    return {
      id: event.id,
      venueId: event.venue?.id || 'unknown',
      venue: {
        id: event.venue?.id || 'unknown',
        name: event.venue?.name || 'Unknown Venue',
        address: event.venue?.address?.localized_address_display || 'Unknown Address',
        city: event.venue?.address?.city || 'Unknown City',
        category: 'live_music',
        rating: 0,
        userRatingsTotal: 0,
        priceLevel: 1,
        lat: 0,
        lng: 0,
        features: []
      },
      title: event.name?.text || 'Untitled Event',
      description: event.description?.text || '',
      date: event.start?.local?.split('T')[0] || new Date().toISOString().split('T')[0],
      time: event.start?.local?.split('T')[1]?.split('.')[0] || '19:00',
      duration: 120, // Default duration
      organizer: event.organizer?.name || 'Unknown Organizer',
      price: event.is_free ? 0 : (event.ticket_availability?.minimum_ticket_price?.major_value || 0),
      eventType: this.determineEventType(event),
      tags: event.tags?.map((tag: any) => tag.display_name) || [],
      isRecurring: false,
      status: 'upcoming'
    };
  }

  // Map Ticketmaster event to Event
  private static mapTicketmasterToEvent(event: any): Event {
    return {
      id: event.id,
      venueId: event._embedded?.venues?.[0]?.id || 'unknown',
      venue: {
        id: event._embedded?.venues?.[0]?.id || 'unknown',
        name: event._embedded?.venues?.[0]?.name || 'Unknown Venue',
        address: event._embedded?.venues?.[0]?.address?.line1 || 'Unknown Address',
        city: event._embedded?.venues?.[0]?.city?.name || 'Unknown City',
        category: 'concert_venue',
        rating: 0,
        userRatingsTotal: 0,
        priceLevel: 1,
        lat: 0,
        lng: 0,
        features: []
      },
      title: event.name || 'Untitled Event',
      description: event.info || '',
      date: event.dates?.start?.localDate || new Date().toISOString().split('T')[0],
      time: event.dates?.start?.localTime || '19:00',
      duration: 120,
      organizer: event._embedded?.attractions?.[0]?.name || 'Unknown Organizer',
      price: event.priceRanges?.[0]?.min || 0,
      eventType: 'concert',
      tags: event.classifications?.map((c: any) => c.segment?.name).filter(Boolean) || [],
      isRecurring: false,
      status: 'upcoming'
    };
  }

  // Determine venue category from Google types
  private static determineCategory(types: string[]): Venue['category'] {
    if (types.includes('night_club')) return 'karaoke';
    if (types.includes('cafe')) return 'music_cafe';
    if (types.includes('establishment')) return 'concert_venue';
    return 'live_music';
  }

  // Determine event type from event data
  private static determineEventType(event: any): Event['eventType'] {
    const name = (event.name?.text || '').toLowerCase();
    if (name.includes('karaoke')) return 'karaoke_night';
    if (name.includes('open mic') || name.includes('open_mic')) return 'open_mic';
    if (name.includes('workshop') || name.includes('class')) return 'singing_workshop';
    if (name.includes('jam') || name.includes('session')) return 'music_jam';
    if (name.includes('dance') || name.includes('party')) return 'dance_party';
    return 'concert';
  }

  // Remove duplicate events based on title and date
  private static removeDuplicateEvents(events: Event[]): Event[] {
    const seen = new Set();
    return events.filter(event => {
      const key = `${event.title}-${event.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Cache management
  private static getCachedData(key: string): SearchResult | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private static setCachedData(key: string, data: SearchResult): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Clear cache
  static clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Mock data fallbacks
  private static async getMockVenues(filters: EventSearchFilters): Promise<Venue[]> {
    // Return mock venues from eventService
    const { EventService } = await import('./eventService');
    return EventService.searchVenues(filters);
  }

  private static async getMockEvents(filters: EventSearchFilters): Promise<Event[]> {
    // Return mock events from eventService
    const { EventService } = await import('./eventService');
    return EventService.searchEvents(filters);
  }
}
