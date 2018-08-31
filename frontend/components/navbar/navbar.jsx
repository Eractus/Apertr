import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
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

  sessionLoggedOut() {
    return (
      <header>
        <nav className="logged-out-navbar">
          <Link to="/" className="logo-link-logged-out">
            <h1>apertr</h1>
          </Link>
          <div className="search-bar-logged-out">
            <input
              type="text"
              placeholder="Photos, people, or groups"
            />
          </div>
          <div className="navbar-logged-out-links">
            <Link to="/signup" className="signup-button"><button>Sign Up</button></Link>
            &nbsp;
            <Link to="/login" className="login-link">Log In</Link>
          </div>
        </nav>
      </header>
    );
  }

  sessionLoggedIn() {
    let email = this.props.currentUser.email;
    let name = email.substring(0, email.lastIndexOf("@"));
    const profilePopUp = (this.state.showProfilePopup) ?
    <div>
      <div onClick={this.handleCloseProfilePopup} className="popup-overlay"></div>
      <hgroup className="navbar-popup">
        <h2 className="navbar-greet-name">Yo, {name}!</h2>
        <br/>
        <p className="navbar-greet-text">Now you know how to greet people in English</p>
        <Link className="navbar-signout-link" to="/" onClick={this.handleLogOut}>Sign Out</Link>
      </hgroup>
    </div> : "";


    return (
      <header>
        <nav className="logged-in-navbar">
          <div className="navbar-logged-in-left">
            <Link to="/" className="logo-link-logged-in">
              <h1>apertr</h1>
            </Link>
            &nbsp;
            <div className="navbar-logged-in-links">
              <Link className="navbar-left-links" to="/photos">Photos</Link>
              &nbsp;
              <Link className="navbar-left-links" to="/albums">Albums</Link>
            </div>
          </div>
          &nbsp;
          <div className="navbar-logged-in-right">
            <div className="search-bar-logged-in">
              <input
                type="text"
                placeholder="Photos, people, or groups"
              />
            </div>
            <Link className="header-upload-photo" to="/photos/new">
              <img src="https://s3-us-west-1.amazonaws.com/apertr-dev/photos/images/static+images/upload_logo.png" />
            </Link>
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

  render() {
    return (
      this.props.currentUser ? this.sessionLoggedIn() : this.sessionLoggedOut()
    );
  }
}

export default Navbar;
