import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Spin, Alert, Pagination } from 'antd';
import ListMoviesItem from '../ListMoviesItem';
import Header from '../Header';
import MoviesFetch from '../../services/MoviesFetch';
import './AppMovies.css';

const defaltSerchValue = 'spider';

class AppMovies extends Component {
  state = {
    moviValue: defaltSerchValue,
    items: [],
    genre: [],
    loading: true,
    currentPage: 1,
    totalPage: 1,
    guest: null,
    itemsRate: [],
    rated: false,
  };

  MoviesFetch = new MoviesFetch();

  componentDidMount() {
    this.loadGuest();
    this.updateGenre();
    this.updateMovies();
  }

  componentDidUpdate(prevProps) {
    const { items, currentPage, rateItems, rated } = this.props;
    const { prevItems, prevCurrentPage, prevRateItems, prevRated } = prevProps;
    if (items !== prevItems) this.searchInput();
    if (currentPage !== prevCurrentPage) this.LoadPage();
    if (rateItems !== prevRateItems) this.rateMovi();
    if (rated !== prevRated) this.LoadItem();
  }

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  searchInput = (eve) => {
    this.MoviesFetch.getAllMovies(eve.target.value)
      .then(this.setState({ items: [], loading: true, error: false }))
      .then((movi) => {
        this.setState({
          moviValue: eve.target.value,
          items: movi.results,
          loading: false,
          error: false,
          totalPage: movi.total_results,
          currentPage: movi.page,
        });
      })
      .catch(this.onError);
  };

  updateMovies = () => {
    this.MoviesFetch.getAllMovies(defaltSerchValue)
      .then((movi) => {
        this.setState({
          moviValue: defaltSerchValue,
          items: movi.results,
          loading: false,
          error: false,
          totalPage: movi.total_results,
          currentPage: movi.page,
        });
      })
      .catch(this.onError);
  };

  loadGuest = async () => {
    this.MoviesFetch.getMoviesGuestSession().then((guest) => {
      this.setState({ guest });
    });
  };

  pushItemRate = async () => {
    const { guest } = this.state;
    await this.MoviesFetch.getRatedMovies(guest.guest_session_id).then((itemsRate) => {
      this.setState({ itemsRate });
    });
  };

  listIdSesion = (sesion, sesId, rate) => {
    this.MoviesFetch.postListIdMovies(sesion, sesId, rate).then(() => {
      this.setState({});
    });

    this.pushItemRate();
  };

  ratedClick = (keyTab) => {
    switch (keyTab) {
      case 'Search':
        this.setState({ rated: false });
        break;
      case 'Rated':
        this.setState({ rated: true });
        break;
      default:
        break;
    }
  };

  updateGenre = () => {
    this.MoviesFetch.getGenreMovies().then((genre) => {
      this.setState({
        genre: genre.genres,
      });
    });
  };

  rateMovi = (item, rate) => {
    const { guest } = this.state;
    const sesId = guest.guest_session_id;
    this.listIdSesion(item.id, sesId, rate);
  };

  LoadItem = () => {
    const { itemsRate, items, genre, rated } = this.state;
    const arrItem = rated ? itemsRate.results : items;
    let el;
    if (arrItem) {
      el = arrItem.map(({ ...item }) => {
        const $item = item;
        $item.genre_ids = item.genre_ids.map((ell) => {
          const genress = genre.find((ellem) => ellem.id === ell);
          return genress ? { name: genress.name, id: genress.id } : null;
        });
        return (
          <div className="element" key={item.id}>
            <ListMoviesItem {...item} rateMovi={this.rateMovi} />
          </div>
        );
      });
    } else {
      el = <Alert message="Нет таких фильмов " type="error" />;
    }
    return el;
  };

  LoadPage = (numberPage) => {
    const { moviValue } = this.state;
    this.MoviesFetch.getAllMovies(moviValue, numberPage)
      .then(this.setState({ items: [], loading: true, error: false }))
      .then((movi) => {
        this.setState({
          items: movi.results,
          loading: false,
          error: false,
          currentPage: movi.page,
        });
      })
      .catch(this.onError);
  };

  render() {
    const { loading, error, currentPage, totalPage, rated } = this.state;
    const pagi = !rated ? (
      <Pagination current={currentPage} total={totalPage} pageSize={20} onChange={this.LoadPage} />
    ) : null;
    const errorInfo = error ? <Alert message="Сервер не отвечает" type="error" /> : null;
    const spiner = loading ? <Spin size="large" /> : null;
    const content = !loading ? this.LoadItem() : null;
    return (
      <section>
        <Header searchInput={this.searchInput} ratedClick={this.ratedClick} />
        <div className="list__movies">
          {content}
          {errorInfo}
          {spiner}
        </div>
        <div className="pagi__movies">{pagi}</div>
      </section>
    );
  }
}
export default AppMovies;
