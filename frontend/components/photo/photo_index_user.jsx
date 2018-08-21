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
    if (photos.length === 0) {
      return (
        <div className="no-albums">
          <p>You have no photos yet! Upload one to start sharing!!!</p>
        </div>
      );
    } else {
      return (
        <div className="photo-index-container">
          <h1>Your Photos</h1>
          <ul className="photo-index-list-user">
            {photos}
          </ul>
        </div>
      );
    }
  }
}

export default PhotoIndexUser;
