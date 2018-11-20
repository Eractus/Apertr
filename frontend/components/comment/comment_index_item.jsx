import React from 'react';
import { Link } from 'react-router-dom';

class CommentIndexItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      description: this.props.comment.description,
      toggledEditComment: false
    };

    this.openEditComment = this.openEditComment.bind(this);
    this.closeEditComment = this.closeEditComment.bind(this);
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
  }

  openEditComment() {
    this.setState({ toggledEditComment: true })
  }

  closeEditComment() {
    this.setState({ toggledEditComment: false })
  }

  showCommentFunctions() {

  }

  update(field) {
    return (e) => {
      this.setState({ [field]: e.target.value });
    };
  }

  handleSubmitUpdate(e) {
    e.preventDefault();
    const comment = {
      description: this.state.description,
      user_id: this.props.comment.user_id,
      photo_id: this.props.comment.photo_id
    }
    this.props.updateComment(comment, this.props.comment.id);
    this.closeEditComment();
  }

  render() {
    const commentDescription = this.state.toggledEditComment ?
    <form className="comment-index-item-update-form" onSubmit={this.handleSubmitUpdate}>
      <textarea
        className="comment-index-item-update-form-textarea"
        value={this.state.description}
        onChange={this.update('description')} />
      <input className="comment-index-item-update-button" type="submit" value="Done" />
    </form>
    : this.props.comment.description;


    const commentEdit = this.props.currentUser.id === this.props.comment.user_id ?
      <p onClick={this.openEditComment}>edit</p> : "";
    const commentDelete = this.props.currentUser.id === this.props.photo.user_id ?
      <Link
        onClick={() => this.props.deleteComment(this.props.comment.id)}
        to={`/photos/${this.props.photo.id}`}
      >del</Link> : "";

    return (
      <li>
        <div className="comment-index-item">
          <img src={this.props.users[this.props.comment.user_id].profile_pic} />
          <div className="comment-index-item-details">
            <div className="comment-index-owner">
              <Link to={`/users/${this.props.comment.user_id}`}>
                {this.props.comment.userFname} {this.props.comment.userLname}
              </Link>
            </div>
            <div className="comment-index-description">
              {commentDescription}
            </div>
            <div className="comment-index-item-functions">
              {commentEdit}
              {commentDelete}
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default CommentIndexItem;
