import React from 'react';
import { Link } from 'react-router-dom';
import AlbumIndexItem from './album_index_item';

class AlbumIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = { firstLoad: true }
  }

  componentDidMount() {
    this.props.fetchAlbums().then(() => this.setState({ firstLoad: false }));
  }

  render() {
    if (this.state.firstLoad) {
      return (
        <div className="album-index-loading">
          <p>Loading...</p>
        </div>
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
    return (
      <div className="album-index-container">
        <Link to="/albums/new" className="album-index-new-album">New album</Link>
        <ul className="album-index-list">
          {albums}
        </ul>
      </div>
    );
  }
}

export default AlbumIndex;
