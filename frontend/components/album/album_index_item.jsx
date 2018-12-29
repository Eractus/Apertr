import React from 'react';
import { Link } from 'react-router-dom';

const AlbumIndexItem = props => {
  // logic for inteporlating non-data text
  const numPhotos = Object.values(props.album.photos).length;
  let photos = numPhotos === 1 ? "photo" : "photos";
  // users can only see link to delete album if they are the album owner
  const albumDelete = props.currentUser.id === props.album.owner_id ?
    <div className="album-index-item-delete">
      <Link to={`/users/${props.album.owner_id}`} onClick={() => props.deleteAlbum(props.album.id)}>
        X
      </Link>
    </div> : "";

  return (
    <li className="album-index-item-container">
      <span className="album-index-item-aesthetics-layer1"></span>
      <span className="album-index-item-aesthetics-layer2"></span>
      <div className="album-index-item-aesthetics-shadow"></div>
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
