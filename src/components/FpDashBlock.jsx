import React from 'react'
import ChartJs from 'chart.js'
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
    new ChartJs(this.refs.graph, {
      type: 'line',
      data: {
        labels: this.props.labels,
        datasets: [{
          data: this.props.results,
          lineTension: 0,
          borderColor: this.getColor(this.props.color, 0.3),
          borderWidth: 1,
          backgroundColor: this.getColor(this.props.color, 0.1)
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
            display: false
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
  results: PropTypes.array
}

class FpDashBlock extends React.Component {
  constructor (props) {
    super(props)
    this.style = this.props.style || {}
    this.style.height = this.style.height || '100%'
    this.props.chart.options = this.props.chart.options || {}
    this.iconStyle = {
      backgroundColor: this.props.chart.options.color
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
      return 'fa fa-long-arrow-up'
    }
    return 'fa fa-long-arrow-down'
  }

  classEvol () {
    let evol = this.evol()
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

  render () {
    if (!this.state.response) return <FpLoader />
    return (
      <div className='dash-block' style={this.style} >
        <div className='icon' style={this.iconStyle}>
          <i className={this.props.chart.options.icon} />
        </div>
        <div className='content'>
          <div className='content-wrapper'>
            <div className='value'>{this.valueFormatter(this.value())}</div>
            <div className='text'>{this.props.chart.options.text}</div>
            { this.props.chart.request.evol && this.props.chart.request.evol.scale && (
              <div className={this.classEvol()}>
                <span>{this.displayEvol()}</span>
                <i className={this.evolSymbol()} />
              </div>
            )}
            <div className='graph'>
              <FpDashBlockGraph
                color={this.props.chart.options.color}
                tooltipFormatter={this.tooltipFormatter}
                valueFormatter={this.valueFormatter}
                labels={this.getGraphLabels()}
                results={this.getGraphData()}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FpDashBlock.propTypes = {
  chart: PropTypes.object,
  style: PropTypes.object
}

export default FpDashBlock
