import React, { Component } from 'react'
import { Pagination } from 'antd'

import './pagination.css'

export default class PaginationPage extends Component {
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
