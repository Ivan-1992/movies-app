import React, { Component } from 'react'
import { Typography, Rate } from 'antd'
import PropTypes from 'prop-types'

import Spinner from '../spinner/spinner'
// eslint-disable-next-line import/order
import MovieAPIService from '../../services/movie-api-service'
import ErrorIndicator from '../error-indicator/error-indicator'
import { MovieServiceConsumer } from '../movie-api-service-context'

import './film-card.css'

const { Text } = Typography

export default class FilmCard extends Component {
  static defaultProps = {
    movieName: '',
    selectedPage: 1,
    genres: {},
  }

  static propTypes = {
    movieName: PropTypes.string,
    selectedPage: PropTypes.number,
    genres: PropTypes.object,
    rating: PropTypes.number,
    rated: PropTypes.array,
  }

  movieAPIService = new MovieAPIService()

  state = {
    movies: [],
    loading: true,
    error: false,
    rating: null,
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
    if (this.props.rating !== prevProps.rating) {
      this.updateRating()
    }
  }

  onError = (err) => {
    if (err) this.setState({ error: true, loading: false })
  }

  onMovieLoaded = (movies, total_pages) => {
    this.setState({ movies, loading: false, error: false, total_pages })
  }

  updateMovie() {
    const { movieName, selectedPage } = this.props
    this.movieAPIService.getMovie(movieName, selectedPage).then(this.onMovieLoaded).catch(this.onError)
  }

  updateRating = (value) => {
    this.setState({ rating: value })
  }

  newCard(movie, rating) {
    const { title, overview, releaseDate, posterPath, id, voteAverage, genreIds } = movie
    const isOverview = !overview ? <div className="noOverview" /> : overview
    const isDate = !releaseDate ? <div className="noDate" /> : releaseDate
    const movieAPIService = new MovieAPIService()
    const addRating = (evt) => {
      movieAPIService.addRating(evt, movie.id)
      return evt
    }

    let rateColor = voteAverage < 3 ? 'red' : voteAverage < 5 ? 'orange' : voteAverage < 7 ? 'yellow' : 'green'

    return (
      <div key={id} className="film-card">
        <img src={`https://image.tmdb.org/t/p/original/${posterPath}`} alt="poster" className="film-card_image" />
        <h3 className="film-card_title">{title}</h3>
        <Text className="film-card_data">{isDate}</Text>
        <ul className="film-card_genre">
          <MovieServiceConsumer>
            {({ genres }) => {
              if (genres) {
                const filteredArray = genres.filter((item) => genreIds.includes(item.id))
                const items = filteredArray.map((item) => {
                  return (
                    <li key={item.id} className="film-card_genre-item">
                      {item.name}
                    </li>
                  )
                })
                return items
              }
            }}
          </MovieServiceConsumer>
        </ul>
        <div className="film-card_overview">{isOverview}</div>
        <Rate
          allowHalf
          defaultValue={rating}
          count={10}
          value={rating}
          style={{ position: 'relative', top: '25px', left: '0', marginLeft: '-10px' }}
          onChange={addRating}
          destroyInactiveTabPane={true}
        />
        <div className={rateColor}>{voteAverage.toFixed(1)}</div>
      </div>
    )
  }

  render() {
    const { loading, error } = this.state

    const hasData = !(loading || error)
    const spinner = loading ? <Spinner /> : null
    const errorMessage = error ? <ErrorIndicator /> : null
    const rendering = hasData ? (
      <Rendering movies={this.state.movies} newCard={this.newCard} rated={this.props.rated} tab={this.props.tab} />
    ) : null

    return (
      <div className="movie">
        {spinner}
        {errorMessage}
        {rendering}
      </div>
    )
  }
}

const Rendering = ({ movies, newCard, tab, rated }) => {
  if (movies.length === 0) {
    return <div>Поиск не дал результатов</div>
  }

  if (tab == 1) {
    return <React.Fragment>{movies.map((movie) => newCard(movie))}</React.Fragment>
  } else if (tab == 2) {
    return <React.Fragment>{rated.map((movie) => newCard(movie))}</React.Fragment>
  }
}
