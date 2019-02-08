import { connect } from 'react-redux';
import { fetchAllUsers } from '../../actions/user_actions';
import {
  fetchPhoto,
  updatePhoto,
  deletePhoto,
  receiveErrors
} from '../../actions/photo_actions.js';
import { fetchAllComments, updateComment, deleteComment } from '../../actions/comment_actions';
import { fetchAllFaves, createFave, deleteFave } from '../../actions/fave_actions';
import PhotoShow from './photo_show';

const mapStateToProps = (state, ownProps) => ({
  errors: state.errors.photo,
  users: state.users,
  currentUser: state.session.currentUser,
  photo: state.photos[ownProps.match.params.photoId],
  comments: Object.values(state.comments),
  faves: state.faves
});

const mapDispatchToProps = dispatch => ({
  fetchAllUsers: users => dispatch(fetchAllUsers()),
  fetchPhoto: id => dispatch(fetchPhoto(id)),
  updatePhoto: photo => dispatch(updatePhoto(photo)),
  deletePhoto: photoId => dispatch(deletePhoto(photoId)),
  clearErrors: () => dispatch(receiveErrors([])),
  fetchAllComments: photoId => dispatch(fetchAllComments(photoId)),
  updateComment: (comment, id) => dispatch(updateComment(comment, id)),
  deleteComment: commentId => dispatch(deleteComment(commentId)),
  fetchAllFaves: photoId => dispatch(fetchAllFaves(photoId)),
  createFave: fave => dispatch(createFave(fave)),
  deleteFave: faveId => dispatch(deleteFave(faveId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoShow);
