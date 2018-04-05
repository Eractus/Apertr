import { connect } from "react-redux";
import SplashPage from "./splash";

const mapStateToProps = state => ({
  currentUser: state.session.currentUser
});

export default connect(mapStateToProps, null)(SplashPage);
