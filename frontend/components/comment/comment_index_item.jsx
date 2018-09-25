import React from 'react';
import { Link } from 'react-router-dom';

const CommentIndexItem = props => {
  const delComment = props.currentUser.id === props.photo.user_id ||
    props.currentUser.id === props.comment.user_id ?
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
          <img src={props.users[props.comment.user_id].profile_pic} />
          <div className="comment-index-item-details">
            <Link to={`/users/${props.comment.user_id}`}>
              {props.comment.userFname} {props.comment.userLname}
            </Link>
            <div className="comment-index-description">
              {props.comment.description}
            </div>
            {delComment}
          </div>
        </div>
      </div>
    </li>
  );
}

export default CommentIndexItem;
