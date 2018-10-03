import React from 'react';
import { Link } from 'react-router-dom';

class AlbumCreateNav extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
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
              Album: new album
            </p>
          </div>
        </nav>
      </header>
    );
  }
}

export default AlbumCreateNav;
