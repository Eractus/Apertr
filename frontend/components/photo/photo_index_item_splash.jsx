import React from "react";
import { Link } from "react-router-dom";

const PhotoIndexItemSplash = props => {
  const commentsCount = props.photo.comments.length;
  const comments = commentsCount <= 1 ? "comment" : "comments";
  return (
    <li className="photo-index-item-container-splash">
      <div className="photo-index-item-splash">
        <div className="photo-author">
          <img src={props.users[props.photo.user_id].profile_pic}/>
          <Link to={`/users/${props.photo.user_id}`}>
            {props.photo.userFname} {props.photo.userLname}
          </Link>
        </div>
        <div className="photo-image-splash-container">
          <Link to={`/photos/${props.photo.id}`}>
            <img className="photo-image-splash" src={props.photo.image_url} />
          </Link>
        </div>
        <div className="photo-title">
          {props.photo.title}
        </div>
        <div className="photo-details">
          <p>{commentsCount} {comments}</p>
        </div>
      </div>
    </li>
  );
};

export default PhotoIndexItemSplash;
