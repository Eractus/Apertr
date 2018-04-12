import { connect } from 'react-redux';
import { fetchAlbums } from '../../actions/album_actions';
import { selectAllCurrentUserAlbums } from '../../reducers/selectors';
import AlbumIndex from './album_index';

const mapStateToProps = state => ({
  albums: selectAllCurrentUserAlbums(state),
  userId: state.session.currentUser.id
});

const mapDispatchToProps = dispatch => ({
  fetchAlbums: albums => dispatch(fetchAlbums())
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumIndex);
