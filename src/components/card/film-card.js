import React, { Component } from 'react'
import { Typography } from 'antd'

import MovieAPIService from '../../services/movie-api-service'

import './film-card.css'

const { Text } = Typography

export default class FilmCard extends Component {
  movieAPIService = new MovieAPIService()

  state = {
    movies: [],
  }

  constructor() {
    super()
    this.updateMovie()
  }

  updateMovie() {
    const title = 'return'
    this.movieAPIService.getMovie(title).then((rez) => {
      this.setState({ movies: rez.results })
    })
  }

  newCard(movie) {
    const { title, overview, release_date, poster_path, id } = movie
    return (
      <div key={id} className="film-card">
        <img src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt="poster" className="film-card_image" />
        <h3 className="film-card_title">{title}</h3>
        <Text className="film-card_data">{release_date}</Text>
        <button className="film-card_button">Genre</button>
        <div className="film-card_overview">{overview}</div>
      </div>
    )
  }

  render() {
    const { movies } = this.state
    return <div className="movie">{movies.map((movie) => this.newCard(movie))}</div>
  }
}
