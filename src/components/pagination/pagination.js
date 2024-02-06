import React, { Component } from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'

import './pagination.css'

export default class PaginationPage extends Component {
  static propTypes = {
    onPageSelected: PropTypes.func,
  }

  render() {
    return (
      <div className="pagination">
        <Pagination
          defaultCurrent={1}
          total={this.props.pageCount * 10}
          size="small"
          style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}
          onChange={this.props.onPageSelected}
        />
      </div>
    )
  }
}
