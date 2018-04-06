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
      <div className="session-form-container">
        <form onSubmit={this.handleSubmit} className="session-form-box">
          <div className="session-form">
            <div className="session-text">
              <h2>Sign In</h2>
              {this.renderErrors()}
              <br/>
            </div>
            <input
              type="text"
              value={this.state.email}
              placeholder="Enter your email"
              onChange={this.update('email')}
              className="session-input"
            />
            <br/>
            <input
              type="password"
              value={this.state.password}
              placeholder="Password"
              onChange={this.update('password')}
              className="session-input"
            />
            <br/>
            <input type="submit" value="Sign in" className="session-submit" />
            <br/>
            <div className="session-text-bottom">
              <p>Don't have an account?</p>
              <div>{this.props.navLink}</div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(SessionForm);
