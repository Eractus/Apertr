import React from 'react';
import PhotoIndexItemUser from '../photo/photo_index_item_user';

class PhotosSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.searchParams,
    }
  }

  componentDidMount() {
    this.props.searchTaggedPhotos(this.props.searchParams);
  }

  componentDidUpdate(prevProps) {
    console.log(`currProps: ${this.props.searchParams}`)
    console.log(`prevProps: ${prevProps.searchParams}`)
    if (this.props.searchParams !== prevProps.searchParams) {
      this.props.searchTaggedPhotos(prevProps.searchParams);
    }
  }

  render () {
    if (Object.keys(this.props.photos).length === 0) {
      return (
        <div className="no-results">
          No photos yet...upload one!
        </div>
      );
    } else {
      let photos = Object.values(this.props.photos).map((photo, i) => (
        <PhotoIndexItemUser key={photo.id} photo={photo} />
      ));

      return (
        <ul className="user-photos">
          {photos}
        </ul>
      )
    }
  }

}

export default PhotosSearch;
