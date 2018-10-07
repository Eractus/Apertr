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
    this.state = {
      firstLoad: true,
      toggledEditableFields: false
    };
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
    this.openEditableFields = this.openEditableFields.bind(this);
    this.closeEditableFields = this.closeEditableFields.bind(this);
  }

  componentDidMount() {
    this.props.fetchPhoto(this.props.match.params.photoId).then(
      this.props.fetchAllUsers().then(
        () => this.setState({ firstLoad: false })
      )
    );
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.props.clearErrors();
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
      this.setState({ [field]: e.target.value });
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

  render() {
    if (this.state.firstLoad) {
      return (
        <div className="photo-show-loading">
          <p>Loading...</p>
        </div>
      );
    }

    const delPhoto = this.props.currentUser.id === this.props.photo.user_id ?
      <div>
        <Link className="delete-link" onClick={() => this.props.deletePhoto(this.state.id)} to="/feed">
        </Link>
      </div> : ""

    const editableFields = this.props.currentUser.id === this.props.photo.user_id ?
      (this.state.toggledEditableFields ?
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
      <div onClick={this.openEditableFields} className="photo-show-editable-details">
        <p className="photo-show-title">{this.state.title}</p>
        <p className="photo-show-description">{this.state.description}</p>
      </div>) :
      <div className="photo-show-static-details">
        <p className="photo-show-title">{this.state.title}</p>
        <p className="photo-show-description">{this.state.description}</p>
      </div>

    let numComments = Object.values(this.props.photo.comments).length;
    let comment = numComments === 1 ? "comment" : "comments";
    const months = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      "10": "October",
      "11": "November",
      "12": "December",
    }
    const createDate = this.props.photo.created_at;
    let uploadMonth = months[createDate.slice(5,7)];
    let uploadDay = createDate.slice(8,10);
    let uploadYear = createDate.slice(0,4);

    return (
      <div className="photo-show-background">
        <div className="photo-show">
          <img src={this.props.photo.image_url} />
          {delPhoto}
        </div>
        <div className="photo-show-container">
          <div className="photo-show-left-column">
            <div className="photo-show-owner-specs">
              <img src={this.props.users[this.props.photo.user_id].profile_pic} />
              <div className="photo-show-owner-details">
                <div className="photo-show-edit-errors">{this.renderErrors()}</div>
                <Link to={`/users/${this.props.photo.user_id}`} className="photo-show-author">
                  {this.props.photo.userFname} {this.props.photo.userLname}
                </Link>
                {editableFields}
              </div>
            </div>
            <div className="photo-show-comments-container">
              <CommentIndexContainer
                photo={this.props.photo}
                users={this.props.users}
                currentUser={this.props.currentUser}
              />
              <CommentCreateContainer
                photo={this.props.photo}
                currentUser={this.props.currentUser}
              />
            </div>
          </div>
          <div className="photo-show-right-column">
            <div className="photo-show-photo-summary">
              <div className="photo-show-photo-details">
                <h1>{numComments}</h1>
                <p>{comment}</p>
              </div>
              <p>Uploaded on {uploadMonth} {uploadDay} {uploadYear}</p>
            </div>
            <div className="photo-show-tags-container">
              <TagCreateContainer photo={this.props.photo}/>
              <TagIndexContainer
                photo={this.props.photo}
                currentUser={this.props.currentUser}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhotoShow;
