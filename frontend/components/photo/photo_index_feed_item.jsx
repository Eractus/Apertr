import React from "react";
import { Link } from "react-router-dom";

const PhotoIndexFeedItem = props => {
  // some logic for interpolating non-data text
  const commentsCount = props.photo.comments.length;
  const comments = commentsCount <= 1 ? "comment" : "comments";

  return (
    <li className="photo-index-feed-item-container">
      <div className="photo-index-feed-item">
        <div className="photo-index-feed-author">
          <img src={props.users[props.photo.user_id].profile_pic}/>
          <Link to={`/users/${props.photo.user_id}`}>
            {props.photo.userFname} {props.photo.userLname}
          </Link>
        </div>
        <div className="photo-index-feed-image-container">
          <Link to={`/photos/${props.photo.id}`}>
            <img className="photo-index-feed-image" src={props.photo.image_url} />
          </Link>
        </div>
        <div className="photo-index-feed-title">
          {props.photo.title}
        </div>
        <div className="photo-index-feed-details">
          <p>{commentsCount} {comments}</p>
        </div>
      </div>
    </li>
  );
};

export default PhotoIndexFeedItem;
