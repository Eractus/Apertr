import React from 'react';
import { Link } from 'react-router-dom'
import Footer from '../footer/footer';

class PhotoShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.photo;
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
  }

  componentDidMount() {
    this.props.fetchPhoto(this.props.match.params.photoId)
  }

  componentWillUnmount() {
    this.props.clearErrors()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.photoId != nextProps.match.params.photoId) {
      this.props.fetchPhoto(nextProps.match.params.photoId);
    } else {
      this.setState({ id: nextProps.photo.id,
        title: nextProps.photo.title,
        description: nextProps.photo.description,
        image_url: nextProps.photo.image_url
      });
    }
  }

  update(field) {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  handleSubmitUpdate(e) {
    e.preventDefault();
    this.props.updatePhoto(this.state)
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

  photoLoggedOut() {
    return (
      <div className="photo-show-background">
        <div className="photo-show">
          <img src={this.props.photo.image_url} />
        </div>
        <Footer />
      </div>
    );
  }

  photoLoggedIn() {
    if (!this.props.photo) {
      return (
        <div>Loading...</div>
      )
    }
    if (this.props.currentUser.id === this.props.photo.user_id) {
      return (
        <div className="photo-show-background">
          <div className="photo-show">
            <img src={this.props.photo.image_url} />
            <div>
              <Link className="delete-link" onClick={() => this.props.deletePhoto(this.state.id)} to="/">
              Delete
              </Link>
            </div>
          </div>
          <div className="photo-show-container">
            <div>{this.renderErrors()}</div>
            <h3>{this.props.photo.userFname} {this.props.photo.userLname}</h3>
            <form className="update-form" onSubmit={this.handleSubmitUpdate}>
              <input
                className="update-form-text"
                type="text"
                value={this.state.title}
                onChange={this.update('title')} />
              <input
                className="update-form-textarea"
                type="textarea"
                value={this.state.description}
                onChange={this.update('description')} />
              <input className="update-button" type="submit" value="Done" />
            </form>
          </div>
          <Footer />
        </div>
      );
    } else {
      return (
        <div className="photo-show-background">
          <div className="photo-show">
            <img src={this.props.photo.image_url} />
          </div>
          <Footer />
        </div>
      );
    }
  }

  render() {
    if (!this.props.photo) {
      return (
        <div>Loading...</div>
      )
    }
    return (
      this.props.currentUser ? this.photoLoggedIn() : this.photoLoggedOut()
    );
  }
}

export default PhotoShow;
