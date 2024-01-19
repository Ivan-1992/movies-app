import { format } from 'date-fns'

export default class MovieAPIService {
  _baseApe = 'https://api.themoviedb.org/3/'
  _apiSearch = 'search/movie?query='
  _apiKey = '&api_key=dbfd873c3804a95d2b0627bf149217fc'
  _apiSession = 'authentication/guest_session/new'
  _apiGenre = 'genre/movie/list?language=en'
  _rateApi = '/rating?guest_session_id='
  _apiGetRate = '/rated/movies?language=en-US&page=1&sort_by=created_at.asc'

  async getResource(url) {
    const res = await fetch(`https://api.themoviedb.org/3/${this._apiSearch}${url}${this._apiKey}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, 
                      received ${res.status}`)
    }

    return await res.json()
  }

  async createGuestSession() {
    const res = await fetch(`${this._baseApe}${this._apiSession}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmZkODczYzM4MDRhOTVkMmIwNjI3YmYxNDkyMTdmYyIsInN1YiI6IjY1ODMxN2JkMTgwZGVhNTJjMzhjMDFmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8xS64xwfgDl8dks4PuFcnJTsAijDh5XTxcax1IS7Q_0',
      },
    })

    if (!res.ok) {
      throw new Error(`Could not fetch, 
                      received ${res.status}`)
    }

    return await res.json()
  }

  async addRating(rating, id) {
    const res = await fetch(
      `${this._baseApe}movie/${id}/rating?guest_session_id=${localStorage.key(0)}${this._apiKey}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value: rating,
        }),
      }
    )

    if (!res.ok) {
      throw new Error(`Could not fetch, 
                      received ${res.status}`)
    }
  }

  async getRateMovies() {
    const res = await fetch(`${this._baseApe}guest_session/${localStorage.key(0)}${this._apiGetRate}${this._apiKey}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`Could not fetch, 
                      received ${res.status}`)
    }

    return await res.json()
  }

  async getGenre() {
    const res = await fetch(`${this._baseApe}${this._apiGenre}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmZkODczYzM4MDRhOTVkMmIwNjI3YmYxNDkyMTdmYyIsInN1YiI6IjY1ODMxN2JkMTgwZGVhNTJjMzhjMDFmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8xS64xwfgDl8dks4PuFcnJTsAijDh5XTxcax1IS7Q_0',
      },
    })

    if (!res.ok) {
      throw new Error(`Could not fetch, 
                      received ${res.status}`)
    }

    return await res.json()
  }

  async getMovie(request, page) {
    const res = await this.getResource(`${request}&page=${page}`)
    return res.results.map(this._transformMovie)
  }

  async getGuestSession() {
    const res = await this.createGuestSession('')
    return res
  }

  async toGenre() {
    const res = await this.getGenre()
    return res.genres.map(this._transformGenre)
  }

  async rateMov() {
    const res = await this.getRateMovies()
    return res.results.map(this._transformMovie)
  }

  _transformGenre = (genres) => {
    return { id: genres.id, name: genres.name }
  }

  _transformMovie = (movie) => {
    const toFormatDate = movie.release_date.split('-').join(', ').trim()
    const trimOverview = movie.overview.length > 225 ? `${movie.overview.slice(0, 225)}...` : movie.overview
    return {
      id: movie.id,
      title: movie.title,
      overview: trimOverview,
      releaseDate: format(new Date(toFormatDate), 'MMMM d, yyyy'),
      posterPath: movie.poster_path,
      voteAverage: movie.vote_average,
      genreIds: movie.genre_ids,
    }
  }
}
