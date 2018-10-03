import React from 'react';
import { Link } from 'react-router-dom';

class AlbumUpdateNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { firstLoad: true }
  }

  componentDidMount() {
    this.props.fetchAlbum(this.props.match.params.albumId).then(
      () => this.setState({ firstLoad: false })
    );
  }

  render() {
    const albumTitle =  this.state.firstLoad ? "Loading..." : this.props.album.title;
    return (
      <header>
        <nav className="album-create-navbar">
          <Link to="/feed" className="album-create-logo-link">
            <h1>apertr</h1>
          </Link>
          <div className="album-create-nav-links">
            <Link
              className="album-create-nav-photostream"
              to={`/users/${this.props.currentUser.id}`}
            >Your Photostream</Link>
            <p className="album-create-new-album-tab">
              Album: {albumTitle}
            </p>
          </div>
        </nav>
      </header>
    );
  }
}

export default AlbumUpdateNav;
