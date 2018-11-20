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
    this.props.fetchAllComments(this.props.photo.id).then(() => this.setState({ firstLoad: false }));
  }

  render () {
    if (this.state.firstLoad) {
      return (
        <div className="comment-index-container">
          <p>Loading...</p>
        </div>
      );
    }

    const comments = this.props.comments.map(comment => {
      return (
        <CommentIndexItem
          currentUser={this.props.currentUser}
          users={this.props.users}
          photo={this.props.photo}
          comment={comment}
          updateComment={this.props.updateComment}
          deleteComment={this.props.deleteComment} />
      );
    });

    return (
      <div className="comment-index-container">
        <ul>
          {comments}
        </ul>
      </div>
    );
  }
}

export default CommentIndex;
