import React from "react";
import PhotoIndexItemUser from "./photo_index_item_user";

class PhotoIndexUser extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPhotos();
  }

  render () {
    const photos = []
    this.props.photos.forEach(photo => {
      if (this.props.userId === photo.user_id) {
        photos.push(<PhotoIndexItemUser
          key={photo.id}
          photo={photo} />)
      }
    });
    console.log(photos);
    if (photos.length === 0) {
      return (
        <div className="no-albums">
          <p>You have no photos yet! Upload one to start sharing!!!</p>
        </div>
      );
    } else {
      return (
        <div className="photo-index-container">
          <ul className="photo-index-list">
            {photos}
          </ul>
        </div>
      );
    }
  }
}

export default PhotoIndexUser;
