import { connect } from "react-redux";
import { logout } from "../../actions/session_actions";
import PhotoCreateNav from "./photo_create_nav";

const mapStateToProps = state => ({
  currentUser: state.session.currentUser
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCreateNav);
