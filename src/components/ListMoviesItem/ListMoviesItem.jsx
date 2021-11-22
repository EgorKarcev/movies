import React from 'react';
import 'antd/dist/antd.css';
import './ListMoviesItem.css';
import { Rate } from 'antd';
import { format } from 'date-fns';
import classNames from 'classnames';
import defautFoto from '../../image/noFoto.jpg';

const ListMoviesItem = ({
  title,
  overview,
  poster_path: posterPath,
  release_date: releaseDate,
  genre_ids: genreIds,
  vote_average: voteAverage,
  rateMovi,
  id,
}) => {
  const item = {
    title,
    overview,
    posterPath,
    releaseDate,
    genreIds,
    voteAverage: 0,
    id,
  };
  const genre = genreIds.map((el) => (
    <span key={el.id} className="genre__movies">
      {el.name}
    </span>
  ));

  const colorVote = classNames({
    movies__average: true,
    movies__average_orang: voteAverage > 3 && voteAverage <= 5,
    movies__average_yellow: voteAverage > 5 && voteAverage <= 7,
    movies__average_green: voteAverage > 7,
  });
  const trunc = (text, cutTreshold, tail = '...') => {
    const splitBy = ' ';
    const wordsArray = text.split(splitBy);

    return wordsArray.length <= cutTreshold ? text : wordsArray.slice(0, cutTreshold).join(splitBy) + tail;
  };
  const data = releaseDate ? format(new Date(releaseDate), 'dd MMMM yyyy') : 'Низветно';

  const poster = posterPath !== null ? `https://image.tmdb.org/t/p/w500${posterPath}` : defautFoto;
  return (
    <div className="movies__item">
      <img className="movies__img" src={poster} alt={title} />
      <div className="movies__cont">
        <div className="title">
          <div className="title__block">
            <span className="movies__title">{title}</span>
            <span className="movies__data">{data}</span>
          </div>
          <div className={colorVote}>{voteAverage}</div>
        </div>
        <div className="movies__block">
          <div className="genre">{genre}</div>
          <span className="movies__overview">{trunc(overview)}</span>
        </div>
        <Rate className="movies__react" count={10} onChange={(rate) => rateMovi(item, rate)} />
      </div>
    </div>
  );
};

export default ListMoviesItem;
