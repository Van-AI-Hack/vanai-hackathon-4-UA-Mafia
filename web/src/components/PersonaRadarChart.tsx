import React from 'react'
import Plot from 'react-plotly.js'
import type { Persona } from '../utils/dataLoader'

interface PersonaRadarChartProps {
  personas: Persona[]
}

const PersonaRadarChart: React.FC<PersonaRadarChartProps> = ({ personas }) => {
  // Create radar chart data
  const radarData = personas.map((persona) => {
    // Convert characteristics to numeric values for radar chart
    const characteristics = [
      persona.characteristics.music_relationship?.top_response || 'Unknown',
      persona.characteristics.discovery_method?.top_response || 'Unknown',
      persona.characteristics.age_group?.top_response || 'Unknown',
      persona.characteristics.ai_attitude?.top_response || 'Unknown'
    ]

    // Create mock scores based on persona characteristics
    const scores = characteristics.map((char) => {
      // Simple scoring based on characteristic type
      if (char.includes('obsessed') || char.includes('open') || char.includes('excited')) return 90
      if (char.includes('like') || char.includes('neutral') || char.includes('18-34')) return 70
      if (char.includes('background') || char.includes('35-54')) return 50
      if (char.includes('prefer') || char.includes('55+')) return 30
      return 60 // default score
    })

    return {
      type: 'scatterpolar',
      r: scores,
      theta: ['Music Relationship', 'Discovery Method', 'Age Group', 'AI Attitude'],
      fill: 'toself',
      name: persona.name,
      line: { color: persona.color, width: 2 },
      marker: { size: 6, color: persona.color },
      hovertemplate: '<b>%{theta}</b><br>Score: %{r}<extra></extra>'
    }
  })

  const layout = {
    title: {
      text: '🎭 Persona Characteristics Radar Chart',
      font: { size: 20, color: '#00f5ff' }
    },
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 100],
        tickfont: { size: 12, color: 'white' },
        gridcolor: 'rgba(255,255,255,0.3)',
        linecolor: 'rgba(255,255,255,0.5)'
      },
      angularaxis: {
        tickfont: { size: 12, color: 'white' },
        gridcolor: 'rgba(255,255,255,0.3)',
        linecolor: 'rgba(255,255,255,0.5)'
      },
      bgcolor: 'rgba(0,0,0,0.8)'
    },
    paper_bgcolor: 'rgba(0,0,0,0.9)',
    plot_bgcolor: 'rgba(0,0,0,0.8)',
    font: { color: 'white' },
    legend: {
      orientation: 'v',
      yanchor: 'top',
      y: 1,
      xanchor: 'left',
      x: 1.02,
      font: { color: 'white', size: 12 }
    },
    width: 600,
    height: 500,
    margin: { l: 60, r: 60, t: 80, b: 60 }
  }

  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png',
      filename: 'persona_radar_chart',
      height: 500,
      width: 600,
      scale: 2
    }
  }

  return (
    <div className="w-full">
      <Plot
        data={radarData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  )
}

export default PersonaRadarChart

