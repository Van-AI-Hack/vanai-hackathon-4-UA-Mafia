import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Plot from 'react-plotly.js'
import { Persona, SurveyData } from '../utils/dataLoader'
import { DashboardFilters } from './Dashboard'

interface RealDataChartsProps {
  surveyData: SurveyData | null
  personas: Persona[]
  activeTab: string
  filters?: DashboardFilters
  userPersona?: Persona | null
}

const RealDataCharts: React.FC<RealDataChartsProps> = ({ 
  surveyData, 
  personas, 
  activeTab,
  filters,
  userPersona: _userPersona // Reserved for future use in data highlighting
}) => {
  const [chartKey, setChartKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useSimpleCharts, setUseSimpleCharts] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const nodeLabelsRef = useRef<string[]>([])
  
  console.log('RealDataCharts - Data status:', { 
    hasSurveyData: !!surveyData, 
    personasCount: personas?.length, 
    activeTab,
    chartKey,
    isLoading,
    error,
    useSimpleCharts
  })
  
  // Force re-render when activeTab or filters change
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    setChartKey(prev => prev + 1)
    
    // Small delay to ensure proper rendering
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [activeTab, filters])
  
  // Check if any filters are active
  const hasActiveFilters = filters && (
    filters.province || 
    filters.ageGroup || 
    filters.persona || 
    filters.highlightUser
  )

  // Audio control functions for hover events
  const playRadioAudio = () => {
    if (isAudioPlaying) return
    
    try {
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio('/audio/persona-playlists/radio-55-plus-playlist.mp3')
        audioRef.current.loop = true
        audioRef.current.volume = 0.3
      }
      
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true)
        console.log('🎵 Playing radio 55+ playlist on hover')
      }).catch(err => {
        console.error('Audio play failed:', err)
      })
    } catch (err) {
      console.error('Audio setup failed:', err)
    }
  }

  const stopRadioAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsAudioPlaying(false)
      console.log('🔇 Stopped radio 55+ playlist on unhover')
    }
  }

  // Check if hovered element is the radio to 55+ flow
  const isRadioTo55PlusFlow = (point: any) => {
    if (!point) return false
    
    try {
      // Debug: log the point structure to understand it better
      console.log('Hover point:', point)
      
      // Check if we're hovering over a link/flow (not a node)
      // Links have different properties than nodes
      if (point.curveNumber === 0 && point.pointNumber !== undefined) {
        // Check if this is a link by looking for source and target properties
        if (point.source && point.target) {
          console.log('✅ Hovering over a link/flow!')
          console.log('Source:', point.source)
          console.log('Target:', point.target)
          
          // Check if this link goes from "The radio" to "55 Plus"
          const sourceLabel = point.source.label || ''
          const targetLabel = point.target.label || ''
          
          console.log('Source label:', sourceLabel)
          console.log('Target label:', targetLabel)
          
          if (sourceLabel.includes('The radio') && targetLabel.includes('55 Plus')) {
            console.log('✅ Found the radio to 55+ flow!')
            return true
          }
        } else {
          // This is a node, not a link
          console.log('Hovering over a node, not a flow')
        }
      }
      
      return false
    } catch (err) {
      console.error('Error checking flow:', err)
      return false
    }
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Apply filters to survey data
  const getFilteredData = () => {
    if (!surveyData || !filters) {
      console.log('⚠️ No filtering: missing surveyData or filters')
      return surveyData
    }
    if (!filters.province && !filters.ageGroup && !filters.persona) {
      console.log('⚠️ No active filters')
      return surveyData
    }

    console.log('📊 Applying filters:', filters)
    console.log('📊 Available provinces:', surveyData?.demographics?.provinces ? Object.keys(surveyData.demographics.provinces) : 'none')
    console.log('📊 Available age groups:', surveyData?.demographics?.age_groups ? Object.keys(surveyData.demographics.age_groups) : 'none')
    console.log('📊 Available personas:', surveyData?.persona_distribution ? Object.keys(surveyData.persona_distribution) : 'none')

    // Clone the survey data
    const filtered = JSON.parse(JSON.stringify(surveyData))

    // Calculate filter multiplier based on demographics
    let multiplier = 1.0

    if (filters.province && filtered.demographics.provinces) {
      const provinceCount = filtered.demographics.provinces[filters.province] || 0
      const totalProvinceResponses = Object.values(filtered.demographics.provinces).reduce((a, b) => (a as number) + (b as number), 0) as number
      multiplier *= (provinceCount / totalProvinceResponses)
      console.log(`🔍 Province filter: ${filters.province}, count: ${provinceCount}, total: ${totalProvinceResponses}, multiplier: ${multiplier}`)
    }

    if (filters.ageGroup && filtered.demographics.age_groups) {
      const ageCount = filtered.demographics.age_groups[filters.ageGroup] || 0
      const totalAgeResponses = Object.values(filtered.demographics.age_groups).reduce((a, b) => (a as number) + (b as number), 0) as number
      const oldMultiplier = multiplier
      multiplier *= (ageCount / totalAgeResponses)
      console.log(`🔍 Age filter: ${filters.ageGroup}, count: ${ageCount}, total: ${totalAgeResponses}, new multiplier: ${multiplier} (was ${oldMultiplier})`)
    }

    // Persona filter
    if (filters.persona && surveyData.persona_distribution) {
      const personaCount = surveyData.persona_distribution[filters.persona] || 0
      const totalPersonaResponses = Object.values(surveyData.persona_distribution).reduce((a, b) => (a as number) + (b as number), 0) as number
      const oldMultiplier = multiplier
      multiplier *= (personaCount / totalPersonaResponses)
      console.log(`🔍 Persona filter: ${filters.persona}, count: ${personaCount}, total: ${totalPersonaResponses}, new multiplier: ${multiplier} (was ${oldMultiplier})`)
    }

    // Apply multiplier to all data proportionally - NO ROUNDING to preserve exactness
    const applyMultiplier = (obj: any): any => {
      const result: any = {}
      for (const key in obj) {
        if (typeof obj[key] === 'number') {
          // Store exact value, don't round yet
          result[key] = obj[key] * multiplier
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = applyMultiplier(obj[key])
        } else {
          result[key] = obj[key]
        }
      }
      return result
    }

    // Apply to all data sections
    filtered.discovery_methods = applyMultiplier(filtered.discovery_methods)
    filtered.music_relationship = applyMultiplier(filtered.music_relationship)
    filtered.ai_attitudes = applyMultiplier(filtered.ai_attitudes)
    filtered.listening_habits = applyMultiplier(filtered.listening_habits)
    filtered.format_evolution = applyMultiplier(filtered.format_evolution)
    
    // For demographics: 
    // - If filtering BY province only, show only that province
    // - If filtering BY age/persona only, apply multiplier to all provinces
    // - If filtering BY multiple criteria, apply multiplier to all provinces (show intersection)
    console.log('🔍 Province filtering logic:', {
      hasProvince: !!filters.province,
      hasAgeGroup: !!filters.ageGroup,
      hasPersona: !!filters.persona,
      provinceValue: filters.province,
      ageGroupValue: filters.ageGroup,
      personaValue: filters.persona,
      provinceType: typeof filters.province,
      ageGroupType: typeof filters.ageGroup,
      personaType: typeof filters.persona,
      provinceIsNull: filters.province === null,
      ageGroupIsNull: filters.ageGroup === null,
      personaIsNull: filters.persona === null
    })
    
    // Province filtering logic
    if (filtered.demographics?.provinces) {
      const hasProvince = filters.province !== null && filters.province !== undefined
      const hasAge = filters.ageGroup !== null && filters.ageGroup !== undefined
      const hasPersona = filters.persona !== null && filters.persona !== undefined
      
      if (hasProvince && filters.province) {
        // If province filter is active, ALWAYS show only that province
        if (hasAge || hasPersona) {
          // Province + other filters - first apply multiplier to all, then extract selected province
          console.log(`🎯 Province + other filters: showing only ${filters.province} with scaled value`)
          const scaledProvinces = applyMultiplier(filtered.demographics.provinces)
          const scaledValue = Math.round(scaledProvinces[filters.province] || 0)
          filtered.demographics.provinces = {
            [filters.province]: scaledValue
          }
        } else {
          // Only province filter - show just that province with original count
          const baseProvinceCount = surveyData.demographics.provinces[filters.province] || 0
          console.log(`🎯 Province-only filter: showing only ${filters.province} with ${baseProvinceCount} responses`)
          filtered.demographics.provinces = {
            [filters.province]: baseProvinceCount
          }
        }
      } else if ((hasAge || hasPersona) && !hasProvince) {
        // Age/persona only - apply multiplier to all provinces
        console.log('🎯 Age/persona-only filter: scaling all provinces')
        filtered.demographics.provinces = applyMultiplier(filtered.demographics.provinces)
      } else {
        console.log('🎯 No province filtering applied')
      }
    }
    
    // Age groups filtering logic
    if (filtered.demographics?.age_groups) {
      const hasProvince = filters.province !== null && filters.province !== undefined
      const hasAge = filters.ageGroup !== null && filters.ageGroup !== undefined
      const hasPersona = filters.persona !== null && filters.persona !== undefined
      
      if (hasAge && (hasProvince || hasPersona)) {
        // Age + other filters - apply multiplier to all age groups
        filtered.demographics.age_groups = applyMultiplier(filtered.demographics.age_groups)
      } else if (hasAge && !hasProvince && !hasPersona && filters.ageGroup) {
        // Only age filter - show just that age group
        const selectedAgeCount = surveyData.demographics.age_groups[filters.ageGroup] || 0
        filtered.demographics.age_groups = {
          [filters.ageGroup]: selectedAgeCount
        }
      } else if ((hasProvince || hasPersona) && !hasAge) {
        // Province/persona only - apply multiplier to all age groups
        filtered.demographics.age_groups = applyMultiplier(filtered.demographics.age_groups)
      }
    }
    
    // Persona distribution filtering logic
    if (filtered.persona_distribution && surveyData.persona_distribution) {
      const hasProvince = filters.province !== null && filters.province !== undefined
      const hasAge = filters.ageGroup !== null && filters.ageGroup !== undefined
      const hasPersona = filters.persona !== null && filters.persona !== undefined
      
      if (hasPersona && (hasProvince || hasAge)) {
        // Persona + other filters - apply multiplier to all personas
        filtered.persona_distribution = applyMultiplier(filtered.persona_distribution)
      } else if (hasPersona && !hasProvince && !hasAge && filters.persona) {
        // Only persona filter - show just that persona
        const selectedPersonaCount = surveyData.persona_distribution[filters.persona] || 0
        filtered.persona_distribution = {
          [filters.persona]: selectedPersonaCount
        }
      } else if ((hasProvince || hasAge) && !hasPersona) {
        // Province/age only - apply multiplier to all personas
        filtered.persona_distribution = applyMultiplier(filtered.persona_distribution)
      }
    }
    
    // Update total responses (exact calculation, then round)
    filtered.total_responses = Math.round(filtered.total_responses * multiplier)
    
    console.log(`✅ Final multiplier: ${multiplier}, Total responses: ${filtered.total_responses}`)
    
    // Debug: Log the final filtered data structure
    console.log('🔍 Final filtered data:', {
      total_responses: filtered.total_responses,
      provinces: filtered.demographics?.provinces,
      age_groups: filtered.demographics?.age_groups,
      persona_distribution: filtered.persona_distribution,
      ai_attitudes: Object.keys(filtered.ai_attitudes || {}).length > 0 ? 'has data' : 'empty',
      discovery_methods: Object.keys(filtered.discovery_methods || {}).length > 0 ? 'has data' : 'empty'
    })

    return filtered
  }

  const filteredData = getFilteredData()
  
  // Create unique key based on filters to force chart updates
  const filterKey = `${filters?.province || 'all'}-${filters?.ageGroup || 'all'}-${filters?.persona || 'all'}-${chartKey}`
  
  // Debug log for filtering
  console.log('🔍 Filtering:', { 
    filters, 
    hasActiveFilters, 
    originalTotal: surveyData?.total_responses,
    filteredTotal: filteredData?.total_responses,
    filterKey 
  })
  
  if (!surveyData) {
    return (
      <motion.div 
        className="flex items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-cyan-400">Loading real survey data...</div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div 
        className="flex items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-cyan-400">Loading charts...</div>
      </motion.div>
    )
  }

  // Filter indicator banner
  const FilterBanner = () => {
    if (!hasActiveFilters) return null
    
    const originalTotal = surveyData?.total_responses || 0
    const filteredTotal = filteredData?.total_responses || 0
    const percentage = originalTotal > 0 ? ((filteredTotal / originalTotal) * 100).toFixed(1) : 0
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 border border-purple-400/30 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <div className="text-purple-400 mt-1 text-2xl">🔍</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold">Filtered View Active</h4>
              <div className="text-right">
                <div className="text-cyan-400 font-bold text-lg">
                  {filteredTotal} <span className="text-gray-500 text-sm">of</span> {originalTotal}
                </div>
                <div className="text-xs text-gray-400">({percentage}% of responses)</div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {filters?.province && `📍 ${filters.province} • `}
                {filters?.ageGroup && `📅 ${filters.ageGroup} • `}
                {filters?.persona && `👤 ${filters.persona} • `}
                {filters?.highlightUser && "🎯 Your stats highlighted"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ℹ️ Individual charts may show slightly different counts as not all respondents answered every question
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error && !useSimpleCharts) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-64 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-red-400">Error: {error}</div>
        <button 
          onClick={() => setUseSimpleCharts(true)}
          className="px-4 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 transition-colors"
        >
          Use Simple Charts Instead
        </button>
      </motion.div>
    )
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Common Plotly layout configuration
  const getBaseLayout = (title: string) => ({
    title: {
      text: title,
      font: { color: '#00ffff', size: 20, family: 'Arial, sans-serif' }
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#ffffff', family: 'Arial, sans-serif' },
    xaxis: { 
      gridcolor: 'rgba(255,255,255,0.1)',
      color: '#ffffff',
      showgrid: true
    },
    yaxis: { 
      gridcolor: 'rgba(255,255,255,0.1)',
      color: '#ffffff',
      showgrid: true
    },
    margin: { l: 60, r: 60, t: 80, b: 60 },
    showlegend: true,
    legend: {
      font: { color: '#ffffff' },
      bgcolor: 'rgba(0,0,0,0.5)',
      bordercolor: 'rgba(255,255,255,0.2)'
    },
    datarevision: chartKey  // Force Plotly to redraw when filters change
  })

  // Simple chart fallback
  const renderSimpleChart = (title: string, data: Record<string, number>, colors: string[] = []) => {
    const entries = Object.entries(data)
    const total = Object.values(data).reduce((sum, val) => sum + val, 0)
    
    return (
      <motion.div variants={itemVariants} className="cyberpunk-card p-6">
        <h4 className="text-xl font-bold text-white mb-4">{title}</h4>
        <div className="space-y-4">
          {entries.map(([key, value], index) => {
            const percentage = ((value / total) * 100).toFixed(1)
            const color = colors[index % colors.length] || '#00ffff'
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{key}</span>
                  <span className="text-cyan-400 font-bold">{value} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    className="h-3 rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    )
  }

  // Render functions - all as regular functions, no hooks
  const renderDiscoveryPatterns = () => {
    try {
      const discoveryData = filteredData.discovery_methods || {}
      console.log('🔍 Discovery chart data:', { 
        totalDiscovery: Object.values(discoveryData).reduce((a, b) => (a as number) + (b as number), 0),
        methods: Object.keys(discoveryData).length 
      })

      if (useSimpleCharts) {
        return (
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎵 Music Discovery Patterns</h3>
            {renderSimpleChart("Discovery Methods", discoveryData, ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff8000", "#8000ff", "#ff0080", "#00ff80"])}
          </motion.div>
        )
      }

      // Enhanced Sankey diagram with better flow visualization
      const discoveryKeys = Object.keys(discoveryData)
      const discoveryValues = Object.values(discoveryData) as number[]
      // Round float values for display - sum of rounded values
      const roundedValues = discoveryValues.map(v => Math.round(v))
      const totalDiscovery = roundedValues.reduce((a, b) => a + b, 0)
      
      // Create age group distribution from filtered data
      const ageGroupData = filteredData.demographics?.age_groups || {}
      const ageGroups = Object.keys(ageGroupData)
      const ageDistribution = Object.values(ageGroupData).map(v => Math.round(v as number))
      
      // Create meaningful flow: Discovery Methods → Age Groups → Music Relationship
      const allLabels = [
        ...discoveryKeys,
        ...ageGroups,
        'Strong Connection',
        'Casual Listener'
      ]
      
      // Enhanced color palette with cyberpunk theme
      const nodeColors = [
        '#00ffff', '#ff00ff', '#ffff00', '#00ff88', 
        '#ff8800', '#8800ff', '#ff0088', '#00ff00', // Discovery methods
        '#00d4ff', '#ff00d4', '#d4ff00', // Age groups
        '#ff6b6b', '#4ecdc4' // Music relationship
      ]
      
      // Create links showing flow from discovery methods to age groups
      const sources: number[] = []
      const targets: number[] = []
      const values: number[] = []
      const linkColors: string[] = []
      
      // Link discovery methods to age groups (proportional distribution)
      const totalAgeResponses = ageDistribution.reduce((a, b) => a + b, 0)
      discoveryKeys.forEach((_, methodIdx) => {
        const methodValue = roundedValues[methodIdx]
        ageGroups.forEach((_, ageIdx) => {
          const ageTargetIdx = discoveryKeys.length + ageIdx
          const flowValue = Math.round(methodValue * (ageDistribution[ageIdx] / totalAgeResponses))
          
          if (flowValue > 5) { // Only show significant flows
            sources.push(methodIdx)
            targets.push(ageTargetIdx)
            values.push(flowValue)
            linkColors.push(`${nodeColors[methodIdx]}40`) // Add transparency
          }
        })
      })
      
      // Link age groups to music relationship using actual filtered data
      const musicRelationshipData = filteredData.music_relationship || {}
      const musicRelationshipValues = Object.values(musicRelationshipData).map(v => Math.round(v as number))
      const totalMusicResponses = musicRelationshipValues.reduce((a, b) => a + b, 0)
      
      ageGroups.forEach((_, ageIdx) => {
        const ageSourceIdx = discoveryKeys.length + ageIdx
        const strongConnectionIdx = allLabels.length - 2
        const casualListenerIdx = allLabels.length - 1
        
        // Distribute to relationship types based on actual proportions
        const ageValue = ageDistribution[ageIdx]
        const strongRatio = totalMusicResponses > 0 ? 
          (musicRelationshipValues[0] || 0) / totalMusicResponses : 0.7
        const casualRatio = totalMusicResponses > 0 ? 
          (musicRelationshipValues[1] || 0) / totalMusicResponses : 0.3
        
        const strongValue = Math.round(ageValue * strongRatio)
        const casualValue = Math.round(ageValue * casualRatio)
        
        if (strongValue > 0) {
          sources.push(ageSourceIdx)
          targets.push(strongConnectionIdx)
          values.push(strongValue)
          linkColors.push(`${nodeColors[discoveryKeys.length + ageIdx]}40`)
        }
        
        if (casualValue > 0) {
          sources.push(ageSourceIdx)
          targets.push(casualListenerIdx)
          values.push(casualValue)
          linkColors.push(`${nodeColors[discoveryKeys.length + ageIdx]}30`)
        }
      })

      // Store node labels for hover detection
      const nodeLabels = allLabels.map((label, idx) => {
        // Add counts/percentages to labels
        if (idx < discoveryKeys.length) {
          const count = roundedValues[idx]
          const pct = ((count / totalDiscovery) * 100).toFixed(1)
          return `${label}<br>${count} (${pct}%)`
        } else if (idx < discoveryKeys.length + ageGroups.length) {
          const ageIdx = idx - discoveryKeys.length
          return `${label}<br>${ageDistribution[ageIdx]} people`
        }
        return label
      })
      
      // Store the original labels (without formatting) for comparison
      nodeLabelsRef.current = allLabels

      const sankeyData = {
        type: "sankey" as const,
        orientation: "h",
        arrangement: "snap",
        node: {
          pad: 20,
          thickness: 25,
          line: { 
            color: "#00ffff", 
            width: 2 
          },
          label: nodeLabels,
          color: nodeColors,
          hovertemplate: '<b>%{label}</b><br>Total flow: %{value}<extra></extra>',
          hoverlabel: {
            bgcolor: '#1a1a1a',
            bordercolor: '#00ffff',
            font: { color: '#ffffff', size: 14 }
          }
        },
        link: {
          source: sources,
          target: targets,
          value: values,
          color: linkColors,
          hovertemplate: '%{source.label} → %{target.label}<br>Flow: %{value} listeners<extra></extra>',
          hoverlabel: {
            bgcolor: '#1a1a1a',
            bordercolor: '#00ffff',
            font: { color: '#ffffff', size: 12 }
          }
        }
      }

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎵 Music Discovery Patterns</h3>
          
          {/* Sankey Diagram */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">🌊 Discovery Method Flow</h4>
              <div className="flex items-center gap-2">
                {hasActiveFilters && <span className="text-xs px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full">Filtered</span>}
                {isAudioPlaying && (
                  <span className="text-xs px-2 py-1 bg-green-400/20 text-green-400 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Radio 55+ Playing
                  </span>
                )}
                <span className="text-sm text-cyan-400 font-semibold">{totalDiscovery} responses</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Interactive flow diagram showing how different age groups discover music through various methods
              {hasActiveFilters && <span className="text-purple-400"> (showing filtered subset)</span>}
            </p>
            <div className="h-[600px] rounded-lg overflow-hidden border border-cyan-400/30">
              <Plot
                key={`sankey-${filterKey}`}
                data={[sankeyData]}
                layout={{
                  ...getBaseLayout(""),
                  height: 600,
                  margin: { l: 10, r: 10, t: 30, b: 10 },
                  font: { 
                    size: 12, 
                    color: '#ffffff',
                    family: 'Arial, sans-serif'
                  }
                }}
                revision={chartKey}
                config={{ 
                  displayModeBar: true,
                  displaylogo: false,
                  responsive: true,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                  toImageButtonOptions: {
                    format: 'png',
                    filename: 'discovery_method_flow',
                    height: 600,
                    width: 1200,
                    scale: 2
                  }
                }}
                style={{ width: '100%', height: '100%' }}
                onInitialized={(_figure: any, graphDiv: any) => {
                  // Set up hover events on the plotly instance
                  graphDiv.on('plotly_hover', (event: any) => {
                    const point = event.points[0]
                    if (isRadioTo55PlusFlow(point)) {
                      playRadioAudio()
                    }
                  })
                  
                  graphDiv.on('plotly_unhover', () => {
                    stopRadioAudio()
                  })
                  
                  // Add click event as fallback
                  graphDiv.on('plotly_click', (event: any) => {
                    const point = event.points[0]
                    if (isRadioTo55PlusFlow(point)) {
                      if (isAudioPlaying) {
                        stopRadioAudio()
                      } else {
                        playRadioAudio()
                      }
                    }
                  })
                }}
                onError={(err: any) => {
                  console.error('Sankey chart error:', err)
                  setError('Failed to render Sankey chart')
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="text-center p-3 bg-cyan-400/10 rounded border border-cyan-400/30">
                <div className="text-cyan-400 font-bold">📻 Top Method</div>
                <div className="text-white mt-1">Radio (56.8%)</div>
              </div>
              <div className="text-center p-3 bg-purple-400/10 rounded border border-purple-400/30">
                <div className="text-purple-400 font-bold">👥 Largest Age Group</div>
                <div className="text-white mt-1">55+ (40.9%)</div>
              </div>
              <div className="text-center p-3 bg-pink-400/10 rounded border border-pink-400/30">
                <div className="text-pink-400 font-bold">💡 Flow Insight</div>
                <div className="text-white mt-1">Traditional methods dominate</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              💡 Tip: Hover over nodes and links to see detailed flow information. Thicker flows = more listeners.
            </div>
          </motion.div>
        </motion.div>
      )
    } catch (error) {
      console.error('Error in renderDiscoveryPatterns:', error)
      setError('Failed to render Discovery Patterns charts')
      return (
        <motion.div 
          className="flex items-center justify-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-red-400">Error loading Discovery Patterns: {(error as Error).message}</div>
        </motion.div>
      )
    }
  }

  const renderListeningBehavior = () => {
    try {
      const musicRelationship = filteredData.music_relationship || {}
      console.log('🔍 Listening chart data:', { 
        totalResponses: Object.values(musicRelationship).reduce((a, b) => (a as number) + (b as number), 0),
        categories: Object.keys(musicRelationship).length 
      })

      if (useSimpleCharts) {
        // Create meaningful labels for simple charts - USE FILTERED DATA
        const listeningHabits = filteredData.listening_habits || {}
        const meaningfulListeningData = {
          "Commuting": listeningHabits["Q8_Music_listen_time_GRID_1"] || 0,
          "Working/Studying": listeningHabits["Q8_Music_listen_time_GRID_2"] || 0,
          "Exercise": listeningHabits["Q8_Music_listen_time_GRID_3"] || 0,
          "Relaxation": listeningHabits["Q8_Music_listen_time_GRID_4"] || 0,
          "Social Events": listeningHabits["Q8_Music_listen_time_GRID_5"] || 0,
          "Background": listeningHabits["Q8_Music_listen_time_GRID_6"] || 0
        }

        return (
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎧 Listening Behavior Analysis</h3>
            {renderSimpleChart("Daily Listening Activities", meaningfulListeningData, ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"])}
            {renderSimpleChart("Music Relationship", musicRelationship, ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"])}
          </motion.div>
        )
      }

      // Create meaningful data for bubble chart with better positioning and spacing - USE FILTERED DATA!
      const listeningHabits = filteredData.listening_habits || {}
      const listeningActivities = [
        { name: "Commuting", count: Math.round(listeningHabits["Q8_Music_listen_time_GRID_1"] || 0), intensity: 75, category: "Daily", x: 0 },
        { name: "Working/Studying", count: Math.round(listeningHabits["Q8_Music_listen_time_GRID_2"] || 0), intensity: 85, category: "Productive", x: 1 },
        { name: "Exercise", count: Math.round(listeningHabits["Q8_Music_listen_time_GRID_3"] || 0), intensity: 90, category: "Active", x: 2 },
        { name: "Relaxation", count: Math.round(listeningHabits["Q8_Music_listen_time_GRID_4"] || 0), intensity: 65, category: "Leisure", x: 3 },
        { name: "Social Events", count: Math.round(listeningHabits["Q8_Music_listen_time_GRID_5"] || 0), intensity: 60, category: "Social", x: 4 },
        { name: "Background", count: Math.round(listeningHabits["Q8_Music_listen_time_GRID_6"] || 0), intensity: 50, category: "Ambient", x: 5 }
      ].map(activity => ({ ...activity, y: activity.count }))
      
      console.log('📊 Bubble chart activities (using correct keys):', listeningActivities)

      // Create explicit bubble chart data
      const bubbleData = {
        type: "scatter",
        mode: "markers",
        x: listeningActivities.map(activity => activity.x),
        y: listeningActivities.map(activity => activity.y),
        text: listeningActivities.map(activity => activity.name),
        textposition: "top center",
        textfont: { 
          color: "#ffffff", 
          size: 16, 
          family: "Arial, sans-serif",
          bold: true
        },
        marker: {
          size: listeningActivities.map(activity => Math.max(activity.count / 15, 25)),
          sizemode: "diameter",
          sizeref: 1.5,
          color: listeningActivities.map(activity => activity.intensity),
          colorscale: [
            [0, "#ff6b6b"],
            [0.2, "#4ecdc4"], 
            [0.4, "#45b7d1"],
            [0.6, "#96ceb4"],
            [0.8, "#feca57"],
            [1, "#ff9ff3"]
          ],
          showscale: true,
          colorbar: { 
            title: "Listening Intensity",
            titlefont: { color: "#ffffff", size: 14 },
            tickfont: { color: "#ffffff", size: 12 }
          },
          line: { 
            color: "#ffffff", 
            width: 3 
          },
          opacity: 0.85
        },
        hovertemplate: "<b>%{text}</b><br>Responses: %{y}<br>Intensity: %{marker.color}<br>Category: %{customdata}<extra></extra>",
        customdata: listeningActivities.map(activity => activity.category),
        name: "Listening Activities"
      }

      // Add a second trace for music relationship data
      const relationshipData = {
        type: "scatter",
        x: Object.keys(musicRelationship),
        y: Object.values(musicRelationship),
        mode: "markers+text",
        text: Object.keys(musicRelationship),
        textposition: "top center",
        textfont: { color: "#ffffff", size: 12 },
        marker: {
          size: Object.values(musicRelationship).map(val => Math.max((val as number) / 10, 15)),
          color: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"],
          line: { color: "#ffffff", width: 2 }
        },
        hovertemplate: "<b>%{text}</b><br>Responses: %{y}<br>Percentage: %{customdata}%<extra></extra>",
        customdata: Object.values(musicRelationship).map(val => ((val as number) / (filteredData.total_responses || 1006) * 100).toFixed(1)),
        name: "Music Relationship"
      }

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎧 Listening Behavior Analysis</h3>

          {/* Listening Activities Bubble Chart */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">🫧 Listening Activities by Intensity</h4>
              <div className="flex items-center gap-2">
                {hasActiveFilters && <span className="text-xs px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full">Filtered</span>}
                <span className="text-sm text-cyan-400 font-semibold">Multi-metric</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Bubble size represents number of responses, color indicates listening intensity
              {hasActiveFilters && <span className="text-purple-400"> (showing filtered subset)</span>}
            </p>
            <div className="h-[550px] rounded-lg overflow-hidden border border-cyan-400/30">
              <Plot
                key={`bubble-${filterKey}`}
                data={[bubbleData]}
                layout={{
                  ...getBaseLayout(""),
                  height: 550,
                  xaxis: { 
                    title: "Activity Type",
                    titlefont: { size: 14, color: '#00ffff' },
                    tickmode: "array",
                    tickvals: [0, 1, 2, 3, 4, 5],
                    ticktext: ["Commuting", "Working/Studying", "Exercise", "Relaxation", "Social Events", "Background"],
                    tickangle: -45,
                    showgrid: true,
                    gridcolor: "rgba(0,255,255,0.15)",
                    zeroline: false,
                    showline: true,
                    linecolor: "rgba(0,255,255,0.5)",
                    linewidth: 2,
                    range: [-0.5, 5.5]
                  },
                  yaxis: { 
                    title: "Number of Responses",
                    titlefont: { size: 14, color: '#00ffff' },
                    showgrid: true,
                    gridcolor: "rgba(0,255,255,0.15)",
                    zeroline: false,
                    showline: true,
                    linecolor: "rgba(0,255,255,0.5)",
                    linewidth: 2,
                    range: [0, 800]
                  },
                  margin: { l: 80, r: 120, t: 40, b: 120 },
                  showlegend: false
                }}
                revision={chartKey}
                config={{ 
                  displayModeBar: true,
                  displaylogo: false,
                  responsive: true,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                  toImageButtonOptions: {
                    format: 'png',
                    filename: 'listening_activities_bubble',
                    height: 550,
                    width: 1000,
                    scale: 2
                  }
                }}
                style={{ width: '100%', height: '100%' }}
                onError={(err: any) => {
                  console.error('Bubble chart error:', err)
                  setError('Failed to render Bubble chart')
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="text-center p-2 bg-cyan-400/10 rounded border border-cyan-400/30">
                <div className="text-cyan-400 font-bold">🎧 Most Popular</div>
                <div className="text-white mt-1">Working/Studying (742)</div>
              </div>
              <div className="text-center p-2 bg-purple-400/10 rounded border border-purple-400/30">
                <div className="text-purple-400 font-bold">🏃 High Intensity</div>
                <div className="text-white mt-1">Exercise (90%)</div>
              </div>
              <div className="text-center p-2 bg-pink-400/10 rounded border border-pink-400/30">
                <div className="text-pink-400 font-bold">📊 Total Activities</div>
                <div className="text-white mt-1">6 Categories</div>
              </div>
            </div>
          </motion.div>

          {/* Music Relationship Scatter Plot */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">💗 Music Relationship Patterns</h4>
              <div className="flex items-center gap-2">
                {hasActiveFilters && <span className="text-xs px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full">Filtered</span>}
                <span className="text-sm text-cyan-400 font-semibold">{Number(Object.values(musicRelationship).reduce((a, b) => (a as number) + (b as number), 0))} responses</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              How Canadians describe their personal connection to music
              {hasActiveFilters && <span className="text-purple-400"> (showing filtered subset)</span>}
            </p>
            <div className="h-[450px] rounded-lg overflow-hidden border border-pink-400/30">
              <Plot
                key={`relationship-${filterKey}`}
                data={[relationshipData]}
                layout={{
                  ...getBaseLayout(""),
                  height: 450,
                  xaxis: { 
                    title: "Relationship Type",
                    titlefont: { size: 14, color: '#ff00ff' },
                    tickangle: -45,
                    showgrid: true,
                    gridcolor: "rgba(255,0,255,0.15)",
                    tickfont: { size: 11 },
                    showline: true,
                    linecolor: "rgba(255,0,255,0.5)",
                    linewidth: 2
                  },
                  yaxis: { 
                    title: "Number of Responses",
                    titlefont: { size: 14, color: '#ff00ff' },
                    showgrid: true,
                    gridcolor: "rgba(255,0,255,0.15)",
                    showline: true,
                    linecolor: "rgba(255,0,255,0.5)",
                    linewidth: 2
                  },
                  margin: { l: 80, r: 80, t: 40, b: 150 }
                }}
                revision={chartKey}
                config={{ 
                  displayModeBar: true,
                  displaylogo: false,
                  responsive: true,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                  toImageButtonOptions: {
                    format: 'png',
                    filename: 'music_relationship_patterns',
                    height: 450,
                    width: 1000,
                    scale: 2
                  }
                }}
                style={{ width: '100%', height: '100%' }}
                onError={(err: any) => {
                  console.error('Relationship chart error:', err)
                  setError('Failed to render Relationship chart')
                }}
              />
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              💡 Tip: Larger bubbles represent stronger engagement levels. Most respondents like music but don't actively follow new releases.
            </div>
          </motion.div>
        </motion.div>
      )
    } catch (error) {
      console.error('Error in renderListeningBehavior:', error)
      setError('Failed to render Listening Behavior charts')
      return (
        <motion.div 
          className="flex items-center justify-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-red-400">Error loading Listening Behavior: {(error as Error).message}</div>
        </motion.div>
      )
    }
  }

  const renderAIAttitudes = () => {
    try {
      const aiData = filteredData.ai_attitudes || {}
      console.log('🔍 AI Attitudes chart data:', { 
        totalAI: Object.values(aiData).reduce((a, b) => (a as number) + (b as number), 0),
        attitudes: Object.keys(aiData).length 
      })

      if (useSimpleCharts) {
        return (
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-3xl font-bold text-cyan-400 mb-6">🤖 AI Music Attitudes</h3>
            {renderSimpleChart("AI Attitudes", aiData, ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"])}
          </motion.div>
        )
      }

      // Enhanced donut chart with better visuals
      const aiKeys = Object.keys(aiData)
      const aiValues = Object.values(aiData) as number[]
      const totalAI = Math.round(aiValues.reduce((a, b) => a + b, 0))
      
      const donutData = {
        type: "pie" as const,
        labels: aiKeys,
        values: aiValues,
        hole: 0.45,
        marker: {
          colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"],
          line: { color: "#00ffff", width: 3 }
        },
        textinfo: "label+percent",
        textposition: "auto",
        textfont: {
          size: 13,
          color: '#ffffff',
          family: 'Arial, sans-serif',
          weight: 'bold'
        },
        hovertemplate: '<b>%{label}</b><br>Responses: %{value}<br>Percentage: %{percent}<extra></extra>',
        hoverlabel: {
          bgcolor: '#1a1a1a',
          bordercolor: '#00ffff',
          font: { color: '#ffffff', size: 14 }
        },
        pull: aiValues.map(val => val === Math.max(...aiValues) ? 0.05 : 0)
      }

      const topAttitude = aiKeys[aiValues.indexOf(Math.max(...aiValues))]
      const topPercent = ((Math.max(...aiValues) / totalAI) * 100).toFixed(1)

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">🤖 AI Music Attitudes</h3>

          {/* Donut Chart */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">🍩 AI Attitudes Distribution</h4>
              <div className="flex items-center gap-2">
                {hasActiveFilters && <span className="text-xs px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full">Filtered</span>}
                <span className="text-sm text-cyan-400 font-semibold">{totalAI} responses</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Canadian perspectives on AI-generated music and its future in the industry
              {hasActiveFilters && <span className="text-purple-400"> (showing filtered subset)</span>}
            </p>
            <div className="h-[550px] rounded-lg overflow-hidden border border-green-400/30">
              <Plot
                key={`donut-${filterKey}`}
                data={[donutData]}
                layout={{
                  ...getBaseLayout(""),
                  height: 550,
                  showlegend: true,
                  legend: {
                    orientation: 'h',
                    y: -0.15,
                    x: 0.5,
                    xanchor: 'center',
                    font: { color: '#ffffff', size: 12 }
                  },
                  annotations: [{
                    text: `<b>${totalAI}</b><br>Responses`,
                    x: 0.5,
                    y: 0.5,
                    font: { size: 20, color: '#00ffff', family: 'Arial' },
                    showarrow: false
                  }],
                  margin: { l: 40, r: 40, t: 40, b: 100 }
                }}
                revision={chartKey}
                config={{ 
                  displayModeBar: true,
                  displaylogo: false,
                  responsive: true,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                  toImageButtonOptions: {
                    format: 'png',
                    filename: 'ai_attitudes_donut',
                    height: 550,
                    width: 1000,
                    scale: 2
                  }
                }}
                style={{ width: '100%', height: '100%' }}
                onError={(err: any) => {
                  console.error('Donut chart error:', err)
                  setError('Failed to render Donut chart')
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="text-center p-3 bg-red-400/10 rounded border border-red-400/30">
                <div className="text-red-400 font-bold">🎯 Dominant View</div>
                <div className="text-white mt-1">{topAttitude.substring(0, 30)}...</div>
              </div>
              <div className="text-center p-3 bg-cyan-400/10 rounded border border-cyan-400/30">
                <div className="text-cyan-400 font-bold">📊 Percentage</div>
                <div className="text-white mt-1">{topPercent}% prefer human-made</div>
              </div>
              <div className="text-center p-3 bg-green-400/10 rounded border border-green-400/30">
                <div className="text-green-400 font-bold">🔮 Future Outlook</div>
                <div className="text-white mt-1">Most skeptical of AI music</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              💡 Tip: Click on legend items to show/hide segments. The largest segment is slightly pulled out for emphasis.
            </div>
          </motion.div>
        </motion.div>
      )
    } catch (error) {
      console.error('Error in renderAIAttitudes:', error)
      setError('Failed to render AI Attitudes charts')
      return (
        <motion.div 
          className="flex items-center justify-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-red-400">Error loading AI Attitudes: {(error as Error).message}</div>
        </motion.div>
      )
    }
  }

  const renderDemographics = () => {
    try {
      const demographics = filteredData.demographics || {}
      const ageGroups = demographics.age_groups || {}
      const provinces = demographics.provinces || {}

      if (useSimpleCharts) {
        return (
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-3xl font-bold text-cyan-400 mb-6">👥 Demographic Insights</h3>
            {renderSimpleChart("Age Groups", ageGroups, ["#00ffff", "#ff00ff", "#ffff00"])}
            {renderSimpleChart("Provinces", provinces, ["#4ecdc4", "#45b7d1", "#96ceb4", "#ff6b6b", "#ffa726", "#ab47bc", "#26a69a", "#ff7043", "#42a5f5", "#66bb6a"])}
          </motion.div>
        )
      }

      // Advanced treemap with enhanced visuals
      const provinceKeys = Object.keys(provinces)
      const provinceValues = Object.values(provinces) as number[]
      // Round float values for display
      const roundedProvinceValues = provinceValues.map(v => Math.round(v))
      const totalResponses = roundedProvinceValues.reduce((a, b) => a + b, 0)
      
      console.log('🔍 Treemap input data:', {
        provinces: provinces,
        provinceKeys: provinceKeys,
        provinceValues: provinceValues,
        roundedProvinceValues: roundedProvinceValues
      })
      
      console.log('📊 Treemap data:', { 
        provinceKeys, 
        roundedProvinceValues, 
        totalResponses,
        originalProvinces: surveyData?.demographics?.provinces,
        filteredProvinces: filteredData.demographics?.provinces,
        activeFilters: { province: filters?.province, ageGroup: filters?.ageGroup, persona: filters?.persona }
      })
      
      // Calculate percentages and create custom labels (without province name to avoid duplication)
      const customLabels = provinceKeys.map((_, i) => {
        const count = roundedProvinceValues[i]
        const percentage = ((count / totalResponses) * 100).toFixed(1)
        return `${count} (${percentage}%)`
      })

      // Create custom colors for each province (cyberpunk gradient)
      const provinceColors = roundedProvinceValues.map((value) => {
        const intensity = value / Math.max(...roundedProvinceValues)
        return `rgba(0, 255, 255, ${0.3 + intensity * 0.7})` // Cyan with varying opacity
      })

      const treemapData = {
        type: "treemap" as const,
        labels: provinceKeys,
        parents: provinceKeys.map(() => "Canada"),
        values: roundedProvinceValues,
        text: customLabels,
        textposition: "middle center",
        textfont: {
          size: 14,
          color: '#ffffff',
          family: 'Arial, sans-serif',
          weight: 'bold'
        },
        hovertemplate: '<b>%{label}</b><br>' +
                       'Responses: %{value}<br>' +
                       'Percentage: %{percentParent}<br>' +
                       '<extra></extra>',
        marker: {
          colors: provinceColors,
          line: {
            color: '#00ffff',
            width: 2
          },
          pad: {
            t: 25,
            l: 5,
            r: 5,
            b: 5
          }
        },
        pathbar: {
          visible: false
        }
      }

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">👥 Demographic Insights</h3>

          {/* Treemap */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">🗺️ Provincial Distribution Treemap</h4>
              <div className="text-right">
                <span className="text-sm text-cyan-400 font-semibold">{totalResponses} responses with province data</span>
                <p className="text-xs text-gray-500">({filteredData.total_responses} total survey responses)</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {(() => {
                const hasProvince = filters?.province !== null && filters?.province !== undefined
                const hasAge = filters?.ageGroup !== null && filters?.ageGroup !== undefined
                const hasPersona = filters?.persona !== null && filters?.persona !== undefined
                
                if (hasProvince) {
                  // If province filter is active, always show "only that province" message
                  const filterDesc = (hasAge || hasPersona) ? ' (filtered by selected criteria)' : ''
                  return `Showing ${filters.province} respondents only${filterDesc} (${totalResponses} responses).`
                } else if (hasAge || hasPersona) {
                  return `Showing all provinces filtered by selected criteria (${totalResponses} responses with province data from ${filteredData.total_responses} total filtered responses).`
                } else {
                  return `Interactive visualization of Canadian music survey respondents by province. ${filteredData.total_responses - totalResponses} respondents did not provide province information.`
                }
              })()}
            </p>
            <div className="h-[500px] rounded-lg overflow-hidden border border-cyan-400/30">
              <Plot
                key={`treemap-${filterKey}`}
                data={[treemapData]}
                layout={{
                  ...getBaseLayout(""),
                  height: 500,
                  margin: { t: 30, l: 5, r: 5, b: 5 },
                  treemapcolorway: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'],
                }}
                revision={chartKey}
                config={{ 
                  displayModeBar: true,
                  displaylogo: false,
                  responsive: true,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                  toImageButtonOptions: {
                    format: 'png',
                    filename: 'provincial_distribution_treemap',
                    height: 500,
                    width: 1000,
                    scale: 2
                  }
                }}
                style={{ width: '100%', height: '100%' }}
                onError={(err: any) => {
                  console.error('Treemap chart error:', err)
                  setError('Failed to render Treemap chart')
                }}
              />
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              💡 Tip: Larger blocks represent provinces with more survey responses. Hover for details.
            </div>
          </motion.div>
        </motion.div>
      )
    } catch (error) {
      console.error('Error in renderDemographics:', error)
      setError('Failed to render Demographics charts')
      return (
        <motion.div 
          className="flex items-center justify-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-red-400">Error loading Demographics: {(error as Error).message}</div>
        </motion.div>
      )
    }
  }

  const renderFormatEvolution = () => {
    try {
      const formatData = filteredData.format_evolution || {}
      console.log('🔍 Format Evolution chart data:', { 
        totalFormat: Object.values(formatData).reduce((a, b) => (a as number) + (b as number), 0),
        formats: Object.keys(formatData).length 
      })

      if (useSimpleCharts) {
        return (
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎵 Music Format Evolution</h3>
            {renderSimpleChart("Format Preferences", formatData, ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff8000", "#8000ff"])}
          </motion.div>
        )
      }

      // Enhanced format evolution with bar chart (waterfall can be tricky)
      const formatKeys = Object.keys(formatData)
      const formatValues = Object.values(formatData) as number[]
      // Round float values for display
      const roundedFormatValues = formatValues.map(v => Math.round(v))
      const totalFormat = roundedFormatValues.reduce((a, b) => a + b, 0)
      
      // Shorten long labels for better display
      const shortenedLabels = formatKeys.map(key => {
        if (key.length > 30) {
          return key
            .replace('Digital downloads to streaming (Spotify, Apple Music) 🎧', 'Downloads → Streaming 🎧')
            .replace('CDs to illegal downloads (Napster, LimeWire) 💻', 'CDs → Downloads 💻')
            .replace('Illegal downloads to legal digital (iTunes) 🎵', 'Illegal → iTunes 🎵')
            .replace('8-tracks to cassette tapes', '8-tracks → Cassettes')
            .replace('Vinyl to 8-tracks', 'Vinyl → 8-tracks')
            .replace('Cassettes to CDs 💿', 'Cassettes → CDs 💿')
            .replace("I haven't really experienced a big format change", "No big change")
        }
        return key
      })
      
      // Create a beautiful stacked/grouped visualization
      const formatBarData = {
        type: "bar" as const,
        x: shortenedLabels,
        y: roundedFormatValues,
        marker: {
          color: roundedFormatValues,
          colorscale: [
            [0, '#ff6b6b'],
            [0.25, '#4ecdc4'],
            [0.5, '#00ffff'],
            [0.75, '#ff00ff'],
            [1, '#ffff00']
          ],
          showscale: false,
          line: {
            color: '#00ffff',
            width: 2
          }
        },
        text: roundedFormatValues.map((val) => {
          const pct = ((val / totalFormat) * 100).toFixed(1)
          return `${val}<br>(${pct}%)`
        }),
        textposition: 'outside',
        textfont: {
          size: 13,
          color: '#ffffff',
          weight: 'bold'
        },
        hovertemplate: '<b>%{x}</b><br>Responses: %{y}<br>Percentage: %{customdata}%<extra></extra>',
        customdata: roundedFormatValues.map(val => ((val / totalFormat) * 100).toFixed(1))
      }

      const topFormat = formatKeys[roundedFormatValues.indexOf(Math.max(...roundedFormatValues))]
      const topFormatCount = Math.max(...roundedFormatValues)

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎵 Music Format Evolution</h3>

          {/* Format Evolution Bar Chart */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">💿 Format Evolution Timeline</h4>
              <div className="flex items-center gap-2">
                {hasActiveFilters && <span className="text-xs px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full">Filtered</span>}
                <span className="text-sm text-cyan-400 font-semibold">{totalFormat} transitions</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              How Canadians experienced the evolution of music formats from physical to digital
              {hasActiveFilters && <span className="text-purple-400"> (showing filtered subset)</span>}
            </p>
            <div className="h-[550px] rounded-lg overflow-hidden border border-yellow-400/30">
              <Plot
                key={`format-${filterKey}`}
                data={[formatBarData]}
                layout={{
                  ...getBaseLayout(""),
                  height: 550,
                  xaxis: { 
                    title: "Format Transition",
                    titlefont: { size: 14, color: '#ffff00' },
                    tickangle: -45,
                    showgrid: false,
                    tickfont: { size: 9, color: '#ffffff' },
                    showline: true,
                    linecolor: "rgba(255,255,0,0.5)",
                    linewidth: 2,
                    automargin: true
                  },
                  yaxis: { 
                    title: "Number of Responses",
                    titlefont: { size: 14, color: '#ffff00' },
                    showgrid: true,
                    gridcolor: "rgba(255,255,0,0.15)",
                    showline: true,
                    linecolor: "rgba(255,255,0,0.5)",
                    linewidth: 2,
                    automargin: true
                  },
                  margin: { l: 80, r: 60, t: 40, b: 180 },
                  showlegend: false,
                  bargap: 0.2
                }}
                revision={chartKey}
                config={{ 
                  displayModeBar: true,
                  displaylogo: false,
                  responsive: true,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                  toImageButtonOptions: {
                    format: 'png',
                    filename: 'format_evolution_timeline',
                    height: 550,
                    width: 1200,
                    scale: 2
                  }
                }}
                style={{ width: '100%', height: '100%' }}
                onError={(err: any) => {
                  console.error('Format evolution chart error:', err)
                  setError('Failed to render Format Evolution chart')
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="text-center p-3 bg-yellow-400/10 rounded border border-yellow-400/30">
                <div className="text-yellow-400 font-bold">🎯 Most Common Transition</div>
                <div className="text-white mt-1">{topFormat}</div>
              </div>
              <div className="text-center p-3 bg-cyan-400/10 rounded border border-cyan-400/30">
                <div className="text-cyan-400 font-bold">📊 Top Transition Count</div>
                <div className="text-white mt-1">{topFormatCount} responses</div>
              </div>
              <div className="text-center p-3 bg-purple-400/10 rounded border border-purple-400/30">
                <div className="text-purple-400 font-bold">📈 Total Transitions</div>
                <div className="text-white mt-1">{formatKeys.length} format eras</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              💡 Tip: The color gradient represents the chronological journey from physical to digital formats.
            </div>
          </motion.div>
        </motion.div>
      )
    } catch (error) {
      console.error('Error in renderFormatEvolution:', error)
      setError('Failed to render Format Evolution charts')
      return (
        <motion.div 
          className="flex items-center justify-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-red-400">Error loading Format Evolution: {(error as Error).message}</div>
        </motion.div>
      )
    }
  }

  // Main render logic - no hooks here
  try {
    let chartContent
    switch (activeTab) {
      case 'discovery':
        chartContent = renderDiscoveryPatterns()
        break
      case 'listening':
        chartContent = renderListeningBehavior()
        break
      case 'ai_future':
        chartContent = renderAIAttitudes()
        break
      case 'demographics':
        chartContent = renderDemographics()
        break
      case 'personas':
        chartContent = renderFormatEvolution()
        break
      default:
        chartContent = renderDiscoveryPatterns()
    }

    return (
      <>
        <FilterBanner />
        {chartContent}
      </>
    )
  } catch (error) {
    console.error('Error rendering charts:', error)
    return (
      <motion.div 
        className="flex items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-red-400">Error loading charts: {(error as Error).message}</div>
      </motion.div>
    )
  }
}

export default RealDataCharts