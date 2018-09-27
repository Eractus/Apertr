import { connect } from 'react-redux';
import { fetchAllTags, deleteTag } from '../../actions/tag_actions';
import TagIndex from './tag_index';

const mapStateToProps = (state, ownProps) => ({
  tags: Object.values(state.tags)
});

const mapDispatchToProps = dispatch => ({
  fetchAllTags: photoId => dispatch(fetchAllTags(photoId)),
  deleteTag: (tagId, photoId) => dispatch(deleteTag(tagId, photoId))
});

export default connect(mapStateToProps, mapDispatchToProps)(TagIndex);
