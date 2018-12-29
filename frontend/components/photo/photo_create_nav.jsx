import React from 'react';
import { Link } from 'react-router-dom';

class PhotoCreateNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfilePopup: false
    };
    this.toggleProfilePopup = this.toggleProfilePopup.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  // opens/closes profile popup where user can log out
  toggleProfilePopup() {
    this.setState({ showProfilePopup: !this.state.showProfilePopup})
  }

  handleLogOut() {
    this.toggleProfilePopup();
    this.props.logout().then(() => this.props.history.push("/"));
  }

  render() {
    // displays HTML for profile popup on page based on boolean value
    const profilePopUp = (this.state.showProfilePopup) ?
    <div>
      <div onClick={this.toggleProfilePopup} className="popup-overlay"></div>
      <hgroup className="photo-create-navbar-popup">
        <a className="photo-create-navbar-signout-link" onClick={this.handleLogOut}>Sign Out</a>
      </hgroup>
    </div> : "";

    return (
      <header>
        <nav className="photo-create-navbar">
          <div className="photo-create-nav-left">
            <Link to="/feed" className="photo-create-logo-link">
              <h1>apertr</h1>
            </Link>
            <div className="photo-create-nav-links">
              <Link
                className="photo-create-nav-photostream"
                to={`/users/${this.props.currentUser.id}`}
              >Your Photostream</Link>
            </div>
          </div>
          <div className="photo-create-nav-right">
            <div className="photo-create-profile-popup">
              <span>
                <img
                  src={this.props.currentUser.profile_pic}
                  onClick={this.toggleProfilePopup}
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
