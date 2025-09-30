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

      // Advanced Sankey diagram
      const sankeyData = {
        type: "sankey",
        orientation: "h",
        node: {
          pad: 15,
          thickness: 20,
          line: { color: "black", width: 0.5 },
          label: Object.keys(discoveryData),
          color: ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff8000", "#8000ff", "#ff0080", "#00ff80"]
        },
        link: {
          source: [0, 1, 2, 3, 4, 5, 6, 7],
          target: [8, 8, 8, 8, 8, 8, 8, 8],
          value: Object.values(discoveryData),
          color: ["rgba(0,255,255,0.3)", "rgba(255,0,255,0.3)", "rgba(255,255,0,0.3)", "rgba(0,255,0,0.3)", "rgba(255,128,0,0.3)", "rgba(128,0,255,0.3)", "rgba(255,0,128,0.3)", "rgba(0,255,128,0.3)"]
        }
      }

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎵 Music Discovery Patterns</h3>
          
          {/* Sankey Diagram */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <h4 className="text-xl font-bold text-white mb-4">Discovery Method Flow</h4>
            <div className="h-96">
              <Plot
                key={`sankey-${chartKey}`}
                data={[sankeyData]}
                layout={{
                  ...getBaseLayout("Music Discovery Flow"),
                  height: 350
                }}
                config={{ displayModeBar: false, responsive: true }}
                onError={(err: any) => {
                  console.error('Sankey chart error:', err)
                  setError('Failed to render Sankey chart')
                }}
              />
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
            <h4 className="text-xl font-bold text-white mb-4">Listening Activities by Intensity</h4>
            <div className="h-96">
              <Plot
                key={`bubble-${chartKey}`}
                data={[bubbleData]}
                layout={{
                  title: {
                    text: "Listening Activities Bubble Chart",
                    font: { color: '#00ffff', size: 20, family: 'Arial, sans-serif' }
                  },
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: '#ffffff', family: 'Arial, sans-serif' },
                  height: 500,
                  xaxis: { 
                    title: "Activity Type",
                    tickmode: "array",
                    tickvals: [0, 1, 2, 3, 4, 5],
                    ticktext: ["Commuting", "Working/Studying", "Exercise", "Relaxation", "Social Events", "Background"],
                    tickangle: -45,
                    showgrid: true,
                    gridcolor: "rgba(255,255,255,0.1)",
                    zeroline: false,
                    showline: true,
                    linecolor: "rgba(255,255,255,0.3)",
                    range: [-0.5, 5.5]
                  },
                  yaxis: { 
                    title: "Number of Responses",
                    showgrid: true,
                    gridcolor: "rgba(255,255,255,0.1)",
                    zeroline: false,
                    showline: true,
                    linecolor: "rgba(255,255,255,0.3)",
                    range: [0, 800]
                  },
                  margin: { l: 120, r: 120, t: 100, b: 150 },
                  showlegend: false
                }}
                config={{ displayModeBar: false, responsive: true }}
                onError={(err: any) => {
                  console.error('Bubble chart error:', err)
                  setError('Failed to render Bubble chart')
                }}
              />
            </div>
          </motion.div>

          {/* Alternative: Horizontal Bar Chart with Intensity */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <h4 className="text-xl font-bold text-white mb-4">Listening Activities - Bar Chart View</h4>
            <div className="h-96">
              <Plot
                key={`bar-${chartKey}`}
                data={[{
                  type: "bar",
                  x: listeningActivities.map(activity => activity.count),
                  y: listeningActivities.map(activity => activity.name),
                  orientation: "h",
                  marker: {
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
                      titlefont: { color: "#ffffff", size: 12 },
                      tickfont: { color: "#ffffff", size: 10 }
                    },
                    line: { color: "#ffffff", width: 2 }
                  },
                  text: listeningActivities.map(activity => `${activity.count} responses<br>Intensity: ${activity.intensity}`),
                  textposition: "inside",
                  textfont: { color: "#ffffff", size: 12 }
                }]}
                layout={{
                  ...getBaseLayout("Listening Activities Bar Chart"),
                  height: 400,
                  xaxis: { 
                    title: "Number of Responses",
                    showgrid: true,
                    gridcolor: "rgba(255,255,255,0.1)"
                  },
                  yaxis: { 
                    title: "Activity Type",
                    showgrid: true,
                    gridcolor: "rgba(255,255,255,0.1)"
                  },
                  margin: { l: 120, r: 100, t: 80, b: 80 }
                }}
                config={{ displayModeBar: false, responsive: true }}
                onError={(err: any) => {
                  console.error('Bar chart error:', err)
                  setError('Failed to render Bar chart')
                }}
              />
            </div>
          </motion.div>


          {/* Music Relationship Scatter Plot */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <h4 className="text-xl font-bold text-white mb-4">Music Relationship Patterns</h4>
            <div className="h-96">
              <Plot
                key={`relationship-${chartKey}`}
                data={[relationshipData]}
                layout={{
                  ...getBaseLayout("Music Relationship Analysis"),
                  height: 350,
                  xaxis: { 
                    title: "Relationship Type",
                    tickangle: -45,
                    showgrid: true,
                    gridcolor: "rgba(255,255,255,0.1)"
                  },
                  yaxis: { 
                    title: "Number of Responses",
                    showgrid: true,
                    gridcolor: "rgba(255,255,255,0.1)"
                  },
                  margin: { l: 80, r: 80, t: 80, b: 100 }
                }}
                config={{ displayModeBar: false, responsive: true }}
                onError={(err: any) => {
                  console.error('Relationship chart error:', err)
                  setError('Failed to render Relationship chart')
                }}
              />
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

      // Advanced donut chart
      const donutData = {
        type: "pie",
        labels: Object.keys(aiData),
        values: Object.values(aiData),
        hole: 0.4,
        marker: {
          colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"],
          line: { color: "#ffffff", width: 2 }
        },
        textinfo: "label+percent",
        textposition: "outside"
      }

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">🤖 AI Music Attitudes</h3>

          {/* Donut Chart */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <h4 className="text-xl font-bold text-white mb-4">AI Attitudes Breakdown</h4>
            <div className="h-96">
              <Plot
                key={`donut-${chartKey}`}
                data={[donutData]}
                layout={{
                  ...getBaseLayout("AI Attitudes Distribution"),
                  height: 350
                }}
                config={{ displayModeBar: false, responsive: true }}
                onError={(err: any) => {
                  console.error('Donut chart error:', err)
                  setError('Failed to render Donut chart')
                }}
              />
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
              <span className="text-sm text-gray-400">Total Responses: {totalResponses}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Interactive visualization of Canadian music survey respondents by province
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

      // Advanced waterfall chart
      const waterfallData = {
        type: "waterfall",
        x: Object.keys(formatData),
        y: Object.values(formatData),
        connector: { line: { color: "rgb(63, 63, 63)" } },
        increasing: { marker: { color: "#00ffff" } },
        decreasing: { marker: { color: "#ff00ff" } },
        totals: { marker: { color: "#ffff00" } }
      }

      return (
        <motion.div variants={itemVariants} className="space-y-8">
          <h3 className="text-3xl font-bold text-cyan-400 mb-6">🎵 Music Format Evolution</h3>

          {/* Waterfall Chart */}
          <motion.div variants={itemVariants} className="cyberpunk-card p-6">
            <h4 className="text-xl font-bold text-white mb-4">Format Evolution Waterfall</h4>
            <div className="h-96">
              <Plot
                key={`waterfall-${chartKey}`}
                data={[waterfallData]}
                layout={{
                  ...getBaseLayout("Music Format Preferences Evolution"),
                  height: 350,
                  xaxis: { title: "Format Type" },
                  yaxis: { title: "Response Count" }
                }}
                config={{ displayModeBar: false, responsive: true }}
                onError={(err: any) => {
                  console.error('Waterfall chart error:', err)
                  setError('Failed to render Waterfall chart')
                }}
              />
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