import React from 'react';
import { Link } from 'react-router-dom';

class SplashPage extends React.Component {
  constructor(props) {
    super(props);
  }

  splashLoggedOut() {
    return (
      <div>
        <div className="welcome-message">
          <h1 className="intro-header">Find your inspiration.</h1>
          <br/>
          <div className="intro-text">
            <p>Join the Apertr community, home to billions of</p>
            <p>photos and millions of groups.</p>
          </div>
          <br/>
           <button
            onClick={() => this.props.login({email: "gabe@gabe.com", password: "password"})} className="signup-button-main">Demo</button>
        </div>
        <div className="wallpaper-sig">
          <p>Dancing aurora borealis</p>
          <br/>
          <p>by unknown</p>
        </div>
      </div>
    );
  }

  splashLoggedIn() {
    return (
      <p>You're logged in!</p>
    );
  }

  render() {
    if (this.props.currentUser) {
      return (
        <div>
          {this.splashLoggedIn()}
        </div>
      );
    } else {
      return (
        <div className="splash-wallpaper">
        {this.props.currentUser ? this.splashLoggedIn() : this.splashLoggedOut()}
        </div>
      );
    }
  }
}

export default SplashPage;