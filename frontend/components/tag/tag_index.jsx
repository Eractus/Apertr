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
    this.props.fetchAllTags(this.props.photoId)
  }

  render () {
    const tags = this.props.tags.map(tag => {
      return (
        <TagIndexItem
          key={tag.id}
          tag={tag}
          photoId={this.props.photoId}
          deleteTag={this.props.deleteTag} />
      );
    });

    return (
      <div>
        <div>Tags</div>
        <ul>
          {tags}
        </ul>
      </div>
    );
  }
}

export default TagIndex;
