import React from 'react';
import { withRouter } from 'react-router-dom';

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors()
  }

  update(field) {
    return (e) => this.setState({ [field]: e.currentTarget.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.loginForm(user).then(() => this.props.history.push('/'));
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
      <div className="session-create-page">
        <div className="session-create-container">
          <form onSubmit={this.handleSubmit} className="session-create-form">
            <div className="session-create-details">
              <div className="session-create-logo-container">
                <img
                  src="https://s3-us-west-1.amazonaws.com/apertr-dev/photos/images/static+images/yeehaw.png"
                />
              </div>
              <div className="session-create-text-top">
                <h2>Sign In</h2>
                <p>{this.renderErrors()}</p>
                <br/>
              </div>
              <input
                type="text"
                value={this.state.email}
                placeholder="Enter your email"
                onChange={this.update('email')}
                className="session-create-input"
              />
              <input
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={this.update('password')}
                className="session-create-input"
              />
              <input type="submit" value="Sign in" className="session-create-submit" />
              <div className="session-create-text-bottom">
                <p>Don't have an account?</p>
                <div>{this.props.navLink}</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(SessionForm);
