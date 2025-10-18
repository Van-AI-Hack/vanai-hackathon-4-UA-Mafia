import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Event, Venue } from '../types/events';
import { EventService } from '../services/eventService';
import { Calendar, Clock, Users, Star, MapPin, Phone, Building, Save, Check } from 'lucide-react';

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
      karaoke_night: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      open_mic: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      singing_workshop: 'bg-green-500/20 text-green-300 border-green-500/30',
      music_jam: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      concert: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      dance_party: 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colors[eventType] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getPriceLevel = (level: Venue['priceLevel']) => {
    return '$'.repeat(level);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyberpunk-card p-6 hover:shadow-xl hover:shadow-cyan-500/10 transition-all"
    >
      {/* Event Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg">
              <span className="text-xl">{getEventTypeIcon(event.eventType)}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{event.title}</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">{event.description}</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            isSaved 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30' 
              : 'bg-slate-800 text-gray-300 border border-gray-600 hover:bg-slate-700 hover:text-white'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : isSaved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}
        </button>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-sm text-gray-300">{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-sm text-gray-300">{formatTime(event.time)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-sm text-gray-300">{event.duration} min</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-sm text-gray-300">
            {event.currentParticipants}{event.maxParticipants ? `/${event.maxParticipants}` : ''}
          </span>
        </div>
      </div>

      {/* Price and Rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          {event.price && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-400">${event.price}</span>
              <span className="text-sm text-gray-400">per person</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">{event.venue.rating}</span>
            <span className="text-xs text-gray-400">({event.venue.userRatingsTotal})</span>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.eventType)}`}>
          {event.eventType.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Tags */}
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Venue Details */}
      {showVenueDetails && (
        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{event.venue.name}</h4>
              <p className="text-sm text-gray-400 mb-2">{event.venue.address}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="text-cyan-400">{getPriceLevel(event.venue.priceLevel)}</span>
                </div>
                {event.venue.distance && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.venue.distance.toFixed(1)} km away</span>
                  </div>
                )}
                {event.venue.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{event.venue.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Venue Features */}
          {event.venue.features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {event.venue.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30"
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
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <div className="w-4 h-4 bg-cyan-500/20 rounded-full flex items-center justify-center">
            <span className="text-cyan-400">🔄</span>
          </div>
          <span>Recurring {event.recurringPattern}</span>
        </div>
      )}
    </motion.div>
  );
};
