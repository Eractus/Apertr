import React from 'react';

class UserCreateNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="signup-form-navbar">
        <div className="signup-form-navbar-logo-container">
          <img
            onClick={()=>this.props.history.push('/')}
            className="signup-form-navbar-logo"
            src="https://s3-us-west-1.amazonaws.com/apertr-dev/photos/images/static+images/yeehaw.png"/>
        </div>
      </nav>
    );
  }
}

export default UserCreateNav;
