import { connect } from 'react-redux';
import { createPhoto, receiveErrors } from '../../actions/photo_actions';
import PhotoCreate from './photo_create';

const mapStateToProps = state => ({
  errors: state.errors.photo,
  userId: state.session.currentUser.id
});

const mapDispatchToProps = dispatch => ({
  createPhoto: photo => dispatch(createPhoto(photo)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCreate);
