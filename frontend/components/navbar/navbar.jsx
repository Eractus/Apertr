import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  sessionLoggedOut() {
    return (
      <nav className="login-signup">
        <Link to="/login">Log In</Link>
        &nbsp;
        <Link to="/signup"><button>Sign Up</button></Link>
      </nav>
    );
  }

  sessionLoggedIn() {
    return (
      <hgroup className="header-popup">
        <h2 className="header-greet">Yo, {this.props.currentUser.email}!</h2>
        <br/>
        <p>Now you know how to greet people in English</p>
        <Link className="header-button" to="/" onClick={this.props.logout}>Sign Out</Link>
      </hgroup>
    );
  }

  render() {
    return (
      this.props.currentUser ? this.sessionLoggedIn() : this.sessionLoggedOut()
    );
  }
}

export default Navbar;
