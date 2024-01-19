import React, { Component } from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'

import './search-panel.css'

export default class SearchPanel extends Component {
  static propTypes = {
    changeValue: PropTypes.func,
  }

  state = {
    movieName: null,
  }

  render() {
    return (
      <Input
        placeholder="Type to search..."
        size="small"
        style={{ width: '915px', marginLeft: '230px', marginRight: 'auto' }}
        onChange={debounce(this.props.changeValue, 1500)}
      />
    )
  }
}
