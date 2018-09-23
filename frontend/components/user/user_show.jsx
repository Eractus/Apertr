import React from 'react';
import { Link } from 'react-router-dom';
import PhotoIndexUserContainer from '../photo/photo_index_user_container';
import AlbumIndexContainer from '../album/album_index_container';

class UserShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photostreamTabSelected: true,
      albumsTabSelected: false
    }
    this.togglePhotostreamTab = this.togglePhotostreamTab.bind(this);
    this.toggleAlbumsTab = this.toggleAlbumsTab.bind(this);
  }

  togglePhotostreamTab() {
    console.log(document.getElementsByClassName("user-show-nav-photos"));
    document.getElementById("user-show-nav-photos").className += " user-show-current-tab";
    document.getElementById("user-show-nav-albums").className -= " user-show-current-tab";
    this.setState ({
      photostreamTabSelected: true,
      albumsTabSelected: false
    })
  }

  toggleAlbumsTab() {
    document.getElementById("user-show-nav-albums").className += " user-show-current-tab";
    document.getElementById("user-show-nav-photos").className -= " user-show-current-tab";
    this.setState ({
      photostreamTabSelected: false,
      albumsTabSelected: true
    })
  }

  render() {
    let email = this.props.currentUser.email;
    let name = email.substring(0, email.lastIndexOf("@"));
    let joinedYear = this.props.currentUser.created_at.substring(0, 4);
    let photosLength = this.props.currentUser.photo_ids.length;
    let numPhotos = photosLength === 0 ? "" : photosLength;
    let photo = photosLength === 0 ? "" : (photosLength === 1 ? "photo" : "photos");

    const renderTab = this.state.photostreamTabSelected ?
      <div className="user-show-tabs">
        <PhotoIndexUserContainer userId={this.props.currentUser.id}/>
      </div> :
      <div className="user-show-tabs">
        <AlbumIndexContainer userId={this.props.currentUser.id}/>
      </div>

    return (
      <div>
        <div className="user-show-cover-photo">
          <img src={"/assets/gabe1.jpg"}/>
          <div className="user-show-profile-details-container">
            <div className="user-show-details-left">
              <img src={this.props.currentUser.image_url}/>
              <div className="user-show-names">
                <h1>{this.props.currentUser.first_name} {this.props.currentUser.last_name}</h1>
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
          <p id="user-show-nav-photos" className="user-show-current-tab" onClick={this.togglePhotostreamTab}>Photostream</p>
          <p id="user-show-nav-albums" onClick={this.toggleAlbumsTab}>Albums</p>
        </div>
        {renderTab}
      </div>
    )
  }
}

export default UserShow;
