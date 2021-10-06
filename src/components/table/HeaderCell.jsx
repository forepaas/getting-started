
import React from 'react'
import { Cell } from 'fixed-data-table-2'
import PropTypes from 'prop-types'

/**
 * Represents the header cell for {@link FpChartTable}
 * Use fixed data table 2 cell component @see https://github.com/schrodinger/fixed-data-table-2
 * for more information
 * @example
 *  <HeaderCell
 *    column={column}
 *    reverse={this.state.reverse}
 *    sortBy={this.state.sortBy}
 *    onSort={this.onSort}
 *    disabledSort={false}
 *    className="example"
 *  >
 *    <div className='column-head'>
 *      <span>Example Header</span>
 *    </div>
 *  </HeaderCell>
 */
class HeaderCell extends React.Component {
  constructor (props) {
    super(props)
    this._onSortChange = this._onSortChange.bind(this)
  }
  _onSortChange (e) {
    e.preventDefault()
    if (this.props.disabledSort) return
    this.props.onSort(this.props.column)
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render () {
    console.log('herererere')
    let className = 'fp-chart-table-hcell fp-chart-table-cell'
    if (this.props.className) {
      className += ` ${this.props.className}`
    }

    let upClass = 'sort-icon'
    let downClass = 'sort-icon'
    if (this.props.sortBy === this.props.column) {
      if (this.props.reverse) {
        upClass += ' active'
      } else {
        downClass += ' active'
      }
    }

    return (
      <Cell className={className}>
        {!this.props.disabledSort &&
          <div onClick={this._onSortChange}>
            {this.props.children}
            <div className='pull-right'>
              <span className={upClass}>↑</span>
              <span className={downClass}>↓</span>
            </div>
          </div>
        }
        {
          this.props.disabledSort &&
          <span>{this.props.children}</span>
        }
      </Cell>
    )
  }
}

HeaderCell.propTypes = {
  disabledSort: PropTypes.bool,
  className: PropTypes.string,
  onSort: PropTypes.func,
  column: PropTypes.shape({
    options: PropTypes.object,
    width: PropTypes.number,
    filter: PropTypes.string,
    edit: PropTypes.bool
  }),
  children: PropTypes.array,
  sortBy: PropTypes.object,
  reverse: PropTypes.bool
}

export default HeaderCell
