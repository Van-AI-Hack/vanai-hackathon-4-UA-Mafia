import React, { useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';
import type { PlotlyHTMLElement } from 'plotly.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RotateCcw, Maximize2, Info } from 'lucide-react';

interface ChartProps {
  data: any;
  layout: any;
  config?: any;
  title: string;
  description?: string;
  className?: string;
}

interface EnhancedChartProps extends ChartProps {
  exportFormats?: ('png' | 'svg')[];
  showControls?: boolean;
  responsive?: boolean;
  animation?: boolean;
}

const EnhancedChart: React.FC<EnhancedChartProps> = ({
  data,
  layout,
  config = {},
  title,
  description,
  className = '',
  exportFormats = ['png', 'svg'],
  showControls = true,
  responsive = true,
  animation = true
}) => {
  const plotRef = useRef<PlotlyHTMLElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  // Enhanced layout with responsive design
  const enhancedLayout = {
    ...layout,
    autosize: responsive,
    responsive: responsive,
    paper_bgcolor: 'rgba(0,0,0,0.9)',
    plot_bgcolor: 'rgba(0,0,0,0.8)',
    font: {
      color: 'white',
      family: 'Inter, system-ui, sans-serif',
      size: 12
    },
    margin: {
      l: 60,
      r: 60,
      t: 80,
      b: 60
    },
    transition: animation ? {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    } : undefined
  };

  // Enhanced config with accessibility and performance
  const enhancedConfig = {
    ...config,
    displayModeBar: showControls,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    modeBarButtonsToAdd: [
      {
        name: 'Download PNG',
        icon: 'camera',
        click: () => exportChart('png')
      },
      {
        name: 'Download SVG',
        icon: 'camera',
        click: () => exportChart('svg')
      }
    ],
    toImageButtonOptions: {
      format: 'png',
      filename: title.toLowerCase().replace(/\s+/g, '_'),
      height: 600,
      width: 1000,
      scale: 2
    },
    locale: 'en',
    displaylogo: false,
    doubleClick: 'reset+autosize'
  };

  const exportChart = (format: 'png' | 'svg') => {
    if (!plotRef.current) return;
    
    const filename = `${title.toLowerCase().replace(/\s+/g, '_')}.${format}`;
    
    Plotly.downloadImage(plotRef.current, {
      format,
      filename,
      height: 600,
      width: 1000
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetView = () => {
    if (!plotRef.current) return;

    Plotly.relayout(plotRef.current, {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
  };

  const handlePlotReady = () => {
    setIsLoading(false);
    setChartError(null);
  };

  const handlePlotError = (error: any) => {
    setIsLoading(false);
    setChartError('Failed to load chart. Please try refreshing the page.');
    console.error('Chart error:', error);
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const controlsVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.2, duration: 0.4 }
    }
  };

  if (chartError) {
    return (
      <motion.div 
        className={`bg-red-900/20 border border-red-500/30 rounded-lg p-6 ${className}`}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-red-400 text-center">
          <Info className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{chartError}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4 ${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Chart Header */}
      <motion.div 
        className="flex items-center justify-between mb-4"
        variants={controlsVariants}
      >
        <div>
          <h3 className="text-xl font-bold text-cyan-400 mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
        
        {showControls && (
          <div className="flex items-center space-x-2">
            {exportFormats.map(format => (
              <motion.button
                key={format}
                onClick={() => exportChart(format)}
                className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`Download as ${format.toUpperCase()}`}
              >
                <Download className="w-4 h-4 text-cyan-400" />
              </motion.button>
            ))}
            
            <motion.button
              onClick={resetView}
              className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
            </motion.button>
            
            <motion.button
              onClick={toggleFullscreen}
              className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-cyan-400" />
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Chart Container */}
      <div className="relative">
        {isLoading && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400">Loading chart...</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={isFullscreen ? 'fullscreen' : 'normal'}
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            <Plot
              data={data}
              layout={enhancedLayout}
              config={enhancedConfig}
              onInitialized={(_, graphDiv) => {
                plotRef.current = graphDiv as PlotlyHTMLElement;
                handlePlotReady();
              }}
              onUpdate={(_, graphDiv) => {
                plotRef.current = graphDiv as PlotlyHTMLElement;
              }}
              onError={handlePlotError}
              style={{ width: '100%', height: isFullscreen ? 'calc(100vh - 8rem)' : '500px' }}
              useResizeHandler={responsive}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Accessibility Info */}
      <motion.div 
        className="mt-4 text-xs text-gray-500"
        variants={controlsVariants}
      >
        <p>
          💡 Tip: Use mouse wheel to zoom, drag to pan, and double-click to reset view. 
          Charts are optimized for screen readers and keyboard navigation.
        </p>
      </motion.div>
    </motion.div>
  );
};

// Specialized chart components
export const PersonaRadarChart: React.FC<{ personas: any[] }> = ({ personas }) => {
  const radarData = personas.map((persona, personaIndex) => ({
    type: 'scatterpolar',
    r: Object.values(persona.characteristics || {}).map((char: any) => 
      char.distribution ? Object.values(char.distribution)[0] as number : 0
    ),
    theta: Object.keys(persona.characteristics || {}).map(key => 
      key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    ),
    fill: 'toself',
    name: persona.name || `Persona ${personaIndex}`,
    line: { color: `hsl(${personaIndex * 72}, 70%, 60%)` },
    marker: { size: 6 }
  }));

  const radarLayout = {
    title: '🎭 Music Persona Characteristics',
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 100],
        tickfont: { size: 12 },
        gridcolor: 'rgba(255,255,255,0.3)'
      },
      angularaxis: {
        tickfont: { size: 12 },
        gridcolor: 'rgba(255,255,255,0.3)'
      },
      bgcolor: 'rgba(0,0,0,0.8)'
    },
    legend: {
      orientation: 'v',
      yanchor: 'top',
      y: 1,
      xanchor: 'left',
      x: 1.02
    }
  };

  return (
    <EnhancedChart
      data={radarData}
      layout={radarLayout}
      title="Persona Radar Analysis"
      description="Interactive radar chart showing persona characteristics across different music behaviors"
      exportFormats={['png', 'svg']}
    />
  );
};

export const DemographicsHeatmap: React.FC<{ data: any }> = ({ data }) => {
  const heatmapData = [{
    type: 'heatmap',
    z: data.z,
    x: data.x,
    y: data.y,
    colorscale: 'Viridis',
    hoverongaps: false,
    hovertemplate: '<b>%{y}</b><br>%{x}<br>Count: %{z}<extra></extra>'
  }];

  const heatmapLayout = {
    title: '🗺️ Demographics Distribution',
    xaxis: { title: 'Province' },
    yaxis: { title: 'Age Group' },
    width: 800,
    height: 500
  };

  return (
    <EnhancedChart
      data={heatmapData}
      layout={heatmapLayout}
      title="Demographics Heatmap"
      description="Interactive heatmap showing distribution of music listeners across age groups and provinces"
      exportFormats={['png', 'svg']}
    />
  );
};

export const MusicDiscoverySunburst: React.FC<{ data: any }> = ({ data }) => {
  const sunburstData = [{
    type: 'sunburst',
    ids: data.ids,
    labels: data.labels,
    parents: data.parents,
    values: data.values,
    branchvalues: 'total',
    hovertemplate: '<b>%{label}</b><br>Count: %{value}<extra></extra>'
  }];

  const sunburstLayout = {
    title: '☀️ Music Discovery Patterns',
    width: 800,
    height: 800
  };

  return (
    <EnhancedChart
      data={sunburstData}
      layout={sunburstLayout}
      title="Discovery Patterns"
      description="Hierarchical sunburst chart showing music discovery methods by age group"
      exportFormats={['png', 'svg']}
    />
  );
};

export default EnhancedChart;
