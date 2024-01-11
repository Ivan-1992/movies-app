import React, { Component } from 'react'
import { Tabs, Input } from 'antd'
import { debounce } from 'lodash'

import './search-panel.css'

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

export default class SearchPanel extends Component {
  state = {
    movieName: null,
  }

  onChange = (key) => {
    console.log(key)
  }

  render() {
    return (
      <React.Fragment>
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={this.onChange}
          style={{ width: '120px', marginLeft: '630px', marginRight: 'auto' }}
        />
        <Input
          placeholder="Type to search..."
          size="small"
          style={{ width: '915px', marginLeft: '230px', marginRight: 'auto' }}
          onChange={debounce(this.props.changeValue, 1500)}
        />
      </React.Fragment>
    )
  }
}
