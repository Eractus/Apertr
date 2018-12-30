import { connect } from 'react-redux';
import { fetchUser, fetchAllUsers } from '../../actions/user_actions';
import { fetchPhotos } from '../../actions/photo_actions';
import { fetchAlbums, deleteAlbum } from '../../actions/album_actions';
import UserShow from './user_show';

const mapStateToProps = (state, ownProps) => ({
  user: state.users[ownProps.match.params.userId],
  users: state.users,
  currentUser: state.session.currentUser,
  photos: Object.values(state.photos),
  albums: Object.values(state.albums)
});

const mapDispatchToProps = dispatch => ({
  fetchUser: id => dispatch(fetchUser(id)),
  fetchAllUsers: users => dispatch(fetchAllUsers()),
  fetchPhotos: photos => dispatch(fetchPhotos()),
  fetchAlbums: albums => dispatch(fetchAlbums()),
  deleteAlbum: albumId => dispatch(deleteAlbum(albumId))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserShow);
