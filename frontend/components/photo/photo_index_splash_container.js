import { connect } from "react-redux";
import { fetchPhotos } from '../../actions/photo_actions';
import { fetchAllComments } from '../../actions/comment_actions';
import PhotoIndexSplash from "./photo_index_splash";

const mapStateToProps = state => ({
  photos: Object.values(state.photos),
});

const mapDispatchToProps = dispatch => ({
  fetchPhotos: photos => dispatch(fetchPhotos())
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoIndexSplash);
