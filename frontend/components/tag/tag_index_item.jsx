import React from 'react';
import { Link } from 'react-router-dom';

const TagIndexItem = props => {
  if (props.userId === props.photo.user_id) {
    return(
      <li>
        <div className="tag-index-item-photo-owner">
          <Link className="tag-index-item-word" to={`/search/photos/${props.tag.word}`}>
            {props.tag.word}
          </Link>
          <Link
            className="tag-index-item-delete"
            onClick={() => props.deleteTag(props.tag.id, props.photo.id)}
            to={`/photos/${props.photo.id}`}
          >x</Link>
        </div>
      </li>
    )
  } else {
    return (
      <li>
        <div className="tag-index-item">
          <Link className="tag-index-item-word" to={`/search/photos/${props.tag.word}`}>
            {props.tag.word}
          </Link>
        </div>
      </li>
    );
  }
}

export default TagIndexItem;
