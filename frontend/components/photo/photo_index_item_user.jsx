import React from "react";
import { Link } from "react-router-dom";

const PhotoIndexItemUser = props => {
  return (
    <li className="photo-index-item-container">
      <div className="photo-image">
        <Link to={`/photos/${props.photo.id}`}>
          <img src={props.photo.image_url} />
        </Link>
      </div>
    </li>
  );
};

export default PhotoIndexItemUser;
