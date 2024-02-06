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
  }

  componentDidMount() {
    this.updateMovie()
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedPage !== prevProps.selectedPage || this.props.movieName !== prevProps.movieName) {
      this.updateMovie()
    }
  }

  onError = (err) => {
    if (err) this.setState({ error: true, loading: false, err: err.message })
  }

  onMovieLoaded = (result) => {
    this.setState({ movies: result[0], total_pages: result[1], loading: false, error: false })
  }

  updateMovie() {
    const { movieName, selectedPage } = this.props
    this.props.movieAPIService.getMovie(movieName, selectedPage).then(this.onMovieLoaded).catch(this.onError)
  }

  render() {
    const { movies, loading, error, err } = this.state
    const { tab, ratedFilms, movieAPIService, ratedCountPages } = this.props

    const hasData = !(loading || error)
    const noMovies = hasData && movies.length === 0 ? <span>Поиск не дал результатов</span> : null
    const loaded = loading ? <Spinner /> : null
    const errorMessage = error ? <ErrorIndicator err={err} /> : null

    const movieRender = movies.map((movie, index) => (
      <FilmCard key={index} movie={movie} movieAPIService={movieAPIService} />
    ))
    const ratedRender = ratedFilms.map((movie, index) => (
      <FilmCard key={index} movie={movie} movieAPIService={movieAPIService} />
    ))

    const paginationMovies =
      tab == 1 && movies.length > 0 ? (
        <div className="pagination">
          <Pagination
            defaultCurrent={1}
            total={this.state.total_pages * 10}
            size="small"
            onChange={this.props.onPageSelected}
          />
        </div>
      ) : null

    const paginationRated =
      tab == 1 && ratedFilms.length > 0 ? (
        <div className="pagination">
          <Pagination
            defaultCurrent={1}
            total={ratedCountPages * 10}
            size="small"
            onChange={this.props.onPageSelected}
          />
        </div>
      ) : null

    if (tab == 1) {
      return (
        <>
          <div className="movie">
            {noMovies}
            {loaded}
            {errorMessage}
            {movieRender}
          </div>
          {paginationMovies}
        </>
      )
    } else if (tab == 2) {
      return (
        <>
          <div className="movie">
            {loaded}
            {errorMessage}
            {ratedRender}
          </div>
          {paginationRated}
        </>
      )
    }
  }
}
