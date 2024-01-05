export default class MovieAPIService {
  _apiBase = 'https://api.themoviedb.org/3/search/movie?query='
  _apiKey = '&api_key=dbfd873c3804a95d2b0627bf149217fc'

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}${this._apiKey}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, 
                      received ${res.status}`)
    }

    return await res.json()
  }

  async getMovie(request) {
    const res = await this.getResource(`${request}`)
    return res
  }
}
