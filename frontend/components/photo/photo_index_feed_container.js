import { connect } from "react-redux";
import { fetchAllUsers } from "../../actions/user_actions";
import { fetchPhotos } from '../../actions/photo_actions';
import { fetchAllComments } from '../../actions/comment_actions';
import PhotoIndexFeed from "./photo_index_feed";

const mapStateToProps = state => ({
  users: state.users,
  currentUser: state.session.currentUser,
  photos: Object.values(state.photos),
});

const mapDispatchToProps = dispatch => ({
  fetchAllUsers: users => dispatch(fetchAllUsers()),
  fetchPhotos: photos => dispatch(fetchPhotos())
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoIndexFeed);
