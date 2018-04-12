import React from 'react';

class AlbumCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      photos: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchPhotos();
  }

  componentWillUnmount() {
    this.props.clearErrors()
  }

  update(field) {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  addPhoto(photo) {
    return (e) => {
      this.setState({
        photos: [...this.state.photos, photo]
      });
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createAlbum(this.state);
  }

  renderErrors() {
    return(
      <ul>
        {this.props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  render () {
    const photos = this.props.photos.map(photo => {
      if (this.props.userId === photo.user_id) {
        return (
          <li className="album-create-user-photos-list-item" onClick={this.addPhoto(photo)}>
            <div className="album-create-list-image">
              <img src={photo.image_url} />
            </div>
          </li>
        );
      }
    });

    const uploadedPhotos = this.state.photos.map(photo => {
      return (
        <li className="album-create-selected-photos-list-item">
          <img src={photo.image_url} />
        </li>
      );
    });

    return (
      <div className="album-create-container">
        <div className="album-created-selected-photos-container">
          <ul className="album-create-selected-photos-list">
            {uploadedPhotos}
          </ul>
        </div>
        <form onSubmit={this.handleSubmit} className="album-create-form">
          <div>{this.renderErrors()}</div>
          <input
            className="album-create-input"
            type="text"
            value={this.state.title}
            placeholder="new album"
            onChange={this.update('title')} />
          <input
            className="album-create-input"
            type="text"
            value={this.state.description}
            onChange={this.update('description')} />
          <input className="album-create-button" type="submit" value="Create Album" />
        </form>
        <div>
          <ul className="album-create-user-photos-list">
            { photos }
          </ul>
        </div>
      </div>
    );
  }
}

export default AlbumCreate;
