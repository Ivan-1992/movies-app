import React, { Component } from 'react'

import FilmCard from '../card'

import './app.css'

export default class App extends Component {
  render() {
    return (
      <div className="app-cards">
        <FilmCard />
      </div>
    )
  }
}
