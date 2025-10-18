import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Event, Venue, EventSearchFilters } from '../types/events';
import { EventCard } from './EventCard';
import { EventCreationModal } from './EventCreationModal';
import { WebSearchService } from '../services/webSearchService';
import { EventSyncService } from '../services/eventSyncService';

interface EventBrowserProps {
  userAccessToken: string;
  onBack: () => void;
}

export const EventBrowser: React.FC<EventBrowserProps> = ({
  userAccessToken,
  onBack
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [filters, setFilters] = useState<EventSearchFilters>({
    city: 'Toronto',
    category: 'karaoke',
    eventType: 'karaoke_night'
  });
  const [searchMode, setSearchMode] = useState<'events' | 'venues'>('events');
  const [syncStatus, setSyncStatus] = useState(EventSyncService.getStatus());

  // Load initial data
  useEffect(() => {
    loadData();
    initializeSync();
  }, []);

  const initializeSync = async () => {
    try {
      await EventSyncService.initialize();
      setSyncStatus(EventSyncService.getStatus());
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (searchMode === 'events') {
        const eventsData = await WebSearchService.searchEvents(filters);
        setEvents(eventsData);
      } else {
        const venuesData = await WebSearchService.searchVenues(filters);
        setVenues(venuesData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<EventSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = () => {
    loadData();
  };

  const handleEventCreated = (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
    setIsCreatingEvent(false);
  };

  const handleSaveEvent = async (eventId: string) => {
    try {
      // In a real app, this would call the API
      console.log('Saving event:', eventId);
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleUnsaveEvent = async (eventId: string) => {
    try {
      // In a real app, this would call the API
      console.log('Unsaving event:', eventId);
    } catch (error) {
      console.error('Failed to unsave event:', error);
    }
  };

  const refreshData = async () => {
    WebSearchService.clearCache();
    await loadData();
    await EventSyncService.syncEvents();
    setSyncStatus(EventSyncService.getStatus());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Music Events & Venues</h1>
              <p className="text-gray-600">Discover karaoke nights, concerts, and music venues near you</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setIsCreatingEvent(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              ➕ Create Event
            </button>
          </div>
        </div>

        {/* Sync Status */}
        {syncStatus.lastSync && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span>🔄</span>
              <span>Last sync: {new Date(syncStatus.lastSync).toLocaleString()}</span>
              {syncStatus.isRunning && <span className="text-orange-600">(Syncing...)</span>}
            </div>
          </div>
        )}

        {/* Search Mode Toggle */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
            <button
              onClick={() => setSearchMode('events')}
              className={`px-4 py-2 rounded-md transition-colors ${
                searchMode === 'events'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎵 Events
            </button>
            <button
              onClick={() => setSearchMode('venues')}
              className={`px-4 py-2 rounded-md transition-colors ${
                searchMode === 'venues'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏢 Venues
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange({ city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Toronto"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange({ category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="karaoke">🎤 Karaoke</option>
                <option value="live_music">🎵 Live Music</option>
                <option value="music_cafe">☕ Music Cafe</option>
                <option value="concert_venue">🎪 Concert Venue</option>
                <option value="dance_club">💃 Dance Club</option>
              </select>
            </div>
            
            {searchMode === 'events' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={filters.eventType || ''}
                  onChange={(e) => handleFilterChange({ eventType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="karaoke_night">🎤 Karaoke Night</option>
                  <option value="open_mic">🎵 Open Mic</option>
                  <option value="singing_workshop">🎓 Singing Workshop</option>
                  <option value="music_jam">🎸 Music Jam</option>
                  <option value="concert">🎪 Concert</option>
                  <option value="dance_party">💃 Dance Party</option>
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange({ maxPrice: parseFloat(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 50"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading {searchMode}...</p>
            </div>
          </div>
        ) : (
          <div>
            {searchMode === 'events' ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Events ({events.length})
                  </h2>
                </div>
                
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎵</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search filters or create a new event!</p>
                    <button
                      onClick={() => setIsCreatingEvent(true)}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Create Event
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onSave={handleSaveEvent}
                        onUnsave={handleUnsaveEvent}
                        isSaved={false} // In a real app, this would be determined by saved events
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Venues ({venues.length})
                  </h2>
                </div>
                
                {venues.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏢</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                    <p className="text-gray-600">Try adjusting your search filters!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {venues.map((venue) => (
                      <VenueCard key={venue.id} venue={venue} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Event Creation Modal */}
        <EventCreationModal
          isOpen={isCreatingEvent}
          onClose={() => setIsCreatingEvent(false)}
          onEventCreated={handleEventCreated}
          userAccessToken={userAccessToken}
        />
      </div>
    </div>
  );
};

// Venue Card Component
const VenueCard: React.FC<{ venue: Venue }> = ({ venue }) => {
  const getPriceLevel = (level: Venue['priceLevel']) => {
    return '$'.repeat(level);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{venue.address}</p>
            <p className="text-gray-500 text-sm">{venue.description}</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium">{venue.rating}</span>
              <span className="text-xs text-gray-500">({venue.userRatingsTotal})</span>
            </div>
            <div className="text-sm text-gray-600">{getPriceLevel(venue.priceLevel)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>📍 {venue.city}</span>
          {venue.distance && <span>{venue.distance.toFixed(1)} km away</span>}
        </div>

        {venue.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {venue.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {feature.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
