declare module 'react-plotly.js' {
  import { Component } from 'react'
  import { PlotParams } from 'plotly.js'

  interface PlotProps extends Partial<PlotParams> {
    data: any[]
    layout?: any
    config?: any
    frames?: any[]
    useResizeHandler?: boolean
    style?: React.CSSProperties
    className?: string
    onInitialized?: (figure: any, graphDiv: HTMLElement) => void
    onUpdate?: (figure: any, graphDiv: HTMLElement) => void
    onPurge?: (figure: any, graphDiv: HTMLElement) => void
    onError?: (err: any) => void
    divId?: string
    revision?: number
  }

  export default class Plot extends Component<PlotProps> {}
}
