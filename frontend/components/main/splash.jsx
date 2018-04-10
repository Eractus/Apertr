import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../footer/footer';
import PhotoIndexContainer from '../photo/photo_index_container';

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
      <div>
        <div className="navbar2-container">
          <div className="navbar2">
            <ul className="navbar2-links">
              <li><button>All Activity</button></li>
              <li><button>People</button></li>
              <li><button>Groups</button></li>
            </ul>
          </div>
        </div>
        <div>
          <PhotoIndexContainer />
        </div>
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
          <Footer />
        </div>
      );
    } else {
      return (
        <div>
          <div className="logged-out-splash-wallpaper">
          {this.props.currentUser ? this.splashLoggedIn() : this.splashLoggedOut()}
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default SplashPage;
