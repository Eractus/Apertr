import React from 'react';
import { Link } from 'react-router-dom';
import CommentIndexContainer from '../comment/comment_index_container';
import CommentCreateContainer from '../comment/comment_create_container';
import TagCreateContainer from '../tag/tag_create_container';
import TagIndexContainer from '../tag/tag_index_container';

class PhotoShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.photo;
    this.state = { toggledEditableFields: false };
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
    this.openEditableFields = this.openEditableFields.bind(this);
    this.closeEditableFields = this.closeEditableFields.bind(this);
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

  openEditableFields() {
    this.setState({ toggledEditableFields: true })
  }

  closeEditableFields() {
    this.setState({ toggledEditableFields: false })
  }

  update(field) {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  handleSubmitUpdate(e) {
    e.preventDefault();
    this.props.updatePhoto(this.state);
    this.closeEditableFields();
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
      </div>
    );
  }

  photoLoggedIn() {
    if (!this.props.photo) {
      return (
        <div>Loading...</div>
      )
    }

    const editableFields = (this.state.toggledEditableFields) ?
      <form className="update-form" onSubmit={this.handleSubmitUpdate}>
        <input
          className="update-form-text"
          type="text"
          value={this.state.title}
          onChange={this.update('title')} />
        <textarea
          className="update-form-textarea"
          value={this.state.description}
          onChange={this.update('description')} />
        <input className="update-button" type="submit" value="Done" />
      </form> :
      <div onClick={this.openEditableFields} className="photo-show-editable-fields">
        <p className="photo-show-title">{this.state.title}</p>
        <p className="photo-show-description">{this.state.description}</p>
      </div>

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
            <div className="photo-show-edit-errors">{this.renderErrors()}</div>
            <p className="photo-show-author">{this.props.photo.userFname} {this.props.photo.userLname}</p>
            {editableFields}
          </div>
          <div className="photo-show-ui">
            <CommentIndexContainer photo={this.props.photo}/>
            <CommentCreateContainer photo={this.props.photo}/>
            <div className="tags-container">
              <TagCreateContainer photo={this.props.photo}/>
              <TagIndexContainer photo={this.props.photo}/>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="photo-show-background">
          <div className="photo-show">
            <img src={this.props.photo.image_url} />
          </div>
          <div className="photo-show-container">
            <div className="photo-show-edit-errors">{this.renderErrors()}</div>
            <p className="photo-show-author">{this.props.photo.userFname} {this.props.photo.userLname}</p>
            <p className="photo-show-title">{this.state.title}</p>
            <p className="photo-show-description">{this.state.description}</p>
          </div>
          <div className="photo-show-ui">
            <CommentIndexContainer photo={this.props.photo}/>
            <CommentCreateContainer photo={this.props.photo}/>
            <div className="tags-container">
              <TagCreateContainer photo={this.props.photo}/>
              <TagIndexContainer photo={this.props.photo}/>
            </div>
          </div>
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
