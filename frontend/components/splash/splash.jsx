import React from 'react';

class SplashPage extends React.Component {
  constructor(props) {
    super(props);

    this.demoLogIn = this.demoLogIn.bind(this);
  }

  // logs user in with demo account and redirects to /feed page that is only accessible after login
  demoLogIn() {
    const demoUser = {email: "gabethecommie@gabriel.com", password: "password"};
    this.props.login(demoUser).then(() => this.props.history.push('/feed'));
  }

  // span elements represent each image in splash page's background photostream using css background: image-url property
  render() {
    return (
      <div>
        <div className="splash-background-photostream">
          <span className="splash-background-image"></span>
          <span className="splash-background-image"></span>
          <span className="splash-background-image"></span>
          <span className="splash-background-image"></span>
          <span className="splash-background-image"></span>
          <span className="splash-background-image"></span>
        </div>
        <div className="splash-welcome-message">
          <h1 className="splash-intro-header">Find your inspiration.</h1>
          <div className="splash-intro-text">
            <p>Join the Apertr community, home to photos from people who ran out of free storage on Flickr.</p>
          </div>
          <button onClick={this.demoLogIn} className="splash-signup-button-main">Demo</button>
        </div>
      </div>
    );
  }
}

export default SplashPage;
