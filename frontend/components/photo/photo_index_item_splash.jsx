import React from "react";
import { Link } from "react-router-dom";

const PhotoIndexItemSplash = props => {
  return (
    <li className="photo-index-item-container-splash">
      <div className="photo-author">
        {props.photo.userFname} {props.photo.userLname}
      </div>
      <div className="photo-image">
        <Link to={`/photos/${props.photo.id}`}>
          <img src={props.photo.image_url} />
        </Link>
      </div>
      <p className="photo-title">{props.photo.title}</p>
    </li>
  );
};

export default PhotoIndexItemSplash;
