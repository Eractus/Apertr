import React from "react";
import PhotoIndexItem from "./photo_index_item";
import { Link } from 'react-router-dom';

class PhotoIndex extends React.Component {
  render () {
    // UserShow parent component fetches data for all photos (array) and this user(object) based on id in url and pass down as props in order to create an array filtered with only this user's photos
    const photos = []
    this.props.photos.forEach(photo => {
      if (this.props.user.id === photo.user_id) {
        photos.push(
          <PhotoIndexItem
            users={this.props.users}
            currentUser={this.props.currentUser}
            photo={photo}
          />
        )
      }
    });

    // template message if this user has not uploaded any photos with link to photo upload page
    const noPhotosMessage = this.props.user.id === this.props.currentUser.id ?
      <div className="photo-index-no-photos-message">
        <h2>You have no photos.</h2>
        <p>Your photostream is your public-facing portfolio. Upload some photos to populate your photostream.</p>
        <Link to="/photos/upload">Select files to upload</Link>
      </div> :
      <div className="photo-index-no-photos-message">
        <h2>{this.props.user.first_name} has not uploaded any photos yet.</h2>
      </div>

    // display loading until UserShow parent component has fetched photos as props
    if (this.props.photos.length === 0) {
      return (
        <div className="photo-index-loading">
          <p>Loading...</p>
        </div>
      )
    } else {
      // if photos array that's filtered using this user's id and all photos passed down as props from UserShow parent component is still empty, then this user has not uploaded any photos
      if (photos.length === 0) {
        return (
          <div className="photo-index-no-photos">
            {noPhotosMessage}
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
}

export default PhotoIndex;
