import React from 'react';
import { Link } from 'react-router-dom';

class SplashPage extends React.Component {
  constructor(props) {
    super(props);
  }

  splashLoggedOut() {
    return (
      <main>
        <h1 className="intro-header">Find your inspiration.</h1>
        <br/>
          <h3 className="intro-text">Join the Apertr community, home to billions of photos and millions of groups.</h3>
          <br/>
          <Link to="/signup" className="signup-button-main"><button>Sign Up</button></Link>
          <div className="wallpaper-sig">
            <p>Aurora penetrating the overcast</p>
            <p>by Danny Peng</p>
          </div>
      </main>
    );
  }

  splashLoggedIn() {
    return (
      <p>You're logged in!</p>
    );
  }

  render() {
    return (
      this.props.currentUser ? this.splashLoggedIn() : this.splashLoggedOut()
    );
  }
}

export default SplashPage;
