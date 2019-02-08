import React from 'react';
import { Link } from 'react-router-dom';
import CommentIndex from '../comment/comment_index';
import CommentCreateContainer from '../comment/comment_create_container';
import TagCreateContainer from '../tag/tag_create_container';
import TagIndexContainer from '../tag/tag_index_container';

class PhotoShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.photo;
    this.state = {
      firstLoad: true,
      openEditableFields: false,
      numComments: null,
      faves: null,
      faveIds: null,
      currentFaveId: null,
      photoIsFaved: false,
      favedUsers: null,
      openFavedUsersPopup: false
    };
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
    this.toggleEditableFields = this.toggleEditableFields.bind(this);
    this.commentCreated = this.commentCreated.bind(this);
    this.commentDeleted = this.commentDeleted.bind(this);
    this.toggleFave = this.toggleFave.bind(this);
    this.toggleFavedUsersPopup = this.toggleFavedUsersPopup.bind(this);
  }

  componentDidMount() {
    this.props.fetchPhoto(this.props.match.params.photoId).then(
      this.props.fetchAllComments(this.props.match.params.photoId).then(
        this.props.fetchAllFaves(this.props.match.params.photoId).then(
          this.props.fetchAllUsers().then(data => {
            let photoFaveIds = this.props.photo.faves;
            this.props.currentUser.fave_ids.forEach(id => {
              if (photoFaveIds.includes(id)) {
                this.state.currentFaveId = id;
                this.state.photoIsFaved = true;
                return;
              }
            });
            let favedUsers = [];
            for (let i=0; i<photoFaveIds.length; i++) {
              let user = this.props.users[this.props.faves[photoFaveIds[i]].user_id]
              favedUsers.push(user)
            }
            this.setState({
              numComments: this.props.comments.length,
              faves: this.props.faves,
              faveIds: this.props.photo.faves,
              favedUsers: favedUsers,
              firstLoad: false
            })
          })
        )
      )
    );
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.match.params.photoId !== this.props.match.params.photoId) {
        this.props.fetchPhoto(this.props.match.params.photoId);
      } else {
        this.setState({
          id: this.props.photo.id,
          title: this.props.photo.title,
          description: this.props.photo.description,
          image_url: this.props.photo.image_url
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  // photo's owner can click to edit the title/description while hovering over them (a pencil icon appears to show editable)
  toggleEditableFields() {
    this.setState({ openEditableFields: !this.state.openEditableFields })
  }

  update(field) {
    return (e) => {
      this.setState({ [field]: e.target.value });
    };
  }

  handleSubmitUpdate(e) {
    e.preventDefault();
    this.props.updatePhoto(this.state);
    this.toggleEditableFields();
  }

  // these two methods are passed as props to comment create and comment index item child components so that when a comment is created/deleted, the number of comments is updated appropriately to state
  commentCreated() {
    this.setState({
      numComments: this.state.numComments + 1
    })
  }

  commentDeleted() {
    this.setState({
      numComments: this.state.numComments - 1
    })
  }

  toggleFave() {
    let updatedFavedUsers = this.state.favedUsers.slice();
    if (!this.state.photoIsFaved) {
      this.props.createFave({ photo_id: this.props.photo.id }).then(data => {
        updatedFavedUsers.unshift(this.props.currentUser);
        this.setState({
          currentFaveId: data.fave.id,
          favedUsers: updatedFavedUsers
        })
      }).then(
        this.setState({
          photoIsFaved: true
        })
      )
    } else {
      this.props.deleteFave(this.state.currentFaveId).then(data => {
        updatedFavedUsers = updatedFavedUsers.filter(user => user.id !== this.props.currentUser.id);
        this.setState({
          favedUsers: updatedFavedUsers,
          photoIsFaved: false
        })
      })
    }
  }

  toggleFavedUsersPopup() {
    this.setState({ openFavedUsersPopup: !this.state.openFavedUsersPopup })
  }

  // renders errors based on Rails model validations
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
    // page shows loading until required data is loaded into state
    if (this.state.firstLoad) {
      return (
        <div className="photo-show-loading">
          <p>Loading...</p>
        </div>
      );
    }

    // only photo owner can see the icon for deleting a photo
    const delPhoto = this.props.currentUser.id === this.props.photo.user_id ?
      <div>
        <Link className="delete-link" onClick={() => this.props.deletePhoto(this.state.id)} to="/feed">
        </Link>
      </div> : ""

    // photo owner can toggle editable fields for the title/description when hovering over them
    const editableFields = this.props.currentUser.id === this.props.photo.user_id ?
      (this.state.openEditableFields ?
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
      <div onClick={this.toggleEditableFields} className="photo-show-editable-details">
        <p className="photo-show-title">{this.state.title}</p>
        <p className="photo-show-description">{this.state.description}</p>
      </div>) :
      <div className="photo-show-static-details">
        <p className="photo-show-title">{this.state.title}</p>
        <p className="photo-show-description">{this.state.description}</p>
      </div>

    let faves;
    if (this.state.favedUsers.length === 0) {
      faves = <p>This photo has not been faved yet. Be the first!</p>
    } else if (this.state.favedUsers.length === 1) {
      let favedUser = this.state.favedUsers[0];
      let favedUserName = favedUser.id === this.props.currentUser.id ? "You" : favedUser.first_name + " " + favedUser.last_name
      faves = <p>
                <Link to={`/users/${favedUser.id}`}>{favedUserName}</Link> faved this.
              </p>
    } else {
      let favedUserNames = [];
      let orderedFavedUsers = [];
      this.state.favedUsers.forEach(user => {
        if (user.id === this.props.currentUser.id) {
          orderedFavedUsers.unshift(user);
          favedUserNames.unshift("You");
        } else {
          orderedFavedUsers.push(user);
          favedUserNames.push(user.first_name + " " + user.last_name);
        }
      })
      let favedUser1 = orderedFavedUsers[0];
      let favedUserName1 = favedUserNames[0];
      let favedUser2 = orderedFavedUsers[1];
      let favedUserName2 = favedUserNames[1];

      if (this.state.favedUsers.length === 2) {
        faves = <p>
                  <Link to={`/users/${favedUser1.id}`}>{favedUserName1}</Link> and <Link to={`/users/${favedUser2.id}`}>{favedUserName2}</Link> faved this.
                </p>
      } else {
        let favedUsersList = orderedFavedUsers.slice(2).map(user => {
          return (
            <Link className="photo-show-faved-user" to={`/users/${user.id}`}>
              <img src={user.profile_pic} />
              {user.first_name} {user.last_name}
            </Link>
          )
        });
        const favedUsersPopup = this.state.openFavedUsersPopup ?
          <div>
            <div onClick={this.toggleFavedUsersPopup} className="popup-overlay"></div>
            <hgroup className="photo-show-faved-users-popup">
              {favedUsersList}
            </hgroup>
          </div> : "";

        faves = <p>
                  <Link to={`/users/${favedUser1.id}`}>{favedUserName1}</Link>, <Link to={`/users/${favedUser2.id}`}>{favedUserName2}</Link>, and <span onClick={this.toggleFavedUsersPopup}>{this.state.favedUsers.length - 2} more people</span> faved this.
                  {favedUsersPopup}
                </p>
      }
    }

    // some code logic for interpolating non-data text
    let numFaves = this.state.favedUsers.length;
    let fave = numFaves === 1 ? "fave" : "faves";
    let numComments = this.state.numComments;
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
            <div className="photo-show-faves-container">
              <i onClick={this.toggleFave} className={this.state.photoIsFaved ? "fas fa-star" : "far fa-star"}></i>
              <div className="photo-show-faves-users">
                {faves}
              </div>
            </div>
            <div className="photo-show-comments-container">
              <CommentIndex
                photo={this.props.photo}
                users={this.props.users}
                currentUser={this.props.currentUser}
                comments={this.props.comments}
                updateComment={this.props.updateComment}
                deleteComment={this.props.deleteComment}
                commentDeleted={this.commentDeleted}
              />
              <CommentCreateContainer
                photo={this.props.photo}
                currentUser={this.props.currentUser}
                commentCreated={this.commentCreated}
              />
            </div>
          </div>
          <div className="photo-show-right-column">
            <div className="photo-show-photo-summary">
              <div className="photo-show-photo-details">
                <div className="photo-show-details-wrapper">
                  <h1>{numFaves}</h1>
                  <p>{fave}</p>
                </div>
                <div className="photo-show-details-wrapper">
                  <h1>{numComments}</h1>
                  <p>{comment}</p>
                </div>
              </div>
              <p>Taken on {uploadMonth} {uploadDay}, {uploadYear}</p>
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
