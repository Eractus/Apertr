import React from 'react';

class SplashPage extends React.Component {
  constructor(props) {
    super(props);

    this.demoLogIn = this.demoLogIn.bind(this);
  }

  demoLogIn() {
    const demoUser = {email: "gabethecommie@gabriel.com", password: "password"};
    this.props.login(demoUser).then(() => this.props.history.push('/feed'));
  }

  render() {
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
          <button onClick={this.demoLogIn} className="logged-out-splash-signup-button-main">Demo</button>
        </div>
      </div>
    );
  }
}

export default SplashPage;
