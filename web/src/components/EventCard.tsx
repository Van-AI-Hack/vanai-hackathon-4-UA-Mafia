import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Event, Venue } from '../types/events';
import { EventService } from '../services/eventService';

interface EventCardProps {
  event: Event;
  onSave?: (eventId: string) => void;
  onUnsave?: (eventId: string) => void;
  isSaved?: boolean;
  showVenueDetails?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSave,
  onUnsave,
  isSaved = false,
  showVenueDetails = true
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      if (isSaved && onUnsave) {
        await onUnsave(event.id);
      } else if (!isSaved && onSave) {
        await onSave(event.id);
      }
    } catch (error) {
      console.error('Failed to save/unsave event:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-CA', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventTypeIcon = (eventType: Event['eventType']) => {
    const icons = {
      karaoke_night: '🎤',
      open_mic: '🎵',
      singing_workshop: '🎓',
      music_jam: '🎸',
      concert: '🎪',
      dance_party: '💃'
    };
    return icons[eventType] || '🎵';
  };

  const getEventTypeColor = (eventType: Event['eventType']) => {
    const colors = {
      karaoke_night: 'bg-pink-100 text-pink-800',
      open_mic: 'bg-blue-100 text-blue-800',
      singing_workshop: 'bg-green-100 text-green-800',
      music_jam: 'bg-purple-100 text-purple-800',
      concert: 'bg-yellow-100 text-yellow-800',
      dance_party: 'bg-red-100 text-red-800'
    };
    return colors[eventType] || 'bg-gray-100 text-gray-800';
  };

  const getPriceLevel = (level: Venue['priceLevel']) => {
    return '$'.repeat(level);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Event Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getEventTypeIcon(event.eventType)}</span>
              <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">{event.description}</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isSaved 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? '...' : isSaved ? '✓ Saved' : 'Save'}
          </button>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📅</span>
            <span className="text-sm text-gray-700">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">🕐</span>
            <span className="text-sm text-gray-700">{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">⏱️</span>
            <span className="text-sm text-gray-700">{event.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">👥</span>
            <span className="text-sm text-gray-700">
              {event.currentParticipants}{event.maxParticipants ? `/${event.maxParticipants}` : ''}
            </span>
          </div>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {event.price && (
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-green-600">${event.price}</span>
                <span className="text-sm text-gray-500">per person</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-medium">{event.venue.rating}</span>
              <span className="text-xs text-gray-500">({event.venue.userRatingsTotal})</span>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
            {event.eventType.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Venue Details */}
        {showVenueDetails && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-lg">🏢</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{event.venue.name}</h4>
                <p className="text-sm text-gray-600 mb-1">{event.venue.address}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{getPriceLevel(event.venue.priceLevel)}</span>
                  {event.venue.distance && (
                    <span>{event.venue.distance.toFixed(1)} km away</span>
                  )}
                  {event.venue.phone && (
                    <span>📞 {event.venue.phone}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Venue Features */}
            {event.venue.features.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {event.venue.features.map((feature, index) => (
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
        )}

        {/* Recurring Badge */}
        {event.isRecurring && (
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
            <span>🔄</span>
            <span>Recurring {event.recurringPattern}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
