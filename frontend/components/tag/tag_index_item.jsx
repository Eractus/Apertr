import React from 'react';
import { Link } from 'react-router-dom';

const TagIndexItem = props => {
  // if user owns the photo they can delete the photo tags (not the tag words themselves)
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
    // if user is not the photo owner they cannot delete the photo tags, only click it to search by the tag word
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
