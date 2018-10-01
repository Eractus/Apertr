import React from 'react';
import { Link } from 'react-router-dom';
import PhotoIndexFeedContainer from '../photo/photo_index_feed_container';

class SplashPage extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    if (this.props.currentUser) {
      return (
        <div>
          <div className="logged-in-background">
            <PhotoIndexFeedContainer />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="logged-out-splash-wallpaper">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="logged-out-splash-welcome-message">
            <h1 className="logged-out-splash-intro-header">Find your inspiration.</h1>
            <div className="logged-out-splash-intro-text">
              <p>Join the Apertr community, home to photos from people who ran out of free storage on Flickr.</p>
            </div>
            <button
              onClick={() => this.props.login({email: "gabethecommie@gabriel.com", password: "password"})} className="logged-out-splash-signup-button-main"
            >Demo</button>
          </div>
        </div>
      );
    }
  }
}

export default SplashPage;
