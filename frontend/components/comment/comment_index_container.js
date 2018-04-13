import { connect } from 'react-redux';
import { fetchAllComments, deleteComment } from '../../actions/comment_actions';
import CommentIndex from './comment_index';

const mapStateToProps = (state, ownProps) => {
  return ({
    photoId: ownProps.photo.id,
    comments: Object.values(state.comments)
  });
};

const mapDispatchToProps = dispatch => ({
  fetchAllComments: photoId => dispatch(fetchAllComments(photoId)),
  deleteComment: commentId => dispatch(deleteComment(commentId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentIndex);
