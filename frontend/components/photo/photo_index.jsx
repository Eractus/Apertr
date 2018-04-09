import React from "react";
import PhotoIndexItem from "./photo_index_item";

class PhotoIndex extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchPhotos();
  }

  render () {
    const photos = this.props.photos.map(photo => {
      return (
        <PhotoIndexItem
          key={photo.id}
          photo={photo}/>
      );
    });

    return (
      <div>
        <ul>
          {photos}
        </ul>
      </div>
    );
  }
}

export default PhotoIndex;
