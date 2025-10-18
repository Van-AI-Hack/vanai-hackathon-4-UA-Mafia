import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, MapPin, Users, Sparkles, TrendingUp, BarChart3, Share2, Facebook, Linkedin, Twitter, MessageCircle, Copy, Check } from 'lucide-react';
import { BuddyPersona } from '../lib/supabase';

interface PersonaComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  myPersona: BuddyPersona;
  otherPersona: BuddyPersona;
  similarity: number;
  sharedTags: string[];
}

export const PersonaComparisonModal: React.FC<PersonaComparisonModalProps> = ({
  isOpen,
  onClose,
  myPersona,
  otherPersona,
  similarity,
  sharedTags
}) => {
  const getPersonaColor = (personaId: number) => {
    const colors = [
      'from-red-500 to-pink-500',      // 0 - Radio Traditionalist
      'from-blue-500 to-cyan-500',    // 1 - Digital Explorer
      'from-green-500 to-emerald-500', // 2 - Casual Listener
      'from-purple-500 to-violet-500', // 3 - Music Obsessive
      'from-orange-500 to-yellow-500'  // 4 - AI Skeptic
    ];
    return colors[personaId] || 'from-gray-500 to-gray-600';
  };

  const getPersonaIcon = (personaId: number) => {
    const icons = ['📻', '💻', '🎧', '🎵', '🤖'];
    return icons[personaId] || '🎵';
  };

  const getPersonaDescription = (personaId: number) => {
    const descriptions = [
      'Prefers traditional radio and classic music discovery methods',
      'Embraces digital platforms and AI-powered music recommendations',
      'Listens to music casually in the background',
      'Passionate about music with deep knowledge and strong opinions',
      'Skeptical of AI music recommendations and prefers human curation'
    ];
    return descriptions[personaId] || 'Music enthusiast';
  };

  const getSimilarityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'Different', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  const similarityInfo = getSimilarityLevel(similarity);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `🎵 Found my music twin! ${myPersona.nickname} and I have ${similarity}% music DNA compatibility! Check out our shared vibes: ${sharedTags.slice(0, 3).join(', ')}`;
  const shareUrl = `${window.location.origin}/match/${myPersona.id}-${otherPersona.id}`;
  const fullShareText = `${shareText}\n\n${shareUrl}`;

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      url: `https://wa.me/?text=${encodeURIComponent(fullShareText)}`
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Music DNA Match',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback to copy to clipboard
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-cyan-400/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Persona Comparison</h2>
                    <p className="text-gray-400">See how your music DNA matches</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Similarity Score */}
              <div className="mb-8 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/30">
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-2xl text-white">
                      {similarity}%
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-400">Match Score</p>
                      <p className={`text-lg font-semibold ${similarityInfo.color}`}>
                        {similarityInfo.level} Match
                      </p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${similarityInfo.bg}`}>
                    <Sparkles className="w-4 h-4" />
                    <span className={`text-sm font-medium ${similarityInfo.color}`}>
                      {similarity >= 80 ? 'Perfect music twins!' : 
                       similarity >= 60 ? 'Great compatibility!' : 
                       similarity >= 40 ? 'Some common ground' : 'Different tastes'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personas Comparison */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* My Persona */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Your Persona
                  </h3>
                  <div className="p-6 bg-slate-800 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPersonaColor(myPersona.persona_id)} flex items-center justify-center text-2xl`}>
                        {getPersonaIcon(myPersona.persona_id)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{myPersona.persona_name}</h4>
                        <p className="text-sm text-gray-400">{myPersona.nickname}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      {getPersonaDescription(myPersona.persona_id)}
                    </p>
                    <div className="space-y-2">
                      {myPersona.city && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{myPersona.city}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Music className="w-4 h-4" />
                        <span>{myPersona.vibe_tags.length} vibe tags</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Persona */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Their Persona
                  </h3>
                  <div className="p-6 bg-slate-800 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPersonaColor(otherPersona.persona_id)} flex items-center justify-center text-2xl`}>
                        {getPersonaIcon(otherPersona.persona_id)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{otherPersona.persona_name}</h4>
                        <p className="text-sm text-gray-400">{otherPersona.nickname}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      {getPersonaDescription(otherPersona.persona_id)}
                    </p>
                    <div className="space-y-2">
                      {otherPersona.city && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{otherPersona.city}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Music className="w-4 h-4" />
                        <span>{otherPersona.vibe_tags.length} vibe tags</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shared Tags */}
              {sharedTags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Shared Music Vibes
                  </h3>
                  <div className="p-6 bg-slate-800 rounded-xl border border-gray-700">
                    <div className="flex flex-wrap gap-3">
                      {sharedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-3">
                      You both share {sharedTags.length} music vibe{sharedTags.length !== 1 ? 's' : ''}!
                    </p>
                  </div>
                </div>
              )}

              {/* Compatibility Analysis */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Compatibility Analysis
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800 rounded-xl border border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">
                        {myPersona.persona_id === otherPersona.persona_id ? '50%' : '0%'}
                      </div>
                      <p className="text-sm text-gray-400">Same Persona Type</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-xl border border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {Math.min(30, sharedTags.length * 10)}%
                      </div>
                      <p className="text-sm text-gray-400">Shared Vibes</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-xl border border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {myPersona.city === otherPersona.city ? '20%' : '0%'}
                      </div>
                      <p className="text-sm text-gray-400">Same City</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/30">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Music Recommendations
                </h3>
                <div className="space-y-2 text-gray-300">
                  {similarity >= 80 && (
                    <p>🎵 You're perfect music twins! Try attending the same concerts or music events together.</p>
                  )}
                  {similarity >= 60 && similarity < 80 && (
                    <p>🎵 Great compatibility! You could discover new music genres from each other.</p>
                  )}
                  {similarity >= 40 && similarity < 60 && (
                    <p>🎵 Some common ground! Try exploring music that bridges your different tastes.</p>
                  )}
                  {similarity < 40 && (
                    <p>🎵 Different tastes! This could be a great opportunity to learn about new music styles.</p>
                  )}
                  {myPersona.city === otherPersona.city && (
                    <p>📍 You're in the same city! Consider meeting up for local music events.</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 mt-8">
                {/* Share Options */}
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 bg-slate-800 rounded-xl border border-gray-700"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-cyan-400" />
                      Share Your Music Match
                    </h4>
                    
                    {/* Native Share (Mobile) */}
                    {typeof navigator.share === 'function' && (
                      <button
                        onClick={handleNativeShare}
                        className="w-full mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-lg transition-colors flex items-center justify-center gap-3"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">Share via Device</span>
                      </button>
                    )}

                    {/* Social Media Options */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {shareOptions.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => handleShare(option.url)}
                          className={`flex items-center gap-3 p-3 rounded-lg text-white transition-colors ${option.color}`}
                        >
                          <option.icon className="w-5 h-5" />
                          <span className="font-medium">{option.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Copy Link */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={fullShareText}
                        readOnly
                        className="flex-1 px-3 py-2 bg-slate-700 border border-gray-600 rounded-lg text-gray-300 text-sm"
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          copied 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                        }`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    {showShareOptions ? 'Hide Share Options' : 'Share Match'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
