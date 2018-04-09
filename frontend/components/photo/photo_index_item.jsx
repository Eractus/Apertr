import React from "react";
import { Link } from "react-router-dom";

const PhotoIndexItem = props => {
  return (
    <li className="photo-list-props">
      <Link to={`/photos/${props.photo.id}`}>
        <img src={props.photo.image_url} />
      </Link>
      <Link to={`/users/${props.photo.user_id}`}>
        {props.photo.userFname} {props.photo.userLname}
      </Link>
    </li>
  );
};

export default PhotoIndexItem;
