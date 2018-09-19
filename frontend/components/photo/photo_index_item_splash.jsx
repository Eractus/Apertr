import React from "react";
import { Link } from "react-router-dom";

const PhotoIndexItemSplash = props => {
  return (
    <li className="photo-index-item-container-splash">
      <div className="photo-author">
        {props.photo.userFname} {props.photo.userLname}
      </div>
      <div className="photo-image-splash-container">
        <Link to={`/photos/${props.photo.id}`}>
          <img className="photo-image-splash" src={props.photo.image_url} />
        </Link>
      </div>
      <div className="photo-title">
        {props.photo.title}
      </div>
    </li>
  );
};

export default PhotoIndexItemSplash;
