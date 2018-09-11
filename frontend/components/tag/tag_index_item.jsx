import React from 'react';
import { Link } from 'react-router-dom';

const TagIndexItem = props => {
  return (
    <li>
      <div>
        <p>{props.tag.word}</p>
        <Link
          onClick={() => props.deleteTag(props.tag.id)}
          to={`/photos/${props.photoId}`}
        >x</Link>
      </div>
    </li>
  );
}

export default TagIndexItem;
