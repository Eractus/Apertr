import React from 'react';
import { Link } from 'react-router-dom';
import PhotoIndexSplashContainer from '../photo/photo_index_splash_container';

class SplashPage extends React.Component {
  constructor(props) {
    super(props);

  }

  splashLoggedOut() {
    return (
      <div className="logged-out-splash-greeting-container">
        <div className="welcome-message">
          <h1 className="intro-header">Find your inspiration.</h1>
          <br/>
          <div className="intro-text">
            <p>Join the Apertr community, home to photos from people who ran out of free storage on Flickr.</p>
          </div>
          <br/>
           <button
            onClick={() => this.props.login({email: "gabethecommie@gabriel.com", password: "password"})} className="signup-button-main">Demo</button>
        </div>
      </div>
    );
  }

  splashLoggedIn() {
    return (
      <div>
        <PhotoIndexSplashContainer />
      </div>
    );
  }

  render() {
    if (this.props.currentUser) {
      return (
        <div>
          <div className="logged-in-background">
            {this.splashLoggedIn()}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="logged-out-splash-wallpaper">
            <img src={"/assets/background_splash1.jpg"} />
            <img src={"/assets/background_splash2.jpg"} />
            <img src={"/assets/background_splash3.jpg"} />
            <img src={"/assets/background_splash4.jpg"} />
            <img src={"/assets/background_splash5.jpg"} />
            <img src={"/assets/background_splash6.jpg"} />
          </div>
          {this.props.currentUser ? this.splashLoggedIn() : this.splashLoggedOut()}
        </div>
      );
    }
  }
}

export default SplashPage;
