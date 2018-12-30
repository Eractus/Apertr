import { connect } from 'react-redux';
import { fetchUser, fetchAllUsers } from '../../actions/user_actions';
import { fetchPhotos } from '../../actions/photo_actions';
import UserShow from './user_show';

const mapStateToProps = (state, ownProps) => ({
  user: state.users[ownProps.match.params.userId],
  users: state.users,
  currentUser: state.session.currentUser,
  photos: Object.values(state.photos)
});

const mapDispatchToProps = dispatch => ({
  fetchUser: id => dispatch(fetchUser(id)),
  fetchAllUsers: users => dispatch(fetchAllUsers()),
  fetchPhotos: photos => dispatch(fetchPhotos())
});

export default connect(mapStateToProps, mapDispatchToProps)(UserShow);
