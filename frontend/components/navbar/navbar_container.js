import { connect } from "react-redux";
import { logout } from "../../actions/session_actions";
import { searchTaggedPhotos } from "../../actions/photo_actions";
import { withRouter } from "react-router-dom";
import Navbar from "./navbar";

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser,
    searchParams: ownProps.match.params.searchParams,
    errors: state.errors.search,
  };
};

const mapDispatchToProps = dispatch => ({
  searchTaggedPhotos: (tag) => dispatch(searchTaggedPhotos(tag)),
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
