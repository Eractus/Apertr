import React from "react";
import PhotoIndexItemSplash from "./photo_index_item_splash";

class PhotoIndexSplash extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPhotos();
  }

  render () {
    const photos = this.props.photos.map(photo => {
      return (
        <PhotoIndexItemSplash
          key={photo.id}
          photo={photo}/>
      );
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

export default PhotoIndexSplash;
