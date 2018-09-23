import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfilePopup: false,
      search: this.props.searchParams,
      searchErrorMessage: '',
    };
    this.handleOpenProfilePopup = this.handleOpenProfilePopup.bind(this);
    this.handleCloseProfilePopup = this.handleCloseProfilePopup.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.update = this.update.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  handleOpenProfilePopup() {
    this.setState({ showProfilePopup: true})
  }

  handleCloseProfilePopup() {
    this.setState({ showProfilePopup: false})
  }

  handleLogOut() {
    this.handleCloseProfilePopup();
    this.props.logout();
  }

  handleSubmitSearch() {
    let searchParams = this.state.search;
    if (!searchParams || searchParams.trim().length === 0) {
      this.setState({
        searchErrorMessage: 'Search field cannot be empty.',
        search: ''
      })
      return;
    } else {
      this.setState({
        searchErrorMessage: '',
      })
    }
    this.setState({ search: '' });
    this.props.searchTaggedPhotos(searchParams).then(
      this.props.history.push(`/search/photos/${searchParams}`)
    );
  }

  update(e) {
    return this.setState({
      search: e.target.value
    })
  }

  sessionLoggedOut() {
    return (
      <header>
        <nav className="logged-out-navbar">
          <Link to="/" className="logo-link-logged-out">
            <h1>apertr</h1>
          </Link>
          <div className="navbar-logged-out-links">
            <Link to="/signup" className="signup-button"><button>Sign Up</button></Link>
            &nbsp;
            <Link to="/login" className="login-link">Log In</Link>
          </div>
        </nav>
      </header>
    );
  }

  sessionLoggedIn() {
    let email = this.props.currentUser.email;
    let name = email.substring(0, email.lastIndexOf("@"));
    const greetings = [
      ["Yo", "English"],
      ["Ni hao", "Chinese"],
      ["Li ho", "Taiwanese"],
      ["Hola", "Spanish"],
      ["Bonjour", "French"],
      ["Konichiwa", "Japanese"],
      ["Aloha", "Hawaiian"],
      ["Góðan daginn", "Icelandic"]
    ]
    let selectGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    let currentGreetingPhrase = selectGreeting[0];
    let currentGreetingLang = selectGreeting[1];
    const profilePopUp = (this.state.showProfilePopup) ?
    <div>
      <div onClick={this.handleCloseProfilePopup} className="popup-overlay"></div>
      <hgroup className="navbar-popup">
        <h2 className="navbar-greet-name">{currentGreetingPhrase}, {name}!</h2>
        <p className="navbar-greet-text">Now you know how to greet people in {currentGreetingLang}</p>
        <Link className="navbar-signout-link" to="/" onClick={this.handleLogOut}>Sign Out</Link>
      </hgroup>
    </div> : "";


    return (
      <header>
        <nav className="logged-in-navbar">
          <div className="navbar-logged-in-left">
            <Link to="/" className="logo-link-logged-in">
              <h1>apertr</h1>
            </Link>
            <div className="navbar-logged-in-links">
              <Link className="navbar-left-links" to={`/users/${this.props.currentUser.id}`}>You</Link>
            </div>
          </div>
          <div className="navbar-logged-in-right">
            <div className="search-bar-logged-in">
              <p className="search-bar-nav-error">{this.state.searchErrorMessage}</p>
              <form className="search-bar-input-field" onSubmit={this.handleSubmitSearch}>
                <span className="fas fa-search"></span>
                <input
                  type="text"
                  onChange={this.update}
                  placeholder="Search photos"
                  value={this.state.search}
                />
              </form>
            </div>
            <Link className="navbar-upload-photo" to="/photos/new">
              <span></span>
            </Link>
            <div className="profile-popup">
              <span>
                <img
                  src={this.props.currentUser.image_url}
                  onClick={this.handleOpenProfilePopup}
                />
                {profilePopUp}
              </span>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  render() {
    return (
      this.props.currentUser ? this.sessionLoggedIn() : this.sessionLoggedOut()
    );
  }
}

export default withRouter(Navbar);
