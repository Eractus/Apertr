import React from "react";
import { connect } from "react-redux";
import { signup } from "../../actions/session_actions";
import { Link } from "react-router-dom";
import UserForm from "./user_form";

const mapStateToProps = state => ({
  errors: state.errors.session,
  navLink: <Link to="/login">Sign in</Link>
});

const mapDispatchToProps = dispatch => ({
  signupForm: user => dispatch(signup(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
