import React, { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Alert } from 'antd'

import FilmCard from '../card'
import SearchPanel from '../search-panel/search-panel'
import PaginationPage from '../pagination/pagination'

import './app.css'

export default class App extends Component {
  state = {
    selectedPage: 1,
    movieName: '',
  }

  onPageSelected = (id) => {
    this.setState({
      selectedPage: id,
    })
  }

  changeValue = (event) => {
    this.setState({ movieName: event.target.value })
  }

  render() {
    return (
      <React.Fragment>
        <Online>
          <SearchPanel changeValue={this.changeValue} />
          <FilmCard selectedPage={this.state.selectedPage} movieName={this.state.movieName} />
          <PaginationPage onPageSelected={this.onPageSelected} />
        </Online>
        <Offline>
          <Alert message="Ошибка: нет сети" type="error" />
        </Offline>
      </React.Fragment>
    )
  }
}
