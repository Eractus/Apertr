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
      <div>
        <div className="navbar-header">
          <p>All Activity</p>
        </div>
        <div className="photo-index-container-splash">
          <ul className="photo-index-list-splash">
            {photos}
          </ul>
        </div>
      </div>
    );
  }
}

export default PhotoIndexSplash;
