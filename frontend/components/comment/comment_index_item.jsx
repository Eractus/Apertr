import React from 'react';
import { Link } from 'react-router-dom';

const CommentIndexItem = props => {
  const deleteLink = props.userId === props.photo.user_id ?
  <div className="comment-index-delete">
    <Link
      onClick={() => props.deleteComment(props.comment.id)}
      to={`/photos/${props.photo.id}`}
    >del</Link>
  </div> : "";

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
            {deleteLink}
          </div>
        </div>
      </div>
    </li>
  );
}

export default CommentIndexItem;
