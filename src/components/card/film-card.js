import React, { Component } from 'react'
import { Rate, Typography } from 'antd'
import { format } from 'date-fns'
import PropTypes from 'prop-types'

import './film-card.css'

import { MovieServiceConsumer } from '../../movie-api-service-context'

import photo from './noPhoto.png'

const { Text } = Typography

export default class FilmCard extends Component {
  static defaultProps = {
    movie: {},
  }

  static propTypes = {
    movie: PropTypes.object,
  }

  state = {
    rating: null,
  }

  updateRating = (value) => {
    this.setState({ rating: value })
  }

  render() {
    const { movie, movieAPIService } = this.props
    const { title, overview, release_date, poster_path, id, vote_average, genre_ids, rating } = movie
    const trimOverview = overview.length > 200 ? `${overview.slice(0, 200)}...` : overview
    const toFormatDate = release_date.split('-').join(', ').trim()
    const isDate = !release_date ? <div className="noDate" /> : format(new Date(toFormatDate), 'MMMM d, yyyy')
    const isOverview = !overview ? <div className="noOverview" /> : trimOverview
    const hasImage = poster_path ? (
      <img src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt="poster" className="film-card_image" />
    ) : (
      <img src={photo} alt="poster" className="film-card_image" />
    )
    const rateColor = vote_average < 3 ? 'red' : vote_average < 5 ? 'orange' : vote_average < 7 ? 'yellow' : 'green'
    const addRating = (evt) => {
      movieAPIService.addRating(evt, id)
      this.updateRating(evt)
      return evt
    }

    return (
      <div key={id} className="film-card">
        {hasImage}
        <h5 className="film-card_title">{title}</h5>
        <Text className="film-card_date">{isDate}</Text>
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
        <div className="film-card_overview">{isOverview}</div>
        <div className="film-card_rate">
          <Rate
            allowHalf
            defaultValue={this.state.rating}
            count={10}
            value={rating}
            style={{ position: 'relative', top: '25px', left: '0', marginLeft: '-10px' }}
            onChange={addRating}
            destroyInactiveTabPane={true}
          />
        </div>
        <div className={`${rateColor} rating`}>{vote_average.toFixed(1)}</div>
      </div>
    )
  }
}
