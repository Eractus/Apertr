import { connect } from 'react-redux';
import {
  createAlbum,
  receiveErrors,
  receiveCreatedAlbum
} from '../../actions/album_actions';
import { fetchPhotos } from '../../actions/photo_actions';
import AlbumCreate from './album_create';
import { selectAllCurrentUserPhotos } from '../../reducers/selectors';

const mapStateToProps = state => {
  return {
    errors: state.errors.album,
    userId: state.session.currentUser.id,
    photos: selectAllCurrentUserPhotos(state),
    photoIds: state.session.currentUser.photo_ids
  };
};

const mapDispatchToProps = dispatch => ({
  createAlbum: album => dispatch(createAlbum(album)),
  clearErrors: () => dispatch(receiveErrors([])),
  fetchPhotos: photos => dispatch(fetchPhotos()),
  receiveCreatedAlbum: albumId => dispatch(receiveCreatedAlbum(albumId))
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumCreate);
