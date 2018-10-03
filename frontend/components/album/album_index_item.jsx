import React from 'react';
import { Link } from 'react-router-dom';

const AlbumIndexItem = props => {
  const numPhotos = Object.values(props.album.photos).length;
  let photos = numPhotos === 1 ? "photo" : "photos";
  const albumDelete = props.currentUser.id === props.album.owner_id ?
    <div className="album-index-item-delete">
      <Link to={`/users/${props.album.owner_id}`} onClick={() => props.deleteAlbum(props.album.id)}>
        X
      </Link>
    </div> : "";

  return (
    <li className="album-index-item-container">
      <Link to={`/albums/${props.album.id}`} className="album-index-item-background-gradient"></Link>
      <img className="album-index-item-image" src={Object.values(props.album.photos)[0].image_url} />
      <div className="album-index-item-details">
        <p>{props.album.title}</p>
        <p>{numPhotos} {photos}</p>
      </div>
      {albumDelete}
    </li>
  );
}

export default AlbumIndexItem;
