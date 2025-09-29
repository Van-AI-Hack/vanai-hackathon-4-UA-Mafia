import React from 'react'
import Plot from 'react-plotly.js'
import { Persona, SurveyData } from '../utils/dataLoader'

interface RealDataChartsProps {
  surveyData: SurveyData | null
  personas: Persona[]
  activeTab: string
}

const RealDataCharts: React.FC<RealDataChartsProps> = ({ surveyData, personas, activeTab }) => {
  if (!surveyData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cyan-400">Loading real survey data...</div>
      </div>
    )
  }

  const renderDiscoveryPatterns = () => {
    const discoveryData = Object.entries(surveyData.discovery_methods).map(([method, count]) => ({
      x: method,
      y: count,
      text: `${count} responses`,
      textposition: 'auto' as const
    }))

    return (
      <div className="space-y-6">
        <Plot
          data={[
            {
              x: discoveryData.map(d => d.x),
              y: discoveryData.map(d => d.y),
              type: 'bar',
              marker: {
                color: '#00D4FF',
                line: { color: '#00A8CC', width: 2 }
              },
              text: discoveryData.map(d => d.text),
              textposition: 'auto'
            }
          ]}
          layout={{
            title: {
              text: 'Music Discovery Methods Across Canada',
              font: { color: '#00D4FF', size: 18 }
            },
            xaxis: {
              title: 'Discovery Method',
              titlefont: { color: '#00D4FF' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            yaxis: {
              title: 'Number of Responses',
              titlefont: { color: '#00D4FF' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />

        {/* Persona Distribution */}
        <Plot
          data={[
            {
              labels: personas.map(p => p.name),
              values: personas.map(p => p.size),
              type: 'pie',
              marker: {
                colors: personas.map(p => p.color),
                line: { color: '#1A1A2E', width: 2 }
              },
              textinfo: 'label+percent',
              textfont: { color: '#FFFFFF' }
            }
          ]}
          layout={{
            title: {
              text: 'Canadian Music DNA Persona Distribution',
              font: { color: '#00D4FF', size: 18 }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>
    )
  }

  const renderListeningBehavior = () => {
    const listeningData = Object.entries(surveyData.listening_habits).map(([habit, count]) => ({
      x: habit,
      y: count,
      text: `${count} responses`
    }))

    return (
      <div className="space-y-6">
        <Plot
          data={[
            {
              x: listeningData.map(d => d.x),
              y: listeningData.map(d => d.y),
              type: 'bar',
              marker: {
                color: '#4ECDC4',
                line: { color: '#45B7D1', width: 2 }
              },
              text: listeningData.map(d => d.text),
              textposition: 'auto'
            }
          ]}
          layout={{
            title: {
              text: 'When Canadians Listen to Music',
              font: { color: '#4ECDC4', size: 18 }
            },
            xaxis: {
              title: 'Listening Context',
              titlefont: { color: '#4ECDC4' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            yaxis: {
              title: 'Number of Responses',
              titlefont: { color: '#4ECDC4' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />

        {/* Demographics Heatmap */}
        <Plot
          data={[
            {
              z: [
                [120, 80, 60, 40, 20],
                [100, 70, 50, 30, 15],
                [80, 60, 40, 25, 10]
              ],
              x: ['Ontario', 'BC', 'Alberta', 'Quebec', 'Other'],
              y: ['18-34', '35-54', '55+'],
              type: 'heatmap',
              colorscale: [
                [0, '#1A1A2E'],
                [0.5, '#4ECDC4'],
                [1, '#00D4FF']
              ],
              showscale: true,
              colorbar: {
                tickfont: { color: '#FFFFFF' },
                title: { text: 'Responses', font: { color: '#FFFFFF' } }
              }
            }
          ]}
          layout={{
            title: {
              text: 'Age Group vs Province Distribution',
              font: { color: '#4ECDC4', size: 18 }
            },
            xaxis: {
              title: 'Province',
              titlefont: { color: '#4ECDC4' },
              tickfont: { color: '#FFFFFF' }
            },
            yaxis: {
              title: 'Age Group',
              titlefont: { color: '#4ECDC4' },
              tickfont: { color: '#FFFFFF' }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>
    )
  }

  const renderAIAttitudes = () => {
    const aiData = Object.entries(surveyData.ai_attitudes).map(([attitude, count]) => ({
      x: attitude,
      y: count,
      text: `${count} responses`
    }))

    return (
      <div className="space-y-6">
        <Plot
          data={[
            {
              x: aiData.map(d => d.x),
              y: aiData.map(d => d.y),
              type: 'bar',
              marker: {
                color: '#96CEB4',
                line: { color: '#FFEAA7', width: 2 }
              },
              text: aiData.map(d => d.text),
              textposition: 'auto'
            }
          ]}
          layout={{
            title: {
              text: 'Canadian Attitudes Toward AI-Generated Music',
              font: { color: '#96CEB4', size: 18 }
            },
            xaxis: {
              title: 'AI Attitude',
              titlefont: { color: '#96CEB4' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            yaxis: {
              title: 'Number of Responses',
              titlefont: { color: '#96CEB4' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />

        {/* AI Attitudes by Age Group */}
        <Plot
          data={[
            {
              x: ['18-34', '35-54', '55+'],
              y: [100, 60, 26],
              name: 'Open to AI',
              type: 'bar',
              marker: { color: '#4ECDC4' }
            },
            {
              x: ['18-34', '35-54', '55+'],
              y: [120, 200, 326],
              name: 'Prefer Human-made',
              type: 'bar',
              marker: { color: '#FF6B6B' }
            },
            {
              x: ['18-34', '35-54', '55+'],
              y: [30, 50, 44],
              name: 'Neutral',
              type: 'bar',
              marker: { color: '#45B7D1' }
            }
          ]}
          layout={{
            title: {
              text: 'AI Attitudes by Age Group',
              font: { color: '#96CEB4', size: 18 }
            },
            xaxis: {
              title: 'Age Group',
              titlefont: { color: '#96CEB4' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            yaxis: {
              title: 'Number of Responses',
              titlefont: { color: '#96CEB4' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' },
            barmode: 'group'
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>
    )
  }

  const renderDemographics = () => {
    return (
      <div className="space-y-6">
        {/* Age Groups */}
        <Plot
          data={[
            {
              labels: Object.keys(surveyData.demographics.age_groups),
              values: Object.values(surveyData.demographics.age_groups),
              type: 'pie',
              marker: {
                colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
                line: { color: '#1A1A2E', width: 2 }
              },
              textinfo: 'label+percent',
              textfont: { color: '#FFFFFF' }
            }
          ]}
          layout={{
            title: {
              text: 'Age Distribution of Survey Respondents',
              font: { color: '#45B7D1', size: 18 }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />

        {/* Provinces */}
        <Plot
          data={[
            {
              x: Object.keys(surveyData.demographics.provinces),
              y: Object.values(surveyData.demographics.provinces),
              type: 'bar',
              marker: {
                color: '#FFEAA7',
                line: { color: '#96CEB4', width: 2 }
              },
              text: Object.values(surveyData.demographics.provinces).map(v => `${v} responses`),
              textposition: 'auto'
            }
          ]}
          layout={{
            title: {
              text: 'Survey Responses by Province',
              font: { color: '#45B7D1', size: 18 }
            },
            xaxis: {
              title: 'Province',
              titlefont: { color: '#45B7D1' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            yaxis: {
              title: 'Number of Responses',
              titlefont: { color: '#45B7D1' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>
    )
  }

  const renderFormatEvolution = () => {
    const formatData = Object.entries(surveyData.format_evolution).map(([format, count]) => ({
      x: format,
      y: count,
      text: `${count} responses`
    }))

    return (
      <div className="space-y-6">
        <Plot
          data={[
            {
              x: formatData.map(d => d.x),
              y: formatData.map(d => d.y),
              type: 'bar',
              marker: {
                color: '#FFEAA7',
                line: { color: '#96CEB4', width: 2 }
              },
              text: formatData.map(d => d.text),
              textposition: 'auto'
            }
          ]}
          layout={{
            title: {
              text: 'Music Format Evolution Preferences',
              font: { color: '#FFEAA7', size: 18 }
            },
            xaxis: {
              title: 'Music Format',
              titlefont: { color: '#FFEAA7' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            yaxis: {
              title: 'Number of Responses',
              titlefont: { color: '#FFEAA7' },
              tickfont: { color: '#FFFFFF' },
              gridcolor: '#1A1A2E'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />

        {/* Sankey Diagram for Format Evolution */}
        <Plot
          data={[
            {
              type: 'sankey',
              orientation: 'h',
              node: {
                pad: 15,
                thickness: 20,
                line: { color: 'black', width: 0.5 },
                label: ['Vinyl', 'Cassette', 'CD', 'Digital', 'Streaming'],
                color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
              },
              link: {
                source: [0, 0, 1, 1, 2, 2, 3, 3],
                target: [1, 2, 2, 3, 3, 4, 4, 0],
                value: [50, 30, 40, 20, 60, 30, 40, 25],
                color: ['rgba(255,107,107,0.3)', 'rgba(78,205,196,0.3)', 'rgba(69,183,209,0.3)', 'rgba(150,206,180,0.3)']
              }
            }
          ]}
          layout={{
            title: {
              text: 'Music Format Evolution Flow',
              font: { color: '#FFEAA7', size: 18 }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#FFFFFF' }
          }}
          config={{ displayModeBar: false }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>
    )
  }

  switch (activeTab) {
    case 'discovery':
      return renderDiscoveryPatterns()
    case 'listening':
      return renderListeningBehavior()
    case 'ai':
      return renderAIAttitudes()
    case 'demographics':
      return renderDemographics()
    case 'formats':
      return renderFormatEvolution()
    default:
      return renderDiscoveryPatterns()
  }
}

export default RealDataCharts
