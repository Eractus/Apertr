import { connect } from 'react-redux';
import { createTag, receiveErrors } from '../../actions/tag_actions';
import TagCreate from './tag_create';

const mapStateToProps = state => ({
  errors: state.errors.tag
});

const mapDispatchToProps = dispatch => ({
  createTag: tag => dispatch(createTag(tag)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(mapStateToProps, mapDispatchToProps)(TagCreate);
