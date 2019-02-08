import React from 'react';
import CommentIndexItem from './comment_index_item';

class CommentIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: this.props.comments
    };
  }

  // componentDidMount() {
  //
  // }

  // componentDidUpdate(prevProps) {
  //   if (prevProps !== this.props) {
  //     if (prevProps.photo.id !== this.props.photo.id) {
  //       this.props.fetchAllComments(this.props.photo.id);
  //     } else {
  //       this.setState({
  //         comments: this.props.comments,
  //       });
  //     }
  //   }
  // }

  // display loading until data is loaded into props
  render () {
    // if (this.state.firstLoad) {
    //   return (
    //     <div className="comment-index-container">
    //       <p>Loading...</p>
    //     </div>
    //   );
    // }

    // create an array of comment objects that are passed along with other data/methods as props to comment index item component
    const comments = this.props.comments.map(comment => {
      return (
        <CommentIndexItem
          currentUser={this.props.currentUser}
          users={this.props.users}
          photo={this.props.photo}
          comment={comment}
          updateComment={this.props.updateComment}
          deleteComment={this.props.deleteComment}
          commentDeleted={this.props.commentDeleted} />
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
