import React from "react";
import PhotoIndexItemSplash from "./photo_index_item_splash";

class PhotoIndexSplash extends React.Component {
  constructor(props) {
    super(props);
    this.state = { firstLoad: true }
    this.shufflePhotos = this.shufflePhotos.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllUsers();
    this.props.fetchPhotos().then(() => this.setState({ firstLoad: false}));
    window.scrollTo(0, 0);
  }

  shufflePhotos(photosArray) {
    for (let i = photosArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [photosArray[i], photosArray[j]] = [photosArray[j], photosArray[i]];
    }
  }

  render () {
    this.shufflePhotos(this.props.photos);

    const photos = this.props.photos.map(photo => {
      return (
        <PhotoIndexItemSplash
          currentUser={this.props.currentUser}
          users={this.props.users}
          photo={photo}
        />
      );
    });
    if (this.state.firstLoad) {
      return (
        <div className="photo-index-feed-background">
          <div className="navbar-header">
            <p>All Activity</p>
          </div>
          <p className="photo-index-feed-loading">Loading...</p>
        </div>
      );
    } else {
      return (
        <div className="photo-index-feed-background">
          <div className="navbar-header">
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

export default PhotoIndexSplash;
