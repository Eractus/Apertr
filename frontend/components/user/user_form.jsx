import React from 'react';
import { withRouter } from 'react-router-dom';

class UserForm extends React.Component {
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
      <div className="signup-form-container">
        <form onSubmit={this.handleSubmit} className="signup-form-box">
          <h2>Sign Up</h2>
          {this.renderErrors()}
          <div className="signup-form">
            <input
              type="text"
              value={this.state.first_name}
              placeholder="First Name"
              onChange={this.update('first_name')}
              className="signup-input"
            />
            <input
              type="text"
              value={this.state.last_name}
              placeholder="Last Name"
              onChange={this.update('last_name')}
              className="signup-input"
            />
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
            <input type="submit" value="Continue" className="user-submit" />
          </div>
          <br/>
          <h3>Already have an account? {this.props.navLink}</h3>
        </form>
      </div>
    );
  }
}

export default withRouter(UserForm);
