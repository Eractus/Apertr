import { connect } from 'react-redux';
import { searchTaggedPhotos, receiveErrors } from '../../actions/photo_actions';
import PhotosSearch from './photos_search';

const mapStateToProps = (state, ownProps) => {
  return {
    searchParams: ownProps.searchParams,
    photos: state.search.photos,
  };
};

const mapDispatchToProps = (dispatch) => ({
  searchTaggedPhotos: (tag) => dispatch(searchTaggedPhotos(tag))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotosSearch);
