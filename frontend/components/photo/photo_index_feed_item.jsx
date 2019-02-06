import React from "react";
import { Link } from "react-router-dom";

class PhotoIndexFeedItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      favesLoaded: false,
      currentUserFaveIds: this.props.currentUser.fave_ids,
      photoFaveIds: this.props.photo.faves,
      numFaves: this.props.photo.faves.length,
      currentFaveId: null,
      photoIsFaved: false
    }

    this.toggleFave = this.toggleFave.bind(this);
  }

  componentDidMount() {
    // when feed photo index item first loads, update state if one of the photo's fave id's is the same as one of the current user's fave id to show photo is already faved by current user.
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
    // if current user has not faved this photo, create the fave joins table row between the current user and this photo by their id's, then update this newly created fave's unique id into state in case user clicks again to delete it before ever refreshing the page. increment/decrement a counter in the state appropriately to update the text tracking number of faves currently for the photo.
    if (!this.state.photoIsFaved) {
      this.props.createFave({ photo_id: this.props.photo.id }).then(data => {
        this.setState({
          currentFaveId: data.fave.id,
        })
      }).then(
        this.setState({
          numFaves: this.state.numFaves + 1,
          photoIsFaved: true
        })
      )
    } else {
      this.props.deleteFave(this.state.currentFaveId).then(
        this.setState({
          numFaves: this.state.numFaves - 1,
          photoIsFaved: false
        })
      )
    }
  }

  render() {
    // some logic for interpolating non-data text
    const commentsCount = this.props.photo.comments.length;
    const comments = commentsCount === 1 ? "comment" : "comments";
    const favesCount = this.state.numFaves;
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
