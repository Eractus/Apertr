import React from 'react';

const CommentIndexItem = props => {
  return (
    <li>
      <div className="comment-index-descriptopn-container">
        <div className="comment-index-description">
          <div className="comment-index-username">
            {props.comment.userFname} {props.comment.userLname}
          </div>
          <p>
            {props.comment.description}
          </p>
          <div className="comment-index-delete">
            <a onClick={() => props.deleteComment(props.comment.id)}>
              del
              </a>
          </div>
        </div>
      </div>
    </li>
  );
}

export default CommentIndexItem;
