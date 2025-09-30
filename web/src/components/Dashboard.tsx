import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Headphones, 
  Bot, 
  Users, 
  Brain,
  ArrowLeft,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  X,
  MapPin,
  Calendar,
  User,
  Target
} from 'lucide-react'
import { Persona, SurveyData } from '../utils/dataLoader'
import RealDataCharts from './RealDataCharts'
import AIChatInterface from './AIChatInterface'

export interface DashboardFilters {
  province: string | null
  ageGroup: string | null
  persona: string | null
  highlightUser: boolean
}

interface DashboardProps {
  persona: Persona | null
  surveyData: SurveyData | null
  personas: Persona[]
  onBackToResult: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ persona, surveyData, personas, onBackToResult }) => {
  const [activeTab, setActiveTab] = useState('discovery')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<DashboardFilters>({
    province: null,
    ageGroup: null,
    persona: null,
    highlightUser: false
  })

  const tabs = [
    { id: 'discovery', label: 'Discovery Patterns', icon: Search },
    { id: 'listening', label: 'Listening Behavior', icon: Headphones },
    { id: 'ai_future', label: 'AI & Future', icon: Bot },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'personas', label: 'Persona Deep Dive', icon: Brain }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Get available filter options from data
  const provinces = surveyData?.demographics?.provinces ? Object.keys(surveyData.demographics.provinces) : []
  const ageGroups = surveyData?.demographics?.age_groups ? Object.keys(surveyData.demographics.age_groups) : []
  
  // Filter management
  const handleFilterChange = (filterType: keyof DashboardFilters, value: any) => {
    console.log('🎛️ Filter change:', filterType, '=', value)
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      }
      console.log('🎛️ New filters state:', newFilters)
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setFilters({
      province: null,
      ageGroup: null,
      persona: null,
      highlightUser: false
    })
  }

  const activeFilterCount = [
    filters.province,
    filters.ageGroup,
    filters.persona,
    filters.highlightUser
  ].filter(Boolean).length

  const renderTabContent = () => {
    return (
      <RealDataCharts 
        surveyData={surveyData}
        personas={personas}
        activeTab={activeTab}
        filters={filters}
        userPersona={persona}
      />
    )
  }

  const renderLegacyTabContent = () => {
    switch (activeTab) {
      case 'discovery':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Music Discovery Patterns</h3>
            
            {/* Discovery Methods */}
            <div className="cyberpunk-card">
              <h4 className="text-xl font-bold text-white mb-4">Primary Discovery Methods</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { method: 'Radio', percentage: 56.8, count: 571 },
                  { method: 'Friends/Family', percentage: 16.0, count: 161 },
                  { method: 'Streaming Recommendations', percentage: 12.3, count: 124 },
                  { method: 'Social Media', percentage: 8.9, count: 90 },
                  { method: 'Live Events', percentage: 6.0, count: 60 }
                ].map((item, index) => (
                  <motion.div
                    key={item.method}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{item.method}</span>
                      <span className="text-cyan-400 font-bold">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      />
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{item.count} responses</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Regional Variations */}
            <div className="cyberpunk-card">
              <h4 className="text-xl font-bold text-white mb-4">Regional Discovery Patterns</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { region: 'Ontario', radio: 58, streaming: 15, social: 10 },
                  { region: 'BC', radio: 52, streaming: 18, social: 12 },
                  { region: 'Alberta', radio: 55, streaming: 16, social: 11 }
                ].map((region, index) => (
                  <motion.div
                    key={region.region}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-gradient-to-br from-cyan-400/10 to-purple-500/10 border border-cyan-400/20 rounded-lg p-4"
                  >
                    <h5 className="text-lg font-bold text-white mb-3">{region.region}</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Radio</span>
                        <span className="text-cyan-400">{region.radio}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Streaming</span>
                        <span className="text-purple-400">{region.streaming}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Social</span>
                        <span className="text-pink-400">{region.social}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'listening':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Listening Behavior Analysis</h3>
            
            {/* Daily Listening Habits */}
            <div className="cyberpunk-card">
              <h4 className="text-xl font-bold text-white mb-4">Daily Listening Activities</h4>
              <div className="space-y-4">
                {[
                  { activity: 'Commuting', percentage: 78, icon: '🚗' },
                  { activity: 'Working/Studying', percentage: 65, icon: '💻' },
                  { activity: 'Working Out', percentage: 45, icon: '💪' },
                  { activity: 'Cooking', percentage: 38, icon: '👨‍🍳' },
                  { activity: 'Cleaning', percentage: 42, icon: '🧹' },
                  { activity: 'Unwinding', percentage: 89, icon: '😌' }
                ].map((item, index) => (
                  <motion.div
                    key={item.activity}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{item.activity}</span>
                        <span className="text-cyan-400 font-bold">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Music Relationship */}
            <div className="cyberpunk-card">
              <h4 className="text-xl font-bold text-white mb-4">Relationship with Music</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { response: "I'm obsessed with music", percentage: 30.1, color: "from-red-400 to-pink-500" },
                  { response: "I like it but don't keep up", percentage: 43.5, color: "from-blue-400 to-cyan-500" },
                  { response: "Music is background noise", percentage: 18.2, color: "from-gray-400 to-gray-500" },
                  { response: "I enjoy music casually", percentage: 8.2, color: "from-green-400 to-emerald-500" }
                ].map((item, index) => (
                  <motion.div
                    key={item.response}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="2"
                        />
                        <motion.path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          strokeDasharray={`${item.percentage}, 100`}
                          initial={{ strokeDasharray: "0, 100" }}
                          animate={{ strokeDasharray: `${item.percentage}, 100` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f5ff" />
                            <stop offset="100%" stopColor="#8a2be2" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{item.percentage}%</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{item.response}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'ai_future':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">AI & Future Technology</h3>
            
            {/* AI Music Attitudes */}
            <div className="cyberpunk-card">
              <h4 className="text-xl font-bold text-white mb-4">Attitudes Toward AI-Generated Music</h4>
              <div className="space-y-4">
                {[
                  { attitude: "I prefer human-made music", percentage: 64.2, color: "from-red-400 to-red-600" },
                  { attitude: "I'm open to AI-generated music", percentage: 18.5, color: "from-green-400 to-green-600" },
                  { attitude: "I'm neutral about AI music", percentage: 12.3, color: "from-yellow-400 to-yellow-600" },
                  { attitude: "I'm excited about AI possibilities", percentage: 5.0, color: "from-blue-400 to-blue-600" }
                ].map((item, index) => (
                  <motion.div
                    key={item.attitude}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{item.attitude}</span>
                      <span className="text-cyan-400 font-bold">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className={`bg-gradient-to-r ${item.color} h-3 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Voice Cloning */}
            <div className="cyberpunk-card">
              <h4 className="text-xl font-bold text-white mb-4">Feelings About AI Using Deceased Artists' Voices</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { feeling: "Uncomfortable", percentage: 45, icon: "😟" },
                  { feeling: "Neutral", percentage: 25, icon: "😐" },
                  { feeling: "Excited", percentage: 20, icon: "🤖" },
                  { feeling: "Curious", percentage: 10, icon: "🤔" }
                ].map((item, index) => (
                  <motion.div
                    key={item.feeling}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4 bg-gradient-to-br from-purple-400/10 to-pink-500/10 border border-purple-400/20 rounded-lg"
                  >
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <h5 className="text-lg font-bold text-white mb-2">{item.feeling}</h5>
                    <div className="text-2xl font-bold text-cyan-400">{item.percentage}%</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'demographics':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Demographic Analysis</h3>
            
            {/* Age Distribution */}
            <div className="cyberpunk-card">
              <h4 className="text-xl font-bold text-white mb-4">Age Group Distribution</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { age: "18-34", percentage: 26.2, count: 264, color: "from-cyan-400 to-blue-500" },
                  { age: "35-54", percentage: 32.9, count: 331, color: "from-purple-400 to-pink-500" },
                  { age: "55+", percentage: 40.9, count: 411, color: "from-green-400 to-emerald-500" }
                ].map((item, index) => (
                  <motion.div
                    key={item.age}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-32 h-32 mx-auto mb-4 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center`}>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{item.percentage}%</div>
                        <div className="text-sm text-white/80">{item.count} people</div>
                      </div>
                    </div>
                    <h5 className="text-xl font-bold text-white">{item.age}</h5>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="cyberpunk-card">
              <h4 className="text-xl font-bold text-white mb-4">Provincial Distribution</h4>
              <div className="space-y-3">
                {[
                  { province: "Ontario", percentage: 48.3, count: 486 },
                  { province: "British Columbia", percentage: 16.6, count: 167 },
                  { province: "Alberta", percentage: 12.6, count: 127 },
                  { province: "Quebec", percentage: 8.2, count: 82 },
                  { province: "Other", percentage: 14.3, count: 144 }
                ].map((item, index) => (
                  <motion.div
                    key={item.province}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600"
                  >
                    <span className="text-white font-medium">{item.province}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-cyan-400 font-bold">{item.percentage}%</span>
                      <span className="text-gray-400 text-sm">({item.count})</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'personas':
        return (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Persona Deep Dive</h3>
            
            {persona && (
              <div className="cyberpunk-card" style={{ borderColor: persona.color }}>
                <h4 className="text-xl font-bold text-white mb-4">Your Persona: {persona.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-bold text-cyan-400 mb-3">Characteristics</h5>
                    <div className="space-y-2">
                      {persona.traits.map((trait, index) => (
                        <motion.div
                          key={trait}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          <span className="text-white">{trait}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-cyan-400 mb-3">Profile Details</h5>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-400">Discovery:</span> <span className="text-white">{persona.characteristics.discovery_method.top_response}</span></div>
                      <div><span className="text-gray-400">Relationship:</span> <span className="text-white">{persona.characteristics.music_relationship.top_response}</span></div>
                      <div><span className="text-gray-400">AI Attitude:</span> <span className="text-white">{persona.characteristics.ai_attitude.top_response}</span></div>
                      <div><span className="text-gray-400">Age Group:</span> <span className="text-white">{persona.characteristics.age_group.top_response}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Personas Overview */}
            <div className="cyberpunk-card">
              <h4 className="text-xl font-bold text-white mb-4">All Canadian Music Personas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Radio Traditionalist", percentage: 25.4, color: "#FF6B6B" },
                  { name: "Eclectic Explorer", percentage: 22.3, color: "#4ECDC4" },
                  { name: "Traditional Enthusiast", percentage: 20.1, color: "#45B7D1" },
                  { name: "Social Discoverer", percentage: 18.7, color: "#96CEB4" },
                  { name: "Passive Listener", percentage: 13.5, color: "#FFEAA7" }
                ].map((persona, index) => (
                  <motion.div
                    key={persona.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border-2"
                    style={{ borderColor: persona.color, backgroundColor: `${persona.color}10` }}
                  >
                    <h5 className="font-bold text-white mb-2">{persona.name}</h5>
                    <div className="text-2xl font-bold mb-2" style={{ color: persona.color }}>{persona.percentage}%</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: persona.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${persona.percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                Canadian Music Analytics
              </h1>
              <p className="text-xl text-gray-400">
                Explore comprehensive insights from 1,006 Canadian music survey responses
              </p>
            </div>
            
            <motion.button
              onClick={onBackToResult}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Result
            </motion.button>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 neon-glow'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-600'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Filter Toggle Button */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-600'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Filter Panel */}
          <AnimatePresence mode="wait">
            {showFilters && (
              <motion.div
                key="filter-panel"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="cyberpunk-card p-6 border-purple-400/30"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Filter className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">Advanced Filters</h3>
                      {activeFilterCount > 0 && (
                        <span className="text-sm text-purple-400">({activeFilterCount} active)</span>
                      )}
                    </div>
                    {activeFilterCount > 0 && (
                      <motion.button
                        onClick={clearAllFilters}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10"
                      >
                        <X className="w-4 h-4" />
                        Clear All
                      </motion.button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Province Filter */}
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        Province
                      </label>
                      <select
                        value={filters.province || ''}
                        onChange={(e) => handleFilterChange('province', e.target.value || null)}
                        className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="">All Provinces</option>
                        {provinces.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>

                    {/* Age Group Filter */}
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="w-4 h-4 text-green-400" />
                        Age Group
                      </label>
                      <select
                        value={filters.ageGroup || ''}
                        onChange={(e) => handleFilterChange('ageGroup', e.target.value || null)}
                        className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="">All Ages</option>
                        {ageGroups.map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>

                    {/* Persona Filter */}
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <User className="w-4 h-4 text-pink-400" />
                        Persona Type
                      </label>
                      <select
                        value={filters.persona || ''}
                        onChange={(e) => handleFilterChange('persona', e.target.value || null)}
                        className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="">All Personas</option>
                        {personas.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Highlight User Toggle */}
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        Highlight Mode
                      </label>
                      <motion.button
                        onClick={() => handleFilterChange('highlightUser', !filters.highlightUser)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-4 py-2 rounded-lg border transition-all ${
                          filters.highlightUser
                            ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
                            : 'bg-gray-800 text-gray-400 border-gray-600 hover:border-yellow-400/50'
                        }`}
                      >
                        {filters.highlightUser ? '✓ Show My Stats' : 'Show My Stats'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {activeFilterCount > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {filters.province && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm">
                          📍 {filters.province}
                          <button onClick={() => handleFilterChange('province', null)} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.ageGroup && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm">
                          📅 {filters.ageGroup}
                          <button onClick={() => handleFilterChange('ageGroup', null)} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.persona && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-pink-400/20 text-pink-400 rounded-full text-sm">
                          👤 {filters.persona}
                          <button onClick={() => handleFilterChange('persona', null)} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.highlightUser && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm">
                          🎯 My Stats Highlighted
                          <button onClick={() => handleFilterChange('highlightUser', false)} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {surveyData && personas.length > 0 ? renderTabContent() : renderLegacyTabContent()}
          </motion.div>
        </motion.div>
      </div>

      {/* AI Chat Interface */}
      {persona && <AIChatInterface persona={persona} />}
    </div>
  )
}

export default Dashboard
