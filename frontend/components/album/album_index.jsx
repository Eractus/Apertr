import React from 'react';
import { Link } from 'react-router-dom';
import AlbumIndexItem from './album_index_item';

class AlbumIndex extends React.Component {
  render() {
    // if current user viewing own album index tab they will see this link to create a new album
    const newAlbum = this.props.currentUser.id === this.props.user.id ?
      <Link to="/albums/new" className="album-index-new-album">New album</Link> : ""

    // UserShow parent component fetches data for all albums (array) and this user(object) based on id in url and pass down as props in order to create an array filtered with only this user's albums
    let albums = []
    this.props.albums.forEach(album => {
      if (this.props.user.id === album.owner_id) {
        albums.push(
          <AlbumIndexItem
            currentUser={this.props.currentUser}
            album={album}
            deleteAlbum={this.props.deleteAlbum}
          />
        );
      }
    });

    // some logic to interpolate non-data text
    let user = this.props.user.id === this.props.currentUser.id ?
      "You have" : `${this.props.user.first_name} has`;

    // display a template message if this user has no albums
    if (albums.length === 0) {
      return (
        <div className="album-index-container">
          {newAlbum}
          <div className="album-index-no-albums">
            <div className="album-index-no-albums-message">
              <h2>{user} not created any albums yet.</h2>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="album-index-container">
          {newAlbum}
          <ul className="album-index-list">
            {albums}
          </ul>
        </div>
      );
    }
  }
}

export default AlbumIndex;
