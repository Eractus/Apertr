import React from 'react';
import { Link } from 'react-router-dom';

class AlbumShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.album;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchAlbum(this.props.match.params.albumId);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.albumId != nextProps.match.params.albumId) {
      this.props.fetchAlbum(nextProps.match.params.albumId);
    } else {
      this.setState({ id: nextProps.album.id,
        title: nextProps.album.title,
        description: nextProps.album.description,
        photos: nextProps.album.photos
      });
    }
  }

  update(field) {
    return(e) => {
      this.setState({
        [field]: e.target.value
      });
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.updateAlbum(this.state);
  }

  renderErrors() {
    return (
      <ul>
        {this.props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    if (!this.props.album) {
      return (
        <div>Loading...</div>
      );
    }

    if (this.props.currentUser.id === this.props.album.owner_id) {
      return (
        <div>Hello world</div>
      );
    } else {
      return (
        <div>
          <div>
            <img src={this.props.album.photos.first.image_url} />
          </div>
          <ul>

          </ul>
        </div>
      );
    }
  }
}

export default AlbumShow;
