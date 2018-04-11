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
    const photos = this.props.photos.map(photo => {
      if (this.props.userId === photo.user_id) {
        return (
          <PhotoIndexItemUser
          key={photo.id}
          photo={photo}/>
        );
      }
    });

    return (
      <div className="photo-index-container">
        <ul className="photo-index-list">
          {photos}
        </ul>
      </div>
    );
  }
}

export default PhotoIndexUser;
