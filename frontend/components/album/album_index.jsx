import React from 'react';
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
    if (albums.length === 0) {
      return (
        <div className="no-albums">
          <p>You have no albums yet! Click Create to make one!!!</p>
        </div>
      );
    } else {
      return (
        <div className="album-index-container">
          <ul className="album-index-list">
            {albums}
          </ul>
        </div>
      );
    }
  }
}

export default AlbumIndex;
