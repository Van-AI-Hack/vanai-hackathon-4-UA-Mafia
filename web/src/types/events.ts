export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  category: 'karaoke' | 'live_music' | 'music_cafe' | 'concert_venue' | 'dance_club';
  rating: number;
  userRatingsTotal: number;
  priceLevel: 1 | 2 | 3 | 4; // $ to $$$$
  phone?: string;
  website?: string;
  photoUrl?: string;
  lat: number;
  lng: number;
  distance?: number; // in km
  openingHours?: string[];
  description?: string;
  features: string[]; // e.g., ['private_rooms', 'live_band', 'dance_floor']
}

export interface Event {
  id: string;
  venueId: string;
  venue: Venue;
  title: string;
  description: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  duration: number; // in minutes
  maxParticipants?: number;
  currentParticipants: number;
  organizer: string;
  price?: number;
  eventType: 'karaoke_night' | 'open_mic' | 'singing_workshop' | 'music_jam' | 'concert' | 'dance_party';
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'monthly';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface EventSearchFilters {
  city?: string;
  lat?: number;
  lng?: number;
  radius?: number; // in km
  category?: Venue['category'];
  eventType?: Event['eventType'];
  dateFrom?: string;
  dateTo?: string;
  maxPrice?: number;
  minRating?: number;
}

export interface SavedEvent {
  id: string;
  eventId: string;
  userId: string; // access token
  savedAt: string;
  notes?: string;
}
