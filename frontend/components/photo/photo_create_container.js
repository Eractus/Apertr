import { connect } from 'react-redux';
import { createPhoto } from '../../actions/photo_actions';
import PhotoCreate from './photo_create';

const mapStateToProps = state => ({
  errors: state.errors,
  userId: state.session.currentUser.id
});

const mapDispatchToProps = dispatch => ({
  createPhoto: photo => dispatch(createPhoto(photo))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCreate);
