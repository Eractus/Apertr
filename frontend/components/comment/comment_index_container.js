import { connect } from 'react-redux';
import { fetchAllUsers } from '../../actions/user_actions';
import { fetchAllComments, updateComment, deleteComment } from '../../actions/comment_actions';
import CommentIndex from './comment_index';

const mapStateToProps = (state, ownProps) => ({
  comments: Object.values(state.comments)
});

const mapDispatchToProps = dispatch => ({
  fetchAllComments: photoId => dispatch(fetchAllComments(photoId)),
  updateComment: (comment, id) => dispatch(updateComment(comment, id)),
  deleteComment: commentId => dispatch(deleteComment(commentId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentIndex);
