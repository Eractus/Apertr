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
    // lodash shuffle method so the photo index feed array serves the photo index feed items in a random order everytime - eventually they will be sorted based on popularity ("faves") once that feature is built
    const photosArray = shuffle(this.props.photos);

    // photo objects are passed as props to the PhotoIndexFeedItem component as data to help render the component
    const photos = photosArray.map(photo => {
      return (
        <PhotoIndexFeedItem
          currentUser={this.props.currentUser}
          users={this.props.users}
          photo={photo}
        />
      );
    });

    // display Loading until all relevant data are loaded into props
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
