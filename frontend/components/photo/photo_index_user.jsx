import React from "react";
import PhotoIndexItemUser from "./photo_index_item_user";
import { Link } from 'react-router-dom';

class PhotoIndexUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = { firstLoad: true }
  }

  componentDidMount() {
    this.props.fetchPhotos().then(() => this.setState({ firstLoad: false }));
  }

  render () {
    const photos = []
    this.props.photos.forEach(photo => {
      if (this.props.userId === photo.user_id) {
        photos.push(
          <PhotoIndexItemUser
            photo={photo}
          />
        )
      }
    });
    if (this.state.firstLoad) {
      return (
        <div className="photo-index-user-loading">
          <p>Loading...</p>
        </div>
      );
    } else if (photos.length === 0) {
      return (
        <div className="no-photos">
          <div className="no-photos-message">
            <h2>You have no photos.</h2>
            <p>Your photostream is your public-facing portfolio. Upload some photos to populate your photostream.</p>
            <Link to="/photos/new" className="photo-index-no-photos-upload">Select files to upload</Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className="photo-index-container">
          <ul className="photo-index-list-user">
            {photos}
          </ul>
        </div>
      );
    }
  }
}

export default PhotoIndexUser;
