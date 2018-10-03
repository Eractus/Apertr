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

    const newAlbum = this.props.currentUser.id === this.props.user.id ?
      <Link to="/albums/new" className="album-index-new-album">New album</Link> : ""

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

    let user = this.props.user.id === this.props.currentUser.id ?
      "You have" : `${this.props.user.first_name} has`;

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
