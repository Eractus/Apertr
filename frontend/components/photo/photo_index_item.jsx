import React from "react";
import { Link } from "react-router-dom";

const PhotoIndexItem = props => {
  // some code logic for interpolating non-data text
  let userId = props.photo.user_id;
  const photoAuthor = props.currentUser.id === userId ?
    "YOU!" : props.users[userId].first_name + " " + props.users[userId].last_name;
    
  return (
    <li className="photo-index-item-container">
      <Link
        className="photo-index-item-hover"      to={`/photos/${props.photo.id}`}
      >
        <p>{props.photo.title}</p>
        <Link to={`/users/${userId}`}>by {photoAuthor}</Link>
      </Link>
      <div className="photo-index-item-image-container">
        <Link to={`/photos/${props.photo.id}`}>
          <img className="photo-index-item-image" src={props.photo.image_url} />
        </Link>
      </div>
    </li>
  );
};

export default PhotoIndexItem;
