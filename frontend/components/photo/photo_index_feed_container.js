import { connect } from "react-redux";
import { fetchAllUsers } from "../../actions/user_actions";
import { fetchPhotos } from '../../actions/photo_actions';
import { fetchAllComments, createComment } from '../../actions/comment_actions';
import { createFave, deleteFave } from '../../actions/fave_actions';
import PhotoIndexFeed from "./photo_index_feed";

const mapStateToProps = state => ({
  users: state.users,
  currentUser: state.session.currentUser,
  photos: Object.values(state.photos),
  comments: Object.values(state.comments)
});

const mapDispatchToProps = dispatch => ({
  fetchAllUsers: users => dispatch(fetchAllUsers()),
  fetchPhotos: photos => dispatch(fetchPhotos()),
  fetchAllComments: photoId => dispatch(fetchAllComments(photoId)),
  createComment: comment => dispatch(createComment(comment)),
  createFave: fave => dispatch(createFave(fave)),
  deleteFave: faveId => dispatch(deleteFave(faveId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoIndexFeed);
