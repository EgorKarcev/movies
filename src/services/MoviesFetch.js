export default class MoviesFetch {
  async getResource(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Ошибка');
    }
    const json = await res.json();
    return json;
  }

  async postResource(url, rate) {
    const headers = {
      'Content-Type': 'application/json',
    };
    const json = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        value: rate,
      }),
      headers,
    }).then((response) => response.json());
    return json;
  }

  getAllMovies(names, page = 1) {
    return this.getResource(
      `https://api.themoviedb.org/3/search/movie?api_key=614882e2417ea35c553f7c38ef1fe655&query=${names}&page=${page}`,
    );
  }

  getGenreMovies() {
    return this.getResource(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=614882e2417ea35c553f7c38ef1fe655&language=en-US',
    );
  }

  getMoviesGuestSession() {
    return this.getResource(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=614882e2417ea35c553f7c38ef1fe655',
    );
  }

  postListIdMovies(itemId, session, rate) {
    return this.postResource(
      `https://api.themoviedb.org/3/movie/${itemId}/rating?api_key=614882e2417ea35c553f7c38ef1fe655&guest_session_id=${session}`,
      rate,
    );
  }

  getRatedMovies(session) {
    return this.getResource(
      `https://api.themoviedb.org/3/guest_session/${session}/rated/movies?api_key=614882e2417ea35c553f7c38ef1fe655&language=en-US&sort_by=created_at.asc`,
    );
  }
}
