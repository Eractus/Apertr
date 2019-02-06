import React from "react";
import { Link } from "react-router-dom";

class PhotoIndexFeedItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      favesLoaded: false,
      currentUserFaveIds: this.props.currentUser.fave_ids,
      photoFaveIds: this.props.photo.faves,
      currentFaveId: null,
      photoIsFaved: false
    }

    this.toggleFave = this.toggleFave.bind(this);
  }

  componentDidMount() {
    this.state.currentUserFaveIds.forEach(id => {
      if (this.state.photoFaveIds.includes(id)) {
        this.state.currentFaveId = id;
        this.state.photoIsFaved = true;
        return;
      }
    });
    this.setState({ favesLoaded: true });
  }

  toggleFave() {
    if (!this.state.photoIsFaved) {
      this.props.createFave({ photo_id: this.props.photo.id });
      this.setState({
        currentFaveId: this.state.currentUserFaveIds[this.state.currentUserFaveIds.length - 1],
        currentUserFaveIds: this.state.currentUserFaveIds.push(this.state.currentFaveId),
        photoFaveIds: this.state.photoFaveIds.push(this.state.currentFaveId),
        photoIsFaved: true,
      });
      console.log(this.state.faves)
    } else {
      this.props.deleteFave(this.state.currentFaveId);
      this.setState({
        currentUserFaveIds: this.state.currentUserFaveIds.filter(id => id !== this.state.currentFaveId),
        photoFaveIds: this.state.photoFaveIds.filter(id => id !== this.state.currentFaveId),
        photoIsFaved: false,
      });
      console.log(this.state.faves)
    }
  }

  render() {
    // some logic for interpolating non-data text
    const commentsCount = this.props.photo.comments.length;
    const comments = commentsCount === 1 ? "comment" : "comments";
    const favesCount = this.state.photoFaveIds.length;
    const faves = favesCount === 1 ? "fave" : "faves";

    if (!this.state.favesLoaded) {
      return(
        <div>Loading...</div>
      )
    }

    return (
      <li className="photo-index-feed-item-container">
        <div className="photo-index-feed-item">
          <div className="photo-index-feed-author">
            <img src={this.props.users[this.props.photo.user_id].profile_pic}/>
            <Link to={`/users/${this.props.photo.user_id}`}>
              {this.props.photo.userFname} {this.props.photo.userLname}
            </Link>
          </div>
          <div className="photo-index-feed-image-container">
            <Link to={`/photos/${this.props.photo.id}`}>
              <img className="photo-index-feed-image" src={this.props.photo.image_url} />
            </Link>
          </div>
          <div className="photo-index-feed-title">
            {this.props.photo.title}
          </div>
          <div className="photo-index-feed-details">
            <div className="photo-index-feed-text">
              <p>{favesCount} {faves}</p>
              <p>{commentsCount} {comments}</p>
            </div>
            <div className="photo-index-feed-icons">
              <i onClick={this.toggleFave} className={this.state.photoIsFaved ? "fas fa-star" : "far fa-star"}></i>
            </div>
          </div>
        </div>
      </li>
    );
  }
};

export default PhotoIndexFeedItem;
