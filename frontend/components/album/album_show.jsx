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

    const albumPhotos = Object.values(this.state.photos).map(photo => {
      return (
        <li className="album-list-photo">
          <Link to={`/photos/${photo.id}`}>
            <img src={photo.image_url} />
          </Link>
        </li>
      );
    });

    return (
      <div className="album-show-container">
        <Link to="/albums">{`<`}- Back to albums list</Link>
        <div className="album-show-image">
          <img src={Object.values(this.state.photos)[0].image_url} />
          <form className="album-show-update-form" onSubmit={this.handleSubmit}>
            <input
              className="album-show-update-title"
              type="text"
              value={this.state.title}
              onChange={this.update('title')} />
            <input
              className="album-show-update-description"
              type="textarea"
              value={this.state.description}
              onChange={this.update('description')} />
            <input className="album-show-update-button" type="submit" value="Done" />
          </form>
          <h3>by {this.props.album.ownerFname} {this.props.album.ownerLname}</h3>
        </div>
        <div>
          <ul className="album-list-container">
            {albumPhotos}
          </ul>
        </div>
      </div>
    );
  }
}

export default AlbumShow;
