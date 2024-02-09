export default class MovieAPIService {
  _baseApe = 'https://api.themoviedb.org/3/'
  _apiKey = new URLSearchParams({ api_key: 'dbfd873c3804a95d2b0627bf149217fc' })
  _apiGetRate = new URLSearchParams({ language: 'en-US', page: '1', sort_by: 'created_at.asc' })
  _apiSession = 'authentication/guest_session/new'
  _apiGenre = 'genre/movie/list?language=en'

  async getResource(data) {
    const res = await fetch(`${this._baseApe}search/movie?${data}&${this._apiKey}`)

    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`)
    }

    return await res.json()
  }

  async createGuestSession() {
    const p = new URL(this._apiSession, this._baseApe)
    const res = await fetch(p, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmZkODczYzM4MDRhOTVkMmIwNjI3YmYxNDkyMTdmYyIsInN1YiI6IjY1ODMxN2JkMTgwZGVhNTJjMzhjMDFmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8xS64xwfgDl8dks4PuFcnJTsAijDh5XTxcax1IS7Q_0',
      },
    })

    if (!res.ok) {
      throw new Error('Failed to create guest session')
    }

    return await res.json()
  }

  async addRating(rating, id) {
    const res = await fetch(
      `${this._baseApe}movie/${id}/rating?guest_session_id=${sessionStorage.key(0)}&${this._apiKey}`,
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
      throw new Error('Could not rate the movie')
    }
  }

  async getRateMovies() {
    const res = await fetch(
      `${this._baseApe}guest_session/${sessionStorage.key(0)}/rated/movies?${this._apiGetRate}&${this._apiKey}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      }
    )

    if (!res.ok) {
      throw new Error('Failed to get rated movies')
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
      throw new Error('Failed to get genres')
    }

    return await res.json()
  }

  async getMovie(request, page) {
    const params = new URLSearchParams({ query: request, page: page })
    const res = await this.getResource(params)
    return [res.results, res.total_pages]
  }

  async getGuestSession() {
    const res = await this.createGuestSession()
    return res
  }

  async toGenre() {
    const res = await this.getGenre()
    return res.genres
  }

  async rateMov() {
    const res = await this.getRateMovies()
    return [res.results, res.total_pages]
  }
}
