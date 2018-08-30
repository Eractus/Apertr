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
      <Link className="header-signout-link" to="/" onClick={this.handleLogOut}>Sign Out</Link>
    </div> : "";


    return (
      <header>
        <nav className="logged-in-navbar">
          <div className="navbar-logged-in-left">
            <Link to="/" className="logo-link-logged-in">
              <h1>apertr</h1>
            </Link>
            &nbsp;
            <Link className="navbar-left-links" to="/photos">Your Photostream</Link>
          </div>
          &nbsp;
          <div className="navbar-logged-in-right">
            <div className="profile-popup">
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
      </header>
    );
  }
}

export default PhotoCreateNav;
