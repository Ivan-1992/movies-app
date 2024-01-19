import React, { Component } from 'react'
import { Tabs } from 'antd'

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
  render() {
    return (
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={this.props.changeTab}
        destroyInactiveTabPane={true}
        style={{ width: '120px', marginLeft: '630px', marginRight: 'auto' }}
      />
    )
  }
}
