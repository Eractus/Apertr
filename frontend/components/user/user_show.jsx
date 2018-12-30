import React from 'react';
import { Link } from 'react-router-dom';
import PhotoIndex from '../photo/photo_index';
import AlbumIndexContainer from '../album/album_index_container';

class UserShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoad: true,
      currentTabSelected: "photostream",
    }
    this.togglePhotostreamTab = this.togglePhotostreamTab.bind(this);
    this.toggleAlbumsTab = this.toggleAlbumsTab.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllUsers().then(
      this.props.fetchPhotos().then(
        this.props.fetchUser(this.props.match.params.userId).then(
          () => this.setState({ firstLoad: false })
        )
      )
    );
    window.scrollTo(0, 0);
  }

  togglePhotostreamTab() {
    document.getElementById(this.state.currentTabSelected).className -= " user-show-current-tab";
    document.getElementById("photostream").className += " user-show-current-tab";
    this.setState ({
      currentTabSelected: "photostream",
    });
  }

  toggleAlbumsTab() {
    document.getElementById(this.state.currentTabSelected).className -= " user-show-current-tab";
    document.getElementById("albums").className += " user-show-current-tab";
    this.setState ({
      currentTabSelected: "albums",
    });
  }

  render() {
    if (this.state.firstLoad) {
      return (
        <div className="user-show-loading">
          <p>Loading...</p>
        </div>
      );
    }

    let email = this.props.user.email;
    let name = email.substring(0, email.lastIndexOf("@"));
    let joinedYear = this.props.user.created_at.substring(0, 4);
    let photosLength = this.props.user.photo_ids.length;
    let numPhotos = photosLength === 0 ? "" : photosLength;
    let photo = photosLength === 0 ? "" : (photosLength === 1 ? "photo" : "photos");

    let renderTab;
    switch (this.state.currentTabSelected) {
      case "photostream":
        renderTab =
        <div className="user-show-tabs">
          <PhotoIndex
            user={this.props.user}
            currentUser={this.props.currentUser}
            users={this.props.users}
            photos={this.props.photos}
          />
        </div>
        break;
      case "albums":
        renderTab =
        <div className="user-show-tabs">
          <AlbumIndexContainer user={this.props.user}/>
        </div>
        break;
    }


    return (
      <div>
        <div className="user-show-cover-photo">
          <img src={this.props.user.cover_photo}/>
          <div className="user-show-profile-details-container">
            <div className="user-show-details-left">
              <img src={this.props.user.profile_pic}/>
              <div className="user-show-names">
                <h1>{this.props.user.first_name} {this.props.user.last_name}</h1>
                <p>{name}</p>
              </div>
            </div>
            <div className="user-show-details-right">
              <p>{numPhotos} {photo}</p>
              <p>Joined {joinedYear}</p>
            </div>
          </div>
        </div>
        <div className="user-show-nav-bar">
          <p id="photostream" className="user-show-current-tab" onClick={this.togglePhotostreamTab}>Photostream</p>
          <p id="albums" onClick={this.toggleAlbumsTab}>Albums</p>
        </div>
        {renderTab}
      </div>
    );
  }
}

export default UserShow;
