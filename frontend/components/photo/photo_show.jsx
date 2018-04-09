import React from 'react';
import { Link } from 'react-router-dom';

class PhotoShow extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchPhoto(this.props.match.params.photoId)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.photo.id != nextProps.match.params.photoId) {
      return this.props.fetchPhoto(nextProps.match.params.photoId);
    }
  }

  photoLoggedOut() {
    return (
      <div>
        <img src={this.props.photo.image_url} />
      </div>
    );
  }

  photoLoggedIn() {
    if (this.props.currentUser.photos.includes(this.props.photo)) {
      return (
        <div>
          <img src={this.props.photo.image_url} />
        </div>
      );
    } else { return (
        <div>
          <img src={this.props.photo.image_url} />
        </div>
      );
    }
  }
}
