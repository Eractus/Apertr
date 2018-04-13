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
  return {
    errors: state.errors.album,
    userId: state.session.currentUser.id,
    albumPhotos: Object.values(
      state.albums[ownProps.match.params.albumId].photos),
    userPhotos: selectAllCurrentUserPhotos(state),
    photoIds: state.session.currentUser.photo_ids,
    album: state.albums[ownProps.match.params.albumId]
  };
};

const mapDispatchToProps = dispatch => ({
  fetchAlbum: album => dispatch(fetchAlbum(album)),
  updateAlbum: album => dispatch(updateAlbum(album)),
  clearErrors: () => dispatch(receiveErrors([])),
  fetchPhotos: photos => dispatch(fetchPhotos())
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumUpdate);
