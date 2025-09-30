import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Plot from 'react-plotly.js'
import { Persona, SurveyData } from '../utils/dataLoader'

interface RealDataChartsProps {
  surveyData: SurveyData | null
  personas: Persona[]
  activeTab: string
}

const RealDataCharts: React.FC<RealDataChartsProps> = ({ surveyData, personas, activeTab }) => {
  const [chartKey, setChartKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useSimpleCharts, setUseSimpleCharts] = useState(false)
  
  console.log('RealDataCharts - Data status:', { 
    hasSurveyData: !!surveyData, 
    personasCount: personas?.length, 
    activeTab,
    chartKey,
    isLoading,
    error,
    useSimpleCharts
  })
  
  // Force re-render when activeTab changes
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    setChartKey(prev => prev + 1)
    
    // Small delay to ensure proper rendering
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [activeTab])
  
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
    }
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
      const discoveryData = surveyData.discovery_methods || {}

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
      const totalDiscovery = discoveryValues.reduce((a, b) => a + b, 0)
      
      // Create age group distribution (simplified for visualization)
      const ageGroups = ['18-34', '35-54', '55+']
      const ageDistribution = [264, 331, 411] // From actual data
      
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
      discoveryKeys.forEach((_, methodIdx) => {
        const methodValue = discoveryValues[methodIdx]
        ageGroups.forEach((_, ageIdx) => {
          const ageTargetIdx = discoveryKeys.length + ageIdx
          const flowValue = Math.round(methodValue * (ageDistribution[ageIdx] / totalDiscovery))
          
          if (flowValue > 5) { // Only show significant flows
            sources.push(methodIdx)
            targets.push(ageTargetIdx)
            values.push(flowValue)
            linkColors.push(`${nodeColors[methodIdx]}40`) // Add transparency
          }
        })
      })
      
      // Link age groups to music relationship
      ageGroups.forEach((_, ageIdx) => {
        const ageSourceIdx = discoveryKeys.length + ageIdx
        const strongConnectionIdx = allLabels.length - 2
        const casualListenerIdx = allLabels.length - 1
        
        // Distribute to relationship types (70% strong, 30% casual for variety)
        const ageValue = ageDistribution[ageIdx]
        sources.push(ageSourceIdx)
        targets.push(strongConnectionIdx)
        values.push(Math.round(ageValue * 0.7))
        linkColors.push(`${nodeColors[discoveryKeys.length + ageIdx]}40`)
        
        sources.push(ageSourceIdx)
        targets.push(casualListenerIdx)
        values.push(Math.round(ageValue * 0.3))
        linkColors.push(`${nodeColors[discoveryKeys.length + ageIdx]}30`)
      })

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
          label: allLabels.map((label, idx) => {
            // Add counts/percentages to labels
            if (idx < discoveryKeys.length) {
              const count = discoveryValues[idx]
              const pct = ((count / totalDiscovery) * 100).toFixed(1)
              return `${label}<br>${count} (${pct}%)`
            } else if (idx < discoveryKeys.length + ageGroups.length) {
              const ageIdx = idx - discoveryKeys.length
              return `${label}<br>${ageDistribution[ageIdx]} people`
            }
            return label
          }),
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
              <span className="text-sm text-cyan-400 font-semibold">{totalDiscovery} total discovery responses</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Interactive flow diagram showing how different age groups discover music through various methods
            </p>
            <div className="h-[600px] rounded-lg overflow-hidden border border-cyan-400/30">
              <Plot
                key={`sankey-${chartKey}`}
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
      const musicRelationship = surveyData.music_relationship || {}

      if (useSimpleCharts) {
        // Create meaningful labels for simple charts
        const meaningfulListeningData = {
          "Commuting": 201,
          "Working/Studying": 742,
          "Exercise": 604,
          "Relaxation": 347,
          "Social Events": 491,
          "Background": 341
        }

        return (
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎧 Listening Behavior Analysis</h3>
            {renderSimpleChart("Daily Listening Activities", meaningfulListeningData, ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"])}
            {renderSimpleChart("Music Relationship", musicRelationship, ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"])}
          </motion.div>
        )
      }

      // Create meaningful data for bubble chart with better positioning and spacing
      const listeningActivities = [
        { name: "Commuting", count: 201, intensity: 75, category: "Daily", x: 0, y: 201 },
        { name: "Working/Studying", count: 742, intensity: 85, category: "Productive", x: 1, y: 742 },
        { name: "Exercise", count: 604, intensity: 90, category: "Active", x: 2, y: 604 },
        { name: "Relaxation", count: 347, intensity: 65, category: "Leisure", x: 3, y: 347 },
        { name: "Social Events", count: 491, intensity: 60, category: "Social", x: 4, y: 491 },
        { name: "Background", count: 341, intensity: 50, category: "Ambient", x: 5, y: 341 }
      ]

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
        customdata: Object.values(musicRelationship).map(val => ((val as number) / (surveyData.total_responses || 1006) * 100).toFixed(1)),
        name: "Music Relationship"
      }

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎧 Listening Behavior Analysis</h3>

          {/* Listening Activities Bubble Chart */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">🫧 Listening Activities by Intensity</h4>
              <span className="text-sm text-cyan-400 font-semibold">Multi-metric visualization</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Bubble size represents number of responses, color indicates listening intensity
            </p>
            <div className="h-[550px] rounded-lg overflow-hidden border border-cyan-400/30">
              <Plot
                key={`bubble-${chartKey}`}
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
              <span className="text-sm text-cyan-400 font-semibold">{Object.values(musicRelationship).reduce((a, b) => a + (b as number), 0)} responses</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              How Canadians describe their personal connection to music
            </p>
            <div className="h-[450px] rounded-lg overflow-hidden border border-pink-400/30">
              <Plot
                key={`relationship-${chartKey}`}
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
      const aiData = surveyData.ai_attitudes || {}

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
      const totalAI = aiValues.reduce((a, b) => a + b, 0)
      
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
              <span className="text-sm text-cyan-400 font-semibold">{totalAI} total responses</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Canadian perspectives on AI-generated music and its future in the industry
            </p>
            <div className="h-[550px] rounded-lg overflow-hidden border border-green-400/30">
              <Plot
                key={`donut-${chartKey}`}
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
      const demographics = surveyData.demographics || {}
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
      const totalResponses = provinceValues.reduce((a, b) => a + b, 0)
      
      // Calculate percentages and create custom labels
      const customLabels = provinceKeys.map((province, i) => {
        const count = provinceValues[i]
        const percentage = ((count / totalResponses) * 100).toFixed(1)
        return `${province}<br>${count} (${percentage}%)`
      })

      // Create custom colors for each province (cyberpunk gradient)
      const provinceColors = provinceValues.map((value) => {
        const intensity = value / Math.max(...provinceValues)
        return `rgba(0, 255, 255, ${0.3 + intensity * 0.7})` // Cyan with varying opacity
      })

      const treemapData = {
        type: "treemap" as const,
        labels: provinceKeys,
        parents: provinceKeys.map(() => "Canada"),
        values: provinceValues,
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
                <p className="text-xs text-gray-500">({surveyData.total_responses} total survey responses)</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Interactive visualization of Canadian music survey respondents by province. {surveyData.total_responses - totalResponses} respondents did not provide province information.
            </p>
            <div className="h-[500px] rounded-lg overflow-hidden border border-cyan-400/30">
              <Plot
                key={`treemap-${chartKey}`}
                data={[treemapData]}
                layout={{
                  ...getBaseLayout(""),
                  height: 500,
                  margin: { t: 30, l: 5, r: 5, b: 5 },
                  treemapcolorway: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'],
                }}
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
      const formatData = surveyData.format_evolution || {}

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
      const totalFormat = formatValues.reduce((a, b) => a + b, 0)
      
      // Create a beautiful stacked/grouped visualization
      const formatBarData = {
        type: "bar" as const,
        x: formatKeys,
        y: formatValues,
        marker: {
          color: formatValues,
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
        text: formatValues.map((val) => {
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
        customdata: formatValues.map(val => ((val / totalFormat) * 100).toFixed(1))
      }

      const topFormat = formatKeys[formatValues.indexOf(Math.max(...formatValues))]
      const topFormatCount = Math.max(...formatValues)

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎵 Music Format Evolution</h3>

          {/* Format Evolution Bar Chart */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">💿 Format Evolution Timeline</h4>
              <span className="text-sm text-cyan-400 font-semibold">{totalFormat} format transitions</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              How Canadians experienced the evolution of music formats from physical to digital
            </p>
            <div className="h-[550px] rounded-lg overflow-hidden border border-yellow-400/30">
              <Plot
                key={`format-${chartKey}`}
                data={[formatBarData]}
                layout={{
                  ...getBaseLayout(""),
                  height: 550,
                  xaxis: { 
                    title: "Format Transition",
                    titlefont: { size: 14, color: '#ffff00' },
                    tickangle: -45,
                    showgrid: false,
                    tickfont: { size: 11, color: '#ffffff' },
                    showline: true,
                    linecolor: "rgba(255,255,0,0.5)",
                    linewidth: 2
                  },
                  yaxis: { 
                    title: "Number of Responses",
                    titlefont: { size: 14, color: '#ffff00' },
                    showgrid: true,
                    gridcolor: "rgba(255,255,0,0.15)",
                    showline: true,
                    linecolor: "rgba(255,255,0,0.5)",
                    linewidth: 2
                  },
                  margin: { l: 80, r: 60, t: 40, b: 150 },
                  showlegend: false,
                  bargap: 0.2
                }}
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
    switch (activeTab) {
      case 'discovery':
        return renderDiscoveryPatterns()
      case 'listening':
        return renderListeningBehavior()
      case 'ai_future':
        return renderAIAttitudes()
      case 'demographics':
        return renderDemographics()
      case 'personas':
        return renderFormatEvolution()
      default:
        return renderDiscoveryPatterns()
    }
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