import React from 'react';

class UserCreateNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="user-create-navbar">
        <div className="user-create-navbar-logo">
          <img
            onClick={()=>this.props.history.push('/')}
            src="https://s3-us-west-1.amazonaws.com/apertr-dev/photos/images/static+images/yeehaw.png"/>
        </div>
      </nav>
    );
  }
}

export default UserCreateNav;
