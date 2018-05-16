import React from 'react';
import CommentIndexItem from './comment_index_item';

class CommentIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.comments
    };
  }

  componentDidMount() {
    this.props.fetchAllComments(this.props.photoId)
  }

  render () {
    if (this.props.comments.length === 0) {
      return (
        <div>No comments yet...</div>
      )
    }

    const comments = this.props.comments.map(comment => {
      return (
        <CommentIndexItem
          key={comment.id}
          comment={comment}
          photoId={this.props.photoId}
          deleteComment={this.props.deleteComment} />
      );
    });

    return (
      <div className="comment-index-container">
        <ul className="comment-index-list">
          {comments}
        </ul>
      </div>
    );
  }
}

export default CommentIndex;