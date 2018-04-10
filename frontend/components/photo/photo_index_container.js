import { connect } from "react-redux";
import { fetchPhotos } from '../../actions/photo_actions.js';
import PhotoIndex from "./photo_index";

const mapStateToProps = state => ({
  photos: Object.values(state.photos)
});

const mapDispatchToProps = dispatch => ({
  fetchPhotos: photos => dispatch(fetchPhotos())
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoIndex);