import { connect } from 'react-redux';
import { createComment, receiveErrors } from '../../actions/comment_actions';
import CommentCreate from './comment_create';

const mapStateToProps = state => ({
  errors: state.errors.comment
});

const mapDispatchToProps = dispatch => ({
  createComment: comment => dispatch(createComment(comment)),
  clearErrors: () => dispatch(receiveErrors([]))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentCreate);
