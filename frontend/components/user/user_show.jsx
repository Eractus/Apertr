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
  }

  togglePhotostreamTab() {
    this.setState: ({
      photostreamTabSelected: true,
      albumsTabSelected: false
    })
  }

  toggleAlbumsTab() {
    this.setState: ({
      photostreamTabSelected: false,
      albumsTabSelected: true
    })
  }

  render() {
    let email = this.props.currentUser.email;
    let name = email.substring(0, email.lastIndexOf("@"));

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
          <div className="user-show-profile-details-container">
            <div className="user-show-details-left">
              <img src={this.props.currentUser.image_url}>
              <div className="user-show-creds-container">
                <h1>{this.props.currentUser.first_name} {this.props.currentUser.last_name}</h1>
                <p>{name}</p>
              </div>
            </div>
            <div className="user-show-details-right">
              <p>{this.props.currentUser.photo_ids} photos</p>
              <p>{this.props.currentUser.created_at}</p>
            </div>
          </div>
        </div>
        <div className="navbar-header">
          <p>Photostream</p>
          <p>Albums</p>
        </div>
        {renderTab}
      </div>
    )
  }
}

export default UserShow;
