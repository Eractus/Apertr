import React from "react";
import PhotoIndexFeedItem from "./photo_index_feed_item";

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
    let photosArray = [];
    let favesArr = [];
    this.props.photos.forEach(photo => {
      favesArr.push([photo.id, photo.faves.length]);
    });
    favesArr.sort(function(a, b) {
        return b[1] - a[1];
    });

    favesArr.forEach(arr => {
      photosArray.push(this.props.photos[arr[0]-1])
    });
    // photo objects are passed as props to the PhotoIndexFeedItem component as data to help render the component
    const photos = photosArray.map(photo => {

      return (
        <PhotoIndexFeedItem
          currentUser={this.props.currentUser}
          users={this.props.users}
          photo={photo}
          fetchAllComments={this.props.fetchAllComments}
          createComment={this.props.createComment}
          fetchAllFaves={this.props.fetchAllFaves}
          createFave={this.props.createFave}
          deleteFave={this.props.deleteFave}
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
