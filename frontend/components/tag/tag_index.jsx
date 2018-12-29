import React from 'react';
import TagIndexItem from './tag_index_item';

class TagIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags
    };
  }

  componentDidMount() {
    this.props.fetchAllTags(this.props.photo.id)
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.photo.id !== this.props.photo.id) {
        this.props.fetchAllTags(this.props.photo.id);
      } else {
        this.setState({
          tags: this.props.tags,
        });
      }
    }
  }

  render () {
    // array of tag objects each to be passed as props to render TagIndexItem components
    const tags = this.props.tags.map(tag => {
      return (
        <TagIndexItem
          key={tag.id}
          tag={tag}
          photo={this.props.photo}
          userId={this.props.currentUser.id}
          deleteTag={this.props.deleteTag} />
      );
    });

    return (
      <div className="tags-index-container">
        <ul className="tags-index-list">
          {tags}
        </ul>
      </div>
    );
  }
}

export default TagIndex;
