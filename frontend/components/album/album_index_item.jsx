import React from 'react';
import { Link } from 'react-router-dom';

const AlbumIndexItem = props => {
  return (
    <li>
      <div className="album-index-item-container">
        <Link to={`/albums/${props.album.id}`}>
          <img className="album-index-image" src={Object.values(props.album.photos)[0].image_url} />
        </Link>
        <div className="album-index-title">
          {props.album.title}
        </div>
        <div className="album-index-delete">
          <Link to="/albums" onClick={() => props.deleteAlbum(props.album.id)}>
            X
          </Link>
        </div>
      </div>
    </li>
  );
}

export default AlbumIndexItem;
