import React from 'react';
import { Link } from 'react-router-dom';
import AlbumIndexItem from './album_index_item';

class AlbumIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchAlbums();
  }

  render() {
    if (!this.props.albums) {
      return (
        <div>Loading...</div>
      )
    }

    const albums = this.props.albums.map(album => {
      return (
        <AlbumIndexItem
        key={album.id}
        album={album}
        deleteAlbum={this.props.deleteAlbum} />
      );
    });
    const newAlbum = <Link to="/albums/new" className="album-index-new-album">new album</Link>;
    if (albums.length === 0) {
      return (
        <div className="no-albums">
          <div className="no-albums-message">
            <p>You have no albums yet! Please create a</p>
            {newAlbum}
          </div>
        </div>
      );
    } else {
      return (
        <div className="album-index-container">
          <div className="album-index-header">
            <h1>Your Albums (</h1>
            {newAlbum}
            <h1>)</h1>
          </div>
          <ul className="album-index-list">
            {albums}
          </ul>
        </div>
      );
    }
  }
}

export default AlbumIndex;
