import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  sessionLoggedOut() {
    return (
      <nav className="logged-out-navbar">
        <input
          type="text"
          placeholder="Photos, people, or groups"
          className="searchbar"
        />
        <Link to="/login" className="login-link">Log In</Link>
        &nbsp;
        <Link to="/signup" className="signup-button"><button>Sign Up</button></Link>
      </nav>
    );
  }

  sessionLoggedIn() {
    return (
      <nav className="logged-in-navbar">
        <Link to="/">You</Link>
        &nbsp;
        <Link to="/">Explore</Link>
        &nbsp;
        <Link to="/">Create</Link>
        &nbsp;
        <input
          type="text"
          placeholder="Photos, people, or groups"
          className="searchbar"
        />
        <a href="#" className="profile-pic-logo"><img src={this.props.currentUser.image_url} /></a>
          <hgroup className="header-popup">
            <h2 className="header-greet-name">Yo, {this.props.currentUser.email}!</h2>
            <br/>
            <p className="header-greet-text">Now you know how to greet people in English</p>
            <Link className="header-button" to="/" onClick={this.props.logout}>Sign Out</Link>
          </hgroup>
      </nav>
    );
  }

  render() {
    return (
      this.props.currentUser ? this.sessionLoggedIn() : this.sessionLoggedOut()
    );
  }
}

export default Navbar;
