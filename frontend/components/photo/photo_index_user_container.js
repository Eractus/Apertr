import { connect } from "react-redux";
import { fetchPhotos } from '../../actions/photo_actions.js';
import PhotoIndexUser from "./photo_index_user";

const mapStateToProps = state => ({
  photos: Object.values(state.photos),
  userId: state.session.currentUser.id
});

const mapDispatchToProps = dispatch => ({
  fetchPhotos: photos => dispatch(fetchPhotos())
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoIndexUser);
