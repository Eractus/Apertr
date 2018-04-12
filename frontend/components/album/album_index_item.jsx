import React from 'react';
import { Link } from 'react-router-dom';

const AlbumIndexItem = props => {
  return (
    <li>
      <div className="album-image">
        <Link to={`/albums/${props.album.id}`}>
          <img src={Object.values(props.album.photos)[0].image_url} />
        </Link>
      </div>
    </li>
  );
}

export default AlbumIndexItem;
