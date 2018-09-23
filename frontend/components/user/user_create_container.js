import { connect } from "react-redux";
import { signup, receiveErrors } from "../../actions/session_actions";
import { Link } from "react-router-dom";
import UserCreate from "./user_create";

const mapStateToProps = state => ({
  errors: state.errors.session,
  navLink: <Link to="/login">Sign in</Link>
});

const mapDispatchToProps = dispatch => ({
  signupForm: user => dispatch(signup(user)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserCreate);
