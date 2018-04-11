import { connect } from 'react-redux';
import { createAlbum, receiveErrors } from '../../actions/album_actions';
import { fetchPhotos } from '../../actions/photo_actions';
import AlbumCreate from './album_create';

const mapStateToProps = state => ({
  errors: state.errors.album,
  photos: Object.values(state.photos),
  userId: state.session.currentUser.id
});

const mapDispatchToProps = dispatch => ({
  createAlbum: album => dispatch(createAlbum(album)),
  clearErrors: () => dispatch(receiveErrors([])),
  fetchPhotos: photos => dispatch(fetchPhotos())
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumCreate);
