import { connect } from 'react-redux';
import { receiveErrors } from '../../actions/photo_actions';
import Search from './search';

const mapStateToProps = (state, ownProps) => {
  return {
    searchParams: ownProps.match.params.searchParams,
    errors: state.errors.search,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
