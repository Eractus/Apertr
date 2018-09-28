import { connect } from "react-redux";
import { fetchAlbum } from '../../actions/album_actions';
import AlbumUpdateNav from "./album_update_nav";

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.session.currentUser,
  album: state.albums[ownProps.match.params.albumId]
});

const mapDispatchToProps = dispatch => ({
  fetchAlbum: id => dispatch(fetchAlbum(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumUpdateNav);
