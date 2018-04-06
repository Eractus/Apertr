import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
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
    return (
      <header>
        <nav className="logged-in-navbar">
          <div className="navbar-logged-in-left">
            <Link to="/" className="logo-link-logged-in">
              <h1>apertr</h1>
            </Link>
            &nbsp;
            <div className="navbar-logged-in-links">
              <Link to="/">You</Link>
              &nbsp;
              <Link to="/">Explore</Link>
              &nbsp;
              <Link to="/">Create</Link>
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
            <a href="#" className="profile-pic-logo"><img src={this.props.currentUser.image_url} /></a>
            <hgroup className="header-popup">
              <h2 className="header-greet-name">Yo, {this.props.currentUser.email}!</h2>
              <br/>
              <p className="header-greet-text">Now you know how to greet people in English</p>
              <Link className="header-signout-link" to="/" onClick={this.props.logout}>Sign Out</Link>
            </hgroup>
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
