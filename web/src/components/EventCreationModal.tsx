import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event, Venue } from '../types/events';
import { EventService } from '../services/eventService';
import { X, Music, Calendar, Clock, Users, DollarSign, MapPin, User, Plus, Tag } from 'lucide-react';

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: Event) => void;
  userAccessToken: string;
}

interface FormData {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  duration: number;
  maxParticipants: number;
  price: number;
  eventType: Event['eventType'];
  tags: string[];
  isRecurring: boolean;
  recurringPattern: 'weekly' | 'monthly';
  venueId: string;
  organizerName: string;
}

const EVENT_TYPES: { value: Event['eventType']; label: string; icon: string }[] = [
  { value: 'karaoke_night', label: 'Karaoke Night', icon: '🎤' },
  { value: 'open_mic', label: 'Open Mic', icon: '🎵' },
  { value: 'singing_workshop', label: 'Singing Workshop', icon: '🎓' },
  { value: 'music_jam', label: 'Music Jam', icon: '🎸' },
  { value: 'concert', label: 'Concert', icon: '🎪' },
  { value: 'dance_party', label: 'Dance Party', icon: '💃' }
];

const DURATION_OPTIONS = [
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
  { value: 300, label: '5 hours' }
];

export const EventCreationModal: React.FC<EventCreationModalProps> = ({
  isOpen,
  onClose,
  onEventCreated
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    duration: 120,
    maxParticipants: 20,
    price: 0,
    eventType: 'karaoke_night',
    tags: [],
    isRecurring: false,
    recurringPattern: 'weekly',
    venueId: '',
    organizerName: ''
  });

  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load venues when modal opens
  useEffect(() => {
    if (isOpen) {
      loadVenues();
    }
  }, [isOpen]);

  const loadVenues = async () => {
    setIsLoading(true);
    try {
      const venuesData = await EventService.searchVenues({});
      setVenues(venuesData);
    } catch (error) {
      console.error('Failed to load venues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventTime) newErrors.eventTime = 'Event time is required';
    if (!formData.venueId) newErrors.venueId = 'Please select a venue';
    if (!formData.organizerName.trim()) newErrors.organizerName = 'Organizer name is required';
    if (formData.maxParticipants < 1) newErrors.maxParticipants = 'Max participants must be at least 1';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';

    // Validate date is not in the past
    const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`);
    if (eventDateTime <= new Date()) {
      newErrors.eventDate = 'Event date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const selectedVenue = venues.find(v => v.id === formData.venueId);
      if (!selectedVenue) {
        throw new Error('Selected venue not found');
      }

      const newEvent: Event = {
        id: `event-${Date.now()}`,
        venueId: formData.venueId,
        venue: selectedVenue,
        title: formData.title,
        description: formData.description,
        date: formData.eventDate,
        time: formData.eventTime,
        duration: formData.duration,
        maxParticipants: formData.maxParticipants,
        currentParticipants: 0,
        organizer: formData.organizerName,
        price: formData.price || undefined,
        eventType: formData.eventType,
        tags: formData.tags,
        isRecurring: formData.isRecurring,
        recurringPattern: formData.recurringPattern,
        status: 'upcoming'
      };

      // In a real app, this would call EventService.createEvent(newEvent, userAccessToken)
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      console.log('Event created successfully:', newEvent);
      
      onEventCreated(newEvent);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        eventDate: '',
        eventTime: '',
        duration: 120,
        maxParticipants: 20,
        price: 0,
        eventType: 'karaoke_night',
        tags: [],
        isRecurring: false,
        recurringPattern: 'weekly',
        venueId: '',
        organizerName: ''
      });
      setTagInput('');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-cyan-400/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl">
                    <Music className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                    <p className="text-gray-400 text-sm">Host your own music event</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Music className="w-4 h-4 text-cyan-400" />
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 ${
                      errors.title ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="e.g., Friday Night Karaoke"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    Event Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {EVENT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('eventType', type.value)}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          formData.eventType === type.value
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                            : 'border-gray-600 hover:border-gray-500 bg-slate-800 text-gray-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Music className="w-4 h-4 text-cyan-400" />
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 ${
                      errors.description ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Describe your event..."
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                      min={getMinDate()}
                      className={`w-full px-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white ${
                        errors.eventDate ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {errors.eventDate && <p className="text-red-400 text-sm mt-1">{errors.eventDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => handleInputChange('eventTime', e.target.value)}
                      className={`w-full px-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white ${
                        errors.eventTime ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {errors.eventTime && <p className="text-red-400 text-sm mt-1">{errors.eventTime}</p>}
                  </div>
                </div>

                {/* Duration and Max Participants */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Duration
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    >
                      {DURATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      Max Participants
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                      className={`w-full px-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white ${
                        errors.maxParticipants ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {errors.maxParticipants && <p className="text-red-400 text-sm mt-1">{errors.maxParticipants}</p>}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    Price (CAD) - Leave 0 for free
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 ${
                      errors.price ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* Venue Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    Venue *
                  </label>
                  {isLoading ? (
                    <div className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-slate-800 text-gray-400">
                      Loading venues...
                    </div>
                  ) : (
                    <select
                      value={formData.venueId}
                      onChange={(e) => handleInputChange('venueId', e.target.value)}
                      className={`w-full px-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white ${
                        errors.venueId ? 'border-red-500' : 'border-gray-600'
                      }`}
                    >
                      <option value="">Select a venue</option>
                      {venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} - {venue.address}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.venueId && <p className="text-red-400 text-sm mt-1">{errors.venueId}</p>}
                </div>

                {/* Organizer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    Your Name (Organizer) *
                  </label>
                  <input
                    type="text"
                    value={formData.organizerName}
                    onChange={(e) => handleInputChange('organizerName', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 ${
                      errors.organizerName ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.organizerName && <p className="text-red-400 text-sm mt-1">{errors.organizerName}</p>}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    Tags (optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                      className="flex-1 px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full flex items-center gap-1 border border-cyan-500/30"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="text-cyan-400 hover:text-cyan-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recurring Options */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isRecurring}
                      onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                      className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-slate-800"
                    />
                    <span className="text-sm font-medium text-gray-300">This is a recurring event</span>
                  </label>
                  {formData.isRecurring && (
                    <div className="mt-2">
                      <select
                        value={formData.recurringPattern}
                        onChange={(e) => handleInputChange('recurringPattern', e.target.value as 'weekly' | 'monthly')}
                        className="px-3 py-2 bg-slate-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
