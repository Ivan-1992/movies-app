import React, { Component } from 'react'
import { Tabs } from 'antd'
import PropTypes from 'prop-types'

const items = [
  {
    key: '1',
    label: 'Search',
  },
  {
    key: '2',
    label: 'Rated',
  },
]

export default class Tab extends Component {
  static propTypes = {
    changeTab: PropTypes.func,
  }

  render() {
    return (
      <Tabs
        defaultActiveKey="1"
        size="large"
        items={items}
        onChange={this.props.changeTab}
        destroyInactiveTabPane={true}
        style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }}
      />
    )
  }
}
