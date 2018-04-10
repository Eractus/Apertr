import React from "react";
import { Link } from "react-router-dom";

const PhotoIndexItem = props => {
  return (
    <li className="photo-index-item-container">
      <Link className="photo-author" to={`/users/${props.photo.user_id}`}>
        {props.photo.userFname} {props.photo.userLname}
      </Link>
      <div className="photo-image">
        <Link to={`/photos/${props.photo.id}`}>
          <img src={props.photo.image_url} />
        </Link>
      </div>
      <p className="photo-title">{props.photo.title}</p>
    </li>
  );
};

export default PhotoIndexItem;
