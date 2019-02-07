import React from "react";
import { Link } from "react-router-dom";

class PhotoIndexFeedItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      commentsLoaded: false,
      photoCommentIds: this.props.photo.comments,
      numComments: this.props.photo.comments.length,
      favesLoaded: false,
      currentUserFaveIds: this.props.currentUser.fave_ids,
      photoFaveIds: this.props.photo.faves,
      numFaves: this.props.photo.faves.length,
      currentFaveId: null,
      photoIsFaved: false,
      toggledCommentsPopUp: false,
      description: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleComments = this.toggleComments.bind(this);
    this.toggleFave = this.toggleFave.bind(this);
  }

  componentDidMount() {
    // after loading all comments for this photo index item on the feed, set it to state
    this.props.fetchAllComments(this.props.photo.id).then(
      data => this.setState({ comments: data.comments })
    ).then(
      this.setState({ commentsLoaded: true })
    )
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

  update(field) {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  // after creating comment, pull the new comment object from data in promise and update the state for comments object as well as array of photo's comment ids and set it to state as well as resetting value of description to empty string and close comments popup
  handleSubmit(e) {
    e.preventDefault();
    this.props.createComment({
      description: this.state.description,
      user_id: this.props.currentUser.id,
      photo_id: this.props.photo.id
    }).then(data => {
      let newComment = data.comment;
      let updatedComments = this.state.comments;
      updatedComments[newComment.id] = newComment;
      let updatedCommentIds = this.state.photoCommentIds.slice();
      updatedCommentIds.push(newComment.id);
      this.setState({
        comments: updatedComments,
        photoCommentIds: updatedCommentIds,
        numComments: this.state.numComments + 1,
        description: ""
      });
    });
    this.toggleComments();
  }

  // toggles whether the comments popup is opened
  toggleComments() {
    this.setState({ toggledCommentsPopUp: !this.state.toggledCommentsPopUp });
  }

  // if current user has not faved this photo, create the fave joins table row between the current user and this photo by their id's, then update this newly created fave's unique id into state in case user clicks again to delete it before ever refreshing the page. increment/decrement a counter in the state appropriately to update the text tracking number of faves currently for the photo.
  toggleFave() {
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
    const commentsCount = this.state.numComments;
    const comments = commentsCount === 1 ? "comment" : "comments";
    const favesCount = this.state.numFaves;
    const faves = favesCount === 1 ? "fave" : "faves";

    // when popup is toggled open, determine the actual (up to 3) comment objects to display
    let lastThreeComments;
    if (this.state.toggledCommentsPopUp) {
      // depending on how many comments the photo has, determine which (up to the last 3) of the photo item's comment id's should be used for its comments popup
      let commentsArr = this.state.photoCommentIds;
      let displayedComments;
      if (commentsArr.length === 0) {
        displayedComments = [];
      } else if (commentsArr.length > 0 && commentsArr.length <= 3){
        displayedComments = commentsArr;
      } else {
        displayedComments = commentsArr.slice(commentsArr.length - 3, commentsArr.length);
      }

      if (displayedComments.length === 0) {
        lastThreeComments = "";
      } else {
        lastThreeComments = displayedComments.map(commentId => {
          let comment = this.state.comments[commentId]
          return(
            <div className="comment-index-item">
              <img src={this.props.users[comment.user_id].profile_pic} />
              <div className="comment-index-item-details">
                <div className="comment-index-owner">
                  <Link to={`/users/${comment.user_id}`}>
                    {comment.userFname} {comment.userLname}
                  </Link>
                </div>
                <div className="photo-index-feed-comment-description">
                  <p>{comment.description}</p>
                </div>
              </div>
            </div>
          )
        });
      }
    }

    // in addition to the comment item objects from above, also display a link to the photo's show page to see the rest of the comments as well as a create form for the current user to create a new comment from the feed's photo index item directly
    const commentsPopUp = (this.state.toggledCommentsPopUp) ?
      <div>
        <div onClick={this.toggleComments} className="popup-overlay"></div>
        <hgroup className="photo-index-feed-comment-popup">
          <Link to={`/photos/${this.props.photo.id}`}>View all comments on the photo page</Link>
          {lastThreeComments}
          <div className="comment-create-container">
            <img src={this.props.currentUser.profile_pic} />
            <form onSubmit={this.handleSubmit}>
              <textarea
                className="comment-create-description"
                value={this.state.description}
                placeholder="Add a comment"
                onChange={this.update('description')} />
              <input className="comment-create-button" type="submit" value="Comment" />
            </form>
          </div>
        </hgroup>
      </div> : "";

    if (!this.state.commentsLoaded || !this.state.favesLoaded) {
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
              <i onClick={this.toggleComments} className="far fa-comment"></i>
              {commentsPopUp}
            </div>
          </div>
        </div>
      </li>
    );
  }
};

export default PhotoIndexFeedItem;
