import React, { Component } from 'react'
import { Rate, Typography } from 'antd'
import { format } from 'date-fns'
import PropTypes from 'prop-types'

import './film-card.css'

import { MovieServiceConsumer } from '../../movie-api-service-context'
import photo from '../../assets/noPhoto.png'

const { Text } = Typography

export default class FilmCard extends Component {
  static defaultProps = {
    movie: {},
  }

  static propTypes = {
    movie: PropTypes.object,
  }

  // state = {
  //   rating: null,
  // }

  // updateRating = (value) => {
  //   this.setState({ rating: value })
  // }

  trimOverview = (overview) => {
    return overview.length > 200 ? `${overview.slice(0, 200)}...` : overview
  }

  isOverview = (overview) => {
    return !overview ? <div className="noOverview" /> : this.trimOverview(overview)
  }

  toFormatDate = (release_date) => {
    return release_date.split('-').join(', ').trim()
  }

  isDate = (release_date) => {
    return !release_date ? (
      <div className="noDate" />
    ) : (
      format(new Date(this.toFormatDate(release_date)), 'MMMM d, yyyy')
    )
  }

  hasImage = (poster_path) => {
    return poster_path ? (
      <img src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt="poster" className="film-card_image" />
    ) : (
      <img src={photo} alt="poster" className="film-card_image" />
    )
  }

  rateColor = (vote_average) => {
    return vote_average < 3 ? 'red' : vote_average < 5 ? 'orange' : vote_average < 7 ? 'yellow' : 'green'
  }

  // changeRating = (evt, id) => {
  //   const { movieAPIService } = this.props
  //   movieAPIService.addRating(evt, id)
  //   this.updateRating(evt)
  //   return evt
  // }

  render() {
    const { movie, changeRating } = this.props
    const { title, overview, release_date, poster_path, id, vote_average, genre_ids, rating } = movie

    return (
      <div key={id} className="film-card">
        {this.hasImage(poster_path)}
        <h5 className="film-card_title">{title}</h5>
        <Text className="film-card_date">{this.isDate(release_date)}</Text>
        <ul className="film-card_genre">
          <MovieServiceConsumer>
            {({ genres }) => {
              if (genres) {
                const filteredArray = genres.filter((item) => genre_ids.includes(item.id))
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
        <div className="film-card_overview">{this.isOverview(overview)}</div>
        <div className="film-card_rate">
          <Rate
            allowHalf
            defaultValue={rating}
            count={10}
            value={rating}
            style={{ position: 'relative', top: '25px', left: '0', marginLeft: '-10px' }}
            onChange={(evt) => changeRating(evt, id)}
            destroyInactiveTabPane={true}
          />
        </div>
        <div className={`${this.rateColor(vote_average)} rating`}>{vote_average.toFixed(1)}</div>
      </div>
    )
  }
}
