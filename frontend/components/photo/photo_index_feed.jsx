import React from "react";
import PhotoIndexFeedItem from "./photo_index_feed_item";
import shuffle from 'lodash/shuffle';

class PhotoIndexFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { firstLoad: true }
  }

  componentDidMount() {
    this.props.fetchAllUsers().then(
      this.props.fetchPhotos().then(
        () => this.setState({ firstLoad: false})
      )
    );
    window.scrollTo(0, 0);
  }

  render () {
    const photosArray = shuffle(this.props.photos);

    const photos = photosArray.map(photo => {
      return (
        <PhotoIndexFeedItem
          currentUser={this.props.currentUser}
          users={this.props.users}
          photo={photo}
        />
      );
    });
    if (this.state.firstLoad) {
      return (
        <div className="photo-index-feed-background">
          <div className="navbar-logged-in-header">
            <p>All Activity</p>
          </div>
          <p className="photo-index-feed-loading">Loading...</p>
        </div>
      );
    } else {
      return (
        <div className="photo-index-feed-background">
          <div className="navbar-logged-in-header">
            <p>All Activity</p>
          </div>
          <div className="photo-index-feed-container">
            <ul className="photo-index-feed-list">
              {photos}
            </ul>
          </div>
        </div>
      );
    }
  }
}

export default PhotoIndexFeed;
