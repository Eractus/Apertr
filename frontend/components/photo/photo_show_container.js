import { connect } from 'react-redux';
import { fetchPhoto,  } from '../../actions/photo_actions.js';
import PhotoShow from './photo_show';

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.session.currentUser,
  photo: state.photos[ownProps.match.params.photoId]
});

const mapDispatchToProps = dispatch => ({
  fetchPhoto: id => dispatch(fetchPhoto(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoShow);
