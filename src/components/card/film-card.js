import React, { Component } from 'react'
import { Typography } from 'antd'

import Spinner from '../spinner/spinner'
// eslint-disable-next-line import/order
import MovieAPIService from '../../services/movie-api-service'

import './film-card.css'
import ErrorIndicator from '../error-indicator/error-indicator'

const { Text } = Typography

export default class FilmCard extends Component {
  movieAPIService = new MovieAPIService()

  state = {
    movies: [],
    loading: true,
    error: false,
  }

  componentDidMount() {
    this.updateMovie()
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedPage !== prevProps.selectedPage) {
      this.updateMovie()
    }
    if (this.props.movieName !== prevProps.movieName) {
      this.updateMovie()
    }
  }

  onError = (err) => {
    if (err) this.setState({ error: true, loading: false })
  }

  updateMovie() {
    const { movieName, selectedPage } = this.props
    this.movieAPIService
      .getMovie(movieName, selectedPage)
      .then((rez) => {
        this.setState({ movies: rez.results, loading: false, error: false })
      })
      .catch(this.onError)
  }

  newCard(movie) {
    const { title, overview, release_date, poster_path, id } = movie

    return (
      <div key={id} className="film-card">
        <img src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt="poster" className="film-card_image" />
        <h3 className="film-card_title">{title}</h3>
        <Text className="film-card_data">{release_date}</Text>
        <button className="film-card_genre">Genre</button>
        <div className="film-card_overview">{overview}</div>
      </div>
    )
  }

  render() {
    const { loading, error } = this.state

    const hasData = !(loading || error)
    const spinner = loading ? <Spinner /> : null
    const errorMessage = error ? <ErrorIndicator /> : null
    const rendering = hasData ? <Rendering movies={this.state.movies} newCard={this.newCard} /> : null

    return (
      <div className="movie">
        {spinner}
        {errorMessage}
        {rendering}
      </div>
    )
  }
}

const Rendering = ({ movies, newCard }) => {
  if (movies.length === 0) {
    return <div>Поиск не дал результатов</div>
  }
  return <React.Fragment>{movies.map((movie) => newCard(movie))}</React.Fragment>
}
