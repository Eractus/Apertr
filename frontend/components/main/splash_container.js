import { connect } from "react-redux";
import SplashPage from "./splash";
import { login } from "../../actions/session_actions";

const mapStateToProps = state => ({
  currentUser: state.session.currentUser
});

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(login(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashPage);
