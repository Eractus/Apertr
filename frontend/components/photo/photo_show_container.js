import { connect } from 'react-redux';
import { fetchAllUsers } from '../../actions/user_actions';
import {
  fetchPhoto,
  updatePhoto,
  deletePhoto,
  receiveErrors
} from '../../actions/photo_actions.js';
import PhotoShow from './photo_show';

const mapStateToProps = (state, ownProps) => ({
  errors: state.errors.photo,
  users: state.users,
  currentUser: state.session.currentUser,
  photo: state.photos[ownProps.match.params.photoId]
});

const mapDispatchToProps = dispatch => ({
  fetchAllUsers: users => dispatch(fetchAllUsers()),
  fetchPhoto: id => dispatch(fetchPhoto(id)),
  updatePhoto: photo => dispatch(updatePhoto(photo)),
  deletePhoto: photoId => dispatch(deletePhoto(photoId)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoShow);
