import { supabase } from '../lib/supabase';
import { WebSearchService } from './webSearchService';
import { Event, Venue } from '../types/events';

export interface SyncStatus {
  isRunning: boolean;
  lastSync: string | null;
  nextSync: string | null;
  syncCount: number;
  errors: string[];
}

export class EventSyncService {
  private static syncInterval: NodeJS.Timeout | null = null;
  private static status: SyncStatus = {
    isRunning: false,
    lastSync: null,
    nextSync: null,
    syncCount: 0,
    errors: []
  };

  // Start automatic syncing
  static startAutoSync(intervalMinutes: number = 30): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.syncEvents();
    }, intervalMinutes * 60 * 1000);

    console.log(`🔄 Event sync started - running every ${intervalMinutes} minutes`);
  }

  // Stop automatic syncing
  static stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.status.isRunning = false;
    console.log('⏹️ Event sync stopped');
  }

  // Manual sync trigger
  static async syncEvents(): Promise<SyncStatus> {
    if (this.status.isRunning) {
      console.log('⏳ Sync already in progress, skipping...');
      return this.status;
    }

    this.status.isRunning = true;
    this.status.errors = [];

    try {
      console.log('🔄 Starting event sync...');
      
      // Sync venues first
      await this.syncVenues();
      
      // Sync events
      await this.syncEventsData();
      
      // Update sync status
      this.status.lastSync = new Date().toISOString();
      this.status.nextSync = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      this.status.syncCount++;
      
      console.log('✅ Event sync completed successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.status.errors.push(errorMessage);
      console.error('❌ Event sync failed:', errorMessage);
    } finally {
      this.status.isRunning = false;
    }

    return this.status;
  }

  // Sync venues from external APIs
  private static async syncVenues(): Promise<void> {
    console.log('📍 Syncing venues...');
    
    // Get all unique cities from existing events
    const { data: events } = await supabase
      .from('events')
      .select('venue_id, venues(city)')
      .not('venue_id', 'is', null);

    const cities = [...new Set(events?.map(e => e.venues?.city).filter(Boolean))] as string[];
    
    // Sync venues for each city
    for (const city of cities) {
      try {
        const venues = await WebSearchService.searchVenues({ city });
        await this.saveVenuesToDatabase(venues);
      } catch (error) {
        console.warn(`Failed to sync venues for ${city}:`, error);
      }
    }
  }

  // Sync events from external APIs
  private static async syncEventsData(): Promise<void> {
    console.log('🎵 Syncing events...');
    
    // Get all unique cities from existing events
    const { data: events } = await supabase
      .from('events')
      .select('venue_id, venues(city)')
      .not('venue_id', 'is', null);

    const cities = [...new Set(events?.map(e => e.venues?.city).filter(Boolean))] as string[];
    
    // Sync events for each city
    for (const city of cities) {
      try {
        const events = await WebSearchService.searchEvents({ 
          city,
          dateFrom: new Date().toISOString().split('T')[0],
          dateTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
        await this.saveEventsToDatabase(events);
      } catch (error) {
        console.warn(`Failed to sync events for ${city}:`, error);
      }
    }
  }

  // Save venues to database
  private static async saveVenuesToDatabase(venues: Venue[]): Promise<void> {
    for (const venue of venues) {
      try {
        const { error } = await supabase
          .from('venues')
          .upsert({
            id: venue.id,
            name: venue.name,
            address: venue.address,
            city: venue.city,
            category: venue.category,
            rating: venue.rating,
            user_ratings_total: venue.userRatingsTotal,
            price_level: venue.priceLevel,
            phone: venue.phone,
            website: venue.website,
            photo_url: venue.photoUrl,
            lat: venue.lat,
            lng: venue.lng,
            features: venue.features,
            opening_hours: venue.openingHours,
            description: venue.description,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.warn(`Failed to save venue ${venue.name}:`, error);
        }
      } catch (error) {
        console.warn(`Error processing venue ${venue.name}:`, error);
      }
    }
  }

  // Save events to database
  private static async saveEventsToDatabase(events: Event[]): Promise<void> {
    for (const event of events) {
      try {
        // First ensure the venue exists
        if (event.venue) {
          await this.saveVenuesToDatabase([event.venue]);
        }

        const { error } = await supabase
          .from('events')
          .upsert({
            id: event.id,
            venue_id: event.venueId,
            title: event.title,
            description: event.description,
            event_date: event.date,
            event_time: event.time,
            duration_minutes: event.duration,
            max_participants: event.maxParticipants,
            current_participants: event.currentParticipants,
            organizer_name: event.organizer,
            organizer_id: event.organizer, // Using organizer name as ID for external events
            price: event.price,
            event_type: event.eventType,
            tags: event.tags,
            is_recurring: event.isRecurring,
            recurring_pattern: event.recurringPattern,
            status: event.status,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.warn(`Failed to save event ${event.title}:`, error);
        }
      } catch (error) {
        console.warn(`Error processing event ${event.title}:`, error);
      }
    }
  }

  // Get sync status
  static getStatus(): SyncStatus {
    return { ...this.status };
  }

  // Clean up old events (older than 30 days)
  static async cleanupOldEvents(): Promise<void> {
    console.log('🧹 Cleaning up old events...');
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { error } = await supabase
      .from('events')
      .delete()
      .lt('event_date', thirtyDaysAgo.toISOString().split('T')[0]);

    if (error) {
      console.error('Failed to cleanup old events:', error);
    } else {
      console.log('✅ Old events cleaned up');
    }
  }

  // Update event status (upcoming -> ongoing -> completed)
  static async updateEventStatuses(): Promise<void> {
    console.log('🔄 Updating event statuses...');
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];

    // Update events that should be ongoing
    const { error: ongoingError } = await supabase
      .from('events')
      .update({ status: 'ongoing' })
      .eq('status', 'upcoming')
      .eq('event_date', today)
      .lte('event_time', currentTime);

    if (ongoingError) {
      console.warn('Failed to update ongoing events:', ongoingError);
    }

    // Update events that should be completed
    const { error: completedError } = await supabase
      .from('events')
      .update({ status: 'completed' })
      .eq('status', 'ongoing')
      .lt('event_date', today);

    if (completedError) {
      console.warn('Failed to update completed events:', completedError);
    }

    console.log('✅ Event statuses updated');
  }

  // Get sync statistics
  static async getSyncStats(): Promise<{
    totalVenues: number;
    totalEvents: number;
    upcomingEvents: number;
    lastSync: string | null;
  }> {
    const [venuesResult, eventsResult, upcomingResult] = await Promise.all([
      supabase.from('venues').select('id', { count: 'exact' }),
      supabase.from('events').select('id', { count: 'exact' }),
      supabase.from('events').select('id', { count: 'exact' }).eq('status', 'upcoming')
    ]);

    return {
      totalVenues: venuesResult.count || 0,
      totalEvents: eventsResult.count || 0,
      upcomingEvents: upcomingResult.count || 0,
      lastSync: this.status.lastSync
    };
  }

  // Initialize sync service
  static async initialize(): Promise<void> {
    console.log('🚀 Initializing Event Sync Service...');
    
    // Start auto-sync
    this.startAutoSync(30); // Every 30 minutes
    
    // Run initial sync
    await this.syncEvents();
    
    // Schedule cleanup and status updates
    setInterval(() => {
      this.cleanupOldEvents();
      this.updateEventStatuses();
    }, 24 * 60 * 60 * 1000); // Daily
    
    console.log('✅ Event Sync Service initialized');
  }
}
