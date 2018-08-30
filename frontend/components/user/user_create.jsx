import React from 'react';
import { withRouter } from 'react-router-dom';

class UserCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  update(field) {
    return (e) => this.setState({ [field]: e.currentTarget.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.signupForm(user).then(() => this.props.history.push('/'));
  }

  renderErrors() {
    return(
      <ul>
        {this.props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  render () {
    return (
      <div className="signup-form-page">
        <nav className="signup-form-navbar">
          <div className="signup-form-navbar-logo-container">
            <img
              onClick={()=>this.props.history.push('/')}
              className="signup-form-navbar-logo"
              src="https://s3-us-west-1.amazonaws.com/apertr-dev/photos/images/static+images/yeehaw.png"/>
          </div>
        </nav>
        <div className="signup-form-container">
          <form onSubmit={this.handleSubmit} className="signup-form-box">
            <div className="signup-form">
              <div className="signup-text">
                <h2>Sign Up</h2>
                {this.renderErrors()}
                <br/>
              </div>
              <div className="signup-name">
                <input
                  type="text"
                  value={this.state.first_name}
                  placeholder="First Name"
                  onChange={this.update('first_name')}
                  className="signup-fname"
                />
                <input
                  type="text"
                  value={this.state.last_name}
                  placeholder="Last Name"
                  onChange={this.update('last_name')}
                  className="signup-lname"
                />
              </div>
              <br/>
              <input
                type="text"
                value={this.state.email}
                placeholder="Your current email address"
                onChange={this.update('email')}
                className="signup-input"
              />
              <br/>
              <input
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={this.update('password')}
                className="signup-input"
              />
              <br/>
              <input type="submit" value="Continue" className="signup-submit" />
              <br/>
              <div className="signup-text-bottom">
                <p>Already have an account?</p>
                <div>{this.props.navLink}</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(UserCreate);
