import React from 'react';
import CommentIndexItem from './comment_index_item';

class CommentIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.comments,
      firstLoad: true
    };
  }

  componentDidMount() {
    this.props.fetchAllComments(this.props.photo.id);
    this.props.fetchAllUsers().then(() => this.setState({ firstLoad: false}));
  }

  render () {
    const comments = this.props.comments.map(comment => {
      return (
        <CommentIndexItem
          currentUser={this.props.currentUser}
          users={this.props.users}
          photo={this.props.photo}
          comment={comment}
          deleteComment={this.props.deleteComment} />
      );
    });

    if (this.state.firstLoad) {
      return (
        <div className="comment-index-container">
          <p className="comment-index-loading">Loading...</p>
        </div>
      );
    } else {
      return (
        <div className="comment-index-container">
          <ul className="comment-index-list">
            {comments}
          </ul>
        </div>
      );
    }
  }
}

export default CommentIndex;
