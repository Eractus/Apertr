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
    this.toggleProfilePopup = this.toggleProfilePopup.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.update = this.update.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  // opens/closes profile popup where user can log out
  toggleProfilePopup() {
    this.setState({ showProfilePopup: !this.state.showProfilePopup})
  }

  handleLogOut() {
    this.toggleProfilePopup();
    this.props.logout().then(() => this.props.history.push("/"));
  }

  handleSubmitSearch() {
    let searchParams = this.state.search;
    // populate search error message field in state if user tries to search without typing anything
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
    // resets search bar field to blank before redirecting user to page (since navbar is shared between the pages) based on their searched parameter
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

  // navbar for splash while not logged in
  sessionLoggedOut() {
    return (
      <header>
        <nav className="navbar-logged-out">
          <Link to="/" className="navbar-logged-out-logo">
            <h1>apertr</h1>
          </Link>
          <div className="navbar-logged-out-redirects">
            <Link to="/login" className="navbar-logged-out-login-link">Log In</Link>
            <Link to="/signup" className="navbar-logged-out-signup-button"><button>Sign Up</button></Link>
          </div>
        </nav>
      </header>
    );
  }

  // navbar for splash while logged in with added features
  sessionLoggedIn() {
    // code logic for interpolating non-data text in the profile popup
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
    // randomly picks a greeting when user opens profile popup, just like Flickr's site
    let selectGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    let currentGreetingPhrase = selectGreeting[0];
    let currentGreetingLang = selectGreeting[1];

    // displays HTML for profile popup on page based on boolean value
    const profilePopUp = (this.state.showProfilePopup) ?
    <div>
      <div onClick={this.toggleProfilePopup} className="popup-overlay"></div>
      <hgroup className="navbar-logged-in-popup">
        <h2 className="navbar-logged-in-greet-name">{currentGreetingPhrase}, {name}!</h2>
        <p className="navbar-logged-in-greet-text">Now you know how to greet people in {currentGreetingLang}</p>
        <a className="navbar-logged-in-signout-link" onClick={this.handleLogOut}>Sign Out</a>
      </hgroup>
    </div> : "";

    return (
      <header>
        <nav className="navbar-logged-in">
          <div className="navbar-logged-in-left">
            <Link to="/feed" className="navbar-logged-in-logo">
              <h1>apertr</h1>
            </Link>
            <div className="navbar-logged-in-links">
              <Link to={`/users/${this.props.currentUser.id}`}>You</Link>
            </div>
          </div>
          <div className="navbar-logged-in-right">
            <div className="navbar-logged-in-search-bar">
              <p
                className="navbar-logged-in-search-bar-error"
              >{this.state.searchErrorMessage}</p>
              <form className="navbar-logged-in-search-bar-input-field" onSubmit={this.handleSubmitSearch}>
                <span id="navbar-logged-in-search-bar-logo" className="fas fa-search"></span>
                <input
                  type="text"
                  onChange={this.update}
                  placeholder="Search photos (try 'nature', 'canon', or 'tennis')"
                  value={this.state.search}
                />
              </form>
            </div>
            <Link className="navbar-logged-in-upload-icon" to="/photos/upload">
            </Link>
            <div className="navbar-logged-in-profile-popup">
              <img
                src={this.props.currentUser.profile_pic}
                onClick={this.toggleProfilePopup}
              />
              {profilePopUp}
            </div>
          </div>
        </nav>
      </header>
    );
  }

  // renders the appropriate navbar based on whether user logged in
  render() {
    return (
      this.props.currentUser ? this.sessionLoggedIn() : this.sessionLoggedOut()
    );
  }
}

export default withRouter(Navbar);
