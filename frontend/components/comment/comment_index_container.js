import { connect } from 'react-redux';
import { fetchAllUsers } from '../../actions/user_actions';
import { fetchAllComments, deleteComment } from '../../actions/comment_actions';
import CommentIndex from './comment_index';

const mapStateToProps = (state, ownProps) => {
  return ({
    currentUser: state.session.currentUser,
    users: state.users,
    photo: ownProps.photo,
    comments: Object.values(state.comments)
  });
};

const mapDispatchToProps = dispatch => ({
  fetchAllUsers: users => dispatch(fetchAllUsers()),
  fetchAllComments: photoId => dispatch(fetchAllComments(photoId)),
  deleteComment: commentId => dispatch(deleteComment(commentId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentIndex);
