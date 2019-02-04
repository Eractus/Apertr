import React from "react";
import { Link } from "react-router-dom";

class PhotoIndexFeedItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      faves: this.props.photo.faves,
      photoIsFaved: null
    }

    this.toggleFave = this.toggleFave.bind(this);
  }

  componentDidMount() {
    if (this.props.fave) {
      this.state.fave = this.props.fave;
      this.state.photoIsFaved = true;
    } else {
      this.state.photoIsFaved = false
    }
  }

  toggleFave() {
    if (!this.props.photoIsFaved) {
      this.props.createFave({ photo_id: this.props.photo.id });
      this.setState({ photoIsFaved: true });
    } else {
      this.props.deleteFave(this.state.fave.id);
      this.setState({ photoIsFaved: false });
    }
  }

  render() {
    // some logic for interpolating non-data text
    const commentsCount = this.props.photo.comments.length;
    const comments = commentsCount === 1 ? "comment" : "comments";
    const favesCount = this.state.faves.length;
    const faves = favesCount === 1 ? "fave" : "faves";

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
