import { connect } from "react-redux";
import AlbumCreateNav from "./album_create_nav";

const mapStateToProps = state => ({
  currentUser: state.session.currentUser
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumCreateNav);
