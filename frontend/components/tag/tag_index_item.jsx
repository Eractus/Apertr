import React from 'react';
import { Link } from 'react-router-dom';

const TagIndexItem = props => {
  if (props.userId === props.photo.user_id) {
    return (
      <li>
        <div className="tag-index-item-container">
          <div className="tag-index-item">
            <p>{props.tag.word}</p>
            <Link
            onClick={() => props.deleteTag(props.tag.id)}
            to={`/photos/${props.photo.id}`}
            >x</Link>
          </div>
        </div>
      </li>
    );
  } else {
    return(
      <li>
        <div className="tag-index-item-container">
          <div className="tag-index-item">
            <p>{props.tag.word}</p>
          </div>
        </div>
      </li>
    )
  }
}

export default TagIndexItem;
