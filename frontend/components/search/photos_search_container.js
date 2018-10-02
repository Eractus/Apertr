import { connect } from 'react-redux';
import { fetchAllUsers } from '../../actions/user_actions';
import { searchTaggedPhotos, receiveErrors } from '../../actions/photo_actions';
import PhotosSearch from './photos_search';

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    currentUser: state.session.currentUser,
    searchParams: ownProps.searchParams,
    photos: state.search.photos,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchAllUsers: users => dispatch(fetchAllUsers()),
  searchTaggedPhotos: (tag) => dispatch(searchTaggedPhotos(tag))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotosSearch);
