import React, { Component } from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'

import './pagination.css'

export default class PaginationPage extends Component {
  static propTypes = {
    onPageSelected: PropTypes.func,
  }

  state = {
    selectedPage: 1,
  }

  render() {
    return (
      <Pagination
        defaultCurrent={1}
        total={50}
        style={{ width: '320px', marginLeft: '555px', marginTop: '20px' }}
        onChange={this.props.onPageSelected}
      />
    )
  }
}
