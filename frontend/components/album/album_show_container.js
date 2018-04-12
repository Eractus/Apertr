import { connect } from 'react-redux';
import {
  fetchAlbum,
  updateAlbum,
  deleteAlbum,
  receiveErrors
} from '../../actions/album_actions';
import AlbumShow from './album_show';

const mapStateToProps = (state, ownProps) => ({
  errors: state.errors.album,
  currentUser: state.session.currentUser,
  album: state.albums[ownProps.match.params.albumId]
});

const mapDispatchToProps = dispatch => ({
  fetchAlbum: id => dispatch(fetchAlbum(id)),
  updateAlbum: album => dispatch(updateAlbum(album)),
  deleteAlbum: albumId => dispatch(deleteAlbum(albumId)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumShow);
