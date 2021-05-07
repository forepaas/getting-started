import React from 'react'
import PropTypes from 'prop-types'
import FpMeasure from 'forepaas/formatter/FpMeasure'
import FpDimensions from 'forepaas/formatter/FpDimensions'
import FpLoader from 'forepaas/core-ui/loader'
import colorString from 'color-string'

class FpDashBlockGraph extends React.Component {
  getColor (color, opacity) {
    let rgba = colorString.get.rgb(color)
    rgba[3] = opacity
    return 'rgba(' + rgba.join(',') + ')'
  }
  componentDidMount () {
    this.refs.graph.width = '100%'
    this.refs.graph.height = '100%'
    new window.Chart(this.refs.graph, {
      type: 'bar',
      data: {
        labels: this.props.labels,
        datasets: [{
          data: this.props.results,
          borderColor: this.getColor(this.props.color, 0.8),
          borderWidth: this.props.borderWidth || 0,
          backgroundColor: this.getColor(this.props.color, 0.8)
        }]
      },
      options: {
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return this.props.valueFormatter(tooltipItem.yLabel)
            },
            title: (tooltipItem, data) => {
              return this.props.tooltipFormatter(data.labels[tooltipItem[0].index])
            }
          }
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false,
            barThickness: this.props.barWidth || 2,
            maxBarThickness: this.props.barWidth || 2
          }],
          yAxes: [{
            display: false
          }]
        }
      }
    })
  }
  render () {
    return (
      <canvas ref='graph' />
    )
  }
}

FpDashBlockGraph.propTypes = {
  color: PropTypes.string,
  tooltipFormatter: PropTypes.func,
  valueFormatter: PropTypes.func,
  labels: PropTypes.array,
  results: PropTypes.array,
  borderWidth: PropTypes.number,
  barWidth: PropTypes.number
}

class ChartDashBlock extends React.Component {
  constructor (props) {
    super(props)
    this.style = this.props.style || {}
    this.contentStyle = this.props.style || {}
    this.style.height = this.style.height || '100%'
    this.props.chart.options = this.props.chart.options || {}
    this.textColor = {
      color: this.props.chart.options.color || '#FFF'
    }
    this.subtitleColor = {
      color: this.getColor(this.props.chart.options.color, 0.7) || this.getColor('#FFF', 0.7)
    }
    this.contentBackground = {
      backgroundColor: this.props.chart.options.background || '#1975d2'
    }
    this.state = {
      response: null
    }
    this.data = Object.keys(this.props.chart.request.data.fields)[0]
    this.computeMode = this.props.chart.request.data.fields[this.data][0]
    this.value = this.value.bind(this)
    this.evol = this.evol.bind(this)
    this.displayEvol = this.displayEvol.bind(this)
    this.classEvol = this.classEvol.bind(this)
    this.getGraphData = this.getGraphData.bind(this)
    this.getGraphLabels = this.getGraphLabels.bind(this)
    this.tooltipFormatter = this.tooltipFormatter.bind(this)
    this.valueFormatter = this.valueFormatter.bind(this)
    this.evolSymbol = this.evolSymbol.bind(this)
    this.evolState = this.props.chart.options.evolState || false
  }

  componentDidMount () {
    this.graphAxis = new FpDimensions(this.props.chart.request.total.graph)
    this.props.chart.request.compute()
      .then((response) => {
        this.setState({ response: response })
      })
  }

  value (evol) {
    return this.state.response.results[0].data[this.data][this.computeMode][evol || 0].value
  }

  evol () {
    let past = this.value(1)
    let now = this.value(0)
    if (!past && !now) return 0
    if (!past) return 100
    if (!now) return -100
    return 100 * (now - past) / past
  }

  displayEvol () {
    let evol = Math.round(this.evol())
    if (evol > 0) {
      evol = '+' + evol
    }
    return evol + '%'
  }

  evolSymbol () {
    let evol = this.evol()
    if (evol >= 0) {
      return 'fa fa-angle-up'
    }
    return 'fa fa-angle-down'
  }

  classEvol () {
    let evol = this.evol()
    if (!this.evolState) {
      return 'evol'
    }
    if (evol > 0) {
      return 'evol positive'
    } else if (evol < 0) {
      return 'evol negative'
    }
    return ''
  }

  getGraphData () {
    if (!this.state.response.total || !Array.isArray(this.state.response.total.graph)) {
      return []
    }
    return this.state.response.total.graph.map((result) => {
      return result.data[this.data][this.computeMode][0].value
    })
  }

  getGraphLabels () {
    if (!this.state.response.total || !Array.isArray(this.state.response.total.graph)) {
      return []
    }
    return this.state.response.total.graph.map(this.graphAxis.format.bind(this.graphAxis))
  }

  tooltipFormatter (label) {
    if (typeof (label) === 'string') {
      return label
    }
    return this.graphAxis.formatFromTimestamp(label)
  }

  valueFormatter (value) {
    return new FpMeasure(this.data).setValue(value).toString()
  }

  getColor (color, opacity) {
    let rgba = colorString.get.rgb(color)
    rgba[3] = opacity
    return 'rgba(' + rgba.join(',') + ')'
  }

  render () {
    if (!this.state.response) return <FpLoader />
    return (
      <div className='dash-block' style={this.style}>
        <div className='content' style={this.contentBackground}>
          <i className={this.props.chart.options.icon} style={this.iconStyle} />
          <div className='value' style={this.textColor}>{this.valueFormatter(this.value())}</div>
          <div className='text' style={this.subtitleColor}>{this.props.chart.options.text}</div>
          { this.props.chart.request.evol && this.props.chart.request.evol.scale && (
            <div className={this.classEvol()} style={this.textColor}>
              <span>{this.displayEvol()}</span>
              <i className={this.evolSymbol()} />
            </div>
          )}
          <div className='graph'>
            <FpDashBlockGraph
              color={this.props.chart.options.color}
              borderWidth={this.props.chart.options.borderwidth}
              barWidth={this.props.chart.options.barwidth}
              tooltipFormatter={this.tooltipFormatter}
              valueFormatter={this.valueFormatter}
              labels={this.getGraphLabels()}
              results={this.getGraphData()}
            />
          </div>
        </div>
      </div>
    )
  }
}

ChartDashBlock.propTypes = {
  chart: PropTypes.object,
  style: PropTypes.object
}

export default ChartDashBlock
