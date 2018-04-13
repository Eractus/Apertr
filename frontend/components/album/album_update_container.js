import { connect } from 'react-redux';
import {
  fetchAlbum,
  updateAlbum,
  receiveErrors,
} from '../../actions/album_actions';
import { fetchPhotos } from '../../actions/photo_actions';
import AlbumUpdate from './album_update';
import { selectAllCurrentUserPhotos } from '../../reducers/selectors';

const mapStateToProps = (state, ownProps) => {
  const album = state.albums[ownProps.match.params.albumId];
  return {
    errors: state.errors.album,
    userId: state.session.currentUser.id,
    album: album,
    userPhotos: selectAllCurrentUserPhotos(state),
    photoIds: state.session.currentUser.photo_ids,
    albumPhotos: album ? Object.values(album.photos) : [],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchAlbum: id => dispatch(fetchAlbum(id)),
  updateAlbum: album => dispatch(updateAlbum(album)),
  clearErrors: () => dispatch(receiveErrors([])),
  fetchPhotos: () => dispatch(fetchPhotos())
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumUpdate);
