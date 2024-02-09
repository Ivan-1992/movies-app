import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'

import FilmCard from '../card'
import Spinner from '../spinner'
import ErrorIndicator from '../error-indicator'
import './film-list.css'

export default class FilmList extends Component {
  static defaultProps = {
    movieName: '',
    selectedPage: 1,
    genres: {},
    tab: 1,
    ratedFilms: [],
    ratedCountPages: 1,
  }

  static propTypes = {
    movieName: PropTypes.string,
    selectedPage: PropTypes.number,
    genres: PropTypes.array,
    ratedFilms: PropTypes.array,
    onPageSelected: PropTypes.func,
    ratedCountPages: PropTypes.number,
  }

  state = {
    movies: [],
    loading: true,
    error: false,
    total_pages: 1,
    err: '',
    rating: null,
  }

  componentDidMount() {
    this.updateMovie()
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedPage !== prevProps.selectedPage || this.props.movieName !== prevProps.movieName) {
      this.updateMovie()
    }
    if (this.props.error !== prevProps.error) {
      this.appError()
    }
  }

  onError = (err) => {
    if (err) this.setState({ error: true, loading: false, err: err.message })
  }

  appError = () => {
    const { error, errorMessage } = this.props
    if (error) {
      this.setState({ error: true, loading: false, err: errorMessage })
    }
  }

  onMovieLoaded = (result) => {
    this.setState({ movies: result[0], total_pages: result[1], loading: false, error: false })
  }

  updateMovie() {
    const { movieName, selectedPage } = this.props
    this.props.movieAPIService.getMovie(movieName, selectedPage).then(this.onMovieLoaded).catch(this.onError)
  }

  loaded = (loading) => {
    return loading ? <Spinner /> : null
  }

  hasData = () => {
    const { loading, error } = this.state
    return !(loading || error)
  }

  noMovies = (movies) => {
    return this.hasData() && movies.length === 0 ? <span>Поиск не дал результатов</span> : null
  }

  errorMessage = (error, err) => {
    return error ? <ErrorIndicator err={err} /> : null
  }

  movieRender = (movies) => {
    const { movieAPIService } = this.props
    return movies.map((movie, index) => (
      <FilmCard
        key={index}
        movie={movie}
        movieAPIService={movieAPIService}
        changeRating={this.changeRating}
        rating={this.state.rating}
      />
    ))
  }

  ratedRender = (ratedFilms) => {
    const { movieAPIService } = this.props
    return ratedFilms.map((movie, index) => (
      <FilmCard
        key={index}
        movie={movie}
        movieAPIService={movieAPIService}
        changeRating={this.changeRating}
        rating={this.state.rating}
      />
    ))
  }

  paginationMovies = (tab, movies) => {
    return tab == 1 && movies.length > 0 ? (
      <div className="pagination">
        <Pagination
          defaultCurrent={1}
          total={this.state.total_pages * 10}
          size="small"
          onChange={this.props.onPageSelected}
        />
      </div>
    ) : null
  }

  paginationRated = (tab, ratedFilms, ratedCountPages) => {
    return tab == 2 && ratedFilms.length > 0 ? (
      <div className="pagination">
        <Pagination defaultCurrent={1} total={ratedCountPages * 10} size="small" onChange={this.props.onPageSelected} />
      </div>
    ) : null
  }

  updateRating = (value) => {
    this.setState({ rating: value })
  }
  changeRating = (evt, id) => {
    const { movieAPIService } = this.props
    movieAPIService.addRating(evt, id).catch(this.onError)
    this.updateRating(evt)
    return evt
  }

  render() {
    const { movies, loading, error, err } = this.state
    const { tab, ratedFilms, ratedCountPages } = this.props

    if (tab == 1) {
      return (
        <>
          <div className="movie">
            {this.noMovies(movies)}
            {this.loaded(loading)}
            {this.errorMessage(error, err)}
            {this.movieRender(movies)}
          </div>
          {this.paginationMovies(tab, movies)}
        </>
      )
    } else if (tab == 2) {
      return (
        <>
          <div className="movie">
            {this.loaded(loading)}
            {this.errorMessage(error, err)}
            {this.ratedRender(ratedFilms)}
          </div>
          {this.paginationRated(tab, ratedFilms, ratedCountPages)}
        </>
      )
    }
  }
}
