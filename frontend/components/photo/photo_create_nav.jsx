import React from 'react';
import { Link } from 'react-router-dom';

class PhotoCreateNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfilePopup: false
    };
    this.handleOpenProfilePopup = this.handleOpenProfilePopup.bind(this);
    this.handleCloseProfilePopup = this.handleCloseProfilePopup.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleOpenProfilePopup() {
    this.setState({ showProfilePopup: true})
  }

  handleCloseProfilePopup() {
    this.setState({ showProfilePopup: false})
  }

  handleLogOut() {
    this.handleCloseProfilePopup();
    this.props.logout();
  }

  render() {
    const profilePopUp = (this.state.showProfilePopup) ?
    <div>
      <div onClick={this.handleCloseProfilePopup} className="popup-overlay"></div>
      <hgroup className="photo-create-navbar-popup">
        <Link className="photo-create-navbar-signout-link" to="/" onClick={this.handleLogOut}>Sign Out</Link>
      </hgroup>
    </div> : "";


    return (
      <header>
        <nav className="photo-create-navbar">
          <div className="photo-create-nav-left">
            <Link to="/" className="photo-create-logo-link">
              <h1>apertr</h1>
            </Link>
            &nbsp;
            <div className="photo-create-nav-links">
              <Link
                className="photo-create-nav-photostream"
                to="/photos"
              >Your Photostream</Link>
            </div>
          </div>
          &nbsp;
          <div className="photo-create-nav-right">
            <div className="photo-create-profile-popup">
              <span>
                <img
                  src={this.props.currentUser.image_url}
                  onClick={this.handleOpenProfilePopup}
                />
                {profilePopUp}
              </span>
            </div>
          </div>
        </nav>
        <div className="photo-create-header"></div>
      </header>
    );
  }
}

export default PhotoCreateNav;
