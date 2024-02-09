import React, { Component } from 'react'
import { Offline } from 'react-detect-offline'
import { Alert } from 'antd'

import SearchPanel from '../search-panel/search-panel'
import MovieAPIService from '../../services/movie-api-service'
import Tab from '../tabs/tabs'
// eslint-disable-next-line import/order
import { MovieServiceProvider } from '../../movie-api-service-context'

import './app.css'
import FilmList from '../film-list/film-list'

export default class App extends Component {
  movieAPIService = new MovieAPIService()

  state = {
    selectedPage: 1,
    movieName: '',
    tab: 1,
    ratedFilms: [],
    genres: [],
    ratedCountPages: 1,
    error: false,
    errorMessage: '',
  }

  componentDidMount() {
    this.createGuestSession()
    this.getGenre()
    this.updateGenre()
  }

  createGuestSession() {
    this.movieAPIService
      .getGuestSession()
      .then((res) => {
        sessionStorage.setItem(res.guest_session_id, 1)
      })
      .catch(this.onError)
  }

  onError = (err) => {
    if (err) this.setState({ error: true, errorMessage: err.message })
  }

  getGenre() {
    this.movieAPIService.getGenre().catch(this.onError)
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
    this.movieAPIService
      .rateMov()
      .then((res) => {
        this.setState({ ratedFilms: res[0], ratedCountPages: res[1] })
      })
      .catch(this.onError)
  }

  onGenreLoaded = (genres) => {
    this.setState({ genres })
  }

  updateGenre() {
    this.movieAPIService.toGenre().then(this.onGenreLoaded)
  }

  render() {
    const { tab, genres, ratedFilms, movieName, selectedPage, ratedCountPages, error, errorMessage } = this.state
    const tabChange = tab == 1 ? <SearchPanel changeValue={this.changeValue} /> : null

    return (
      <React.Fragment>
        <MovieServiceProvider value={{ genres: genres }}>
          <Tab changeTab={this.changeTab} />
          {tabChange}
          <FilmList
            selectedPage={selectedPage}
            movieName={movieName}
            tab={tab}
            ratedFilms={ratedFilms}
            genres={genres}
            movieAPIService={this.movieAPIService}
            onPageSelected={this.onPageSelected}
            ratedCountPages={ratedCountPages}
            error={error}
            errorMessage={errorMessage}
          />
        </MovieServiceProvider>
        <Offline>
          <Alert message="Ошибка: нет сети" type="error" />
        </Offline>
      </React.Fragment>
    )
  }
}
