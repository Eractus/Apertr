import { connect } from 'react-redux';
import { fetchAllTags, deleteTag } from '../../actions/tag_actions';
import TagIndex from './tag_index';

const mapStateToProps = (state, ownProps) => {
  return ({
    photoId: ownProps.photo.id,
    tags: Object.values(state.tags)
  });
};

const mapDispatchToProps = dispatch => ({
  fetchAllTags: photoId => dispatch(fetchAllTags(photoId)),
  deleteTag: tagId => dispatch(deleteTag(tagId))
});

export default connect(mapStateToProps, mapDispatchToProps)(TagIndex);
