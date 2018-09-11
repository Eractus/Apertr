import React from 'react';
import { Link } from 'react-router-dom';

const CommentIndexItem = props => {
  return (
    <li>
      <div className="comment-index-item-container">
        <div className="comment-index-item">
          <div className="comment-index-username">
            {props.comment.userFname} {props.comment.userLname}
          </div>
          <div className="comment-index-description">
            <p>
              {props.comment.description}
            </p>
            <div className="comment-index-delete">
              <Link
                onClick={() => props.deleteComment(props.comment.id)}
                to={`/photos/${props.photoId}`}
              >del</Link>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default CommentIndexItem;
