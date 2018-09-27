import React from 'react';
import { Link } from 'react-router-dom';

const TagIndexItem = props => {
  const delTag = props.userId === props.photo.user_id ?
  <Link
    className="tag-index-item-delete"
    onClick={() => props.deleteTag(props.tag.id, props.photo.id)}
    to={`/photos/${props.photo.id}`}
  >x</Link> : ""

  return (
    <li>
      <div className="tag-index-item-container">
        <div className="tag-index-item">
          <Link to={`/search/photos/${props.tag.word}`}>
            {props.tag.word}
          </Link>
          {delTag}
        </div>
      </div>
    </li>
  );
}

export default TagIndexItem;
