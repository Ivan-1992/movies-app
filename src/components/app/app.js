import React, { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Alert } from 'antd'

import FilmCard from '../card'
import SearchPanel from '../search-panel/search-panel'
import PaginationPage from '../pagination/pagination'
import MovieAPIService from '../../services/movie-api-service'
import Tab from '../tabs/tabs'
import { MovieServiceProvider } from '../movie-api-service-context'

import './app.css'

export default class App extends Component {
  movieAPIService = new MovieAPIService()

  state = {
    selectedPage: 1,
    movieName: '',
    tab: 1,
    rated: [],
    genres: [],
  }

  componentDidMount() {
    this.createGuestSession()
    this.getGenre()
    localStorage.clear()
    this.updateGenre()
  }

  createGuestSession() {
    this.movieAPIService.getGuestSession('').then((res) => {
      localStorage.setItem(res.guest_session_id, 1)
    })
  }

  getGenre() {
    this.movieAPIService.getGenre('')
  }

  onPageSelected = (id) => {
    this.setState({
      selectedPage: id,
    })
  }

  changeValue = (event) => {
    this.setState({ movieName: event.target.value })
  }

  changeTab = (key) => {
    this.setState({ tab: key })
    this.movieAPIService.rateMov().then((rated) => {
      this.setState({ rated })
    })
  }

  onGenreLoaded = (genres) => {
    this.setState({ genres })
  }

  updateGenre() {
    this.movieAPIService.toGenre().then(this.onGenreLoaded)
  }

  render() {
    const { tab, genres } = this.state
    const tabChange = tab == 1 ? <SearchPanel changeValue={this.changeValue} /> : null
    return (
      <React.Fragment>
        <Online>
          <MovieServiceProvider value={{ genres: genres }}>
            <Tab changeTab={this.changeTab} />
            {tabChange}
            <FilmCard
              selectedPage={this.state.selectedPage}
              movieName={this.state.movieName}
              tab={this.state.tab}
              rated={this.state.rated}
            />
            <PaginationPage onPageSelected={this.onPageSelected} />
          </MovieServiceProvider>
        </Online>
        <Offline>
          <Alert message="Ошибка: нет сети" type="error" />
        </Offline>
      </React.Fragment>
    )
  }
}
