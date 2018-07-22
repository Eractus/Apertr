import React from 'react';

class AlbumCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      photos: [],
      firstLoad: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchPhotos().then(() => this.setState({ firstLoad: false }));
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
    return () => {
      let dupPhotos = this.state.photos.slice();
      if (!dupPhotos.includes(photo)) {
        dupPhotos.push(photo);
      }
      this.setState({
        photos: dupPhotos
      });
    };
  }

  removePhoto(photo) {
    return () => {
      this.setState({
        photos: this.state.photos.filter(pho => pho.id !== photo.id)
      })
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("album[title]", this.state.title);
    formData.append("album[description]", this.state.description);
    formData.append("photo_ids", JSON.stringify(this.state.photos.map(photo => photo.id)));
    this.props.createAlbum(formData).then(
      data => {
        this.props.receiveCreatedAlbum(data.album.id)
        this.props.history.push(`/albums/${data.album.id}`)
      }
    );
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
    if (this.state.firstLoad) return <div>Loading...</div>;

    const photos = this.props.photos.map((photo, i) => {
      return (
        <li key={`${i}`} className="album-create-user-photos-list-item" onClick={this.addPhoto(photo)}>
          <div className="album-create-list-image">
            <img src={photo.image_url} />
          </div>
        </li>
      );
    });

    const uploadedPhotos = this.state.photos.map(photo => {
      return (
        <li className="album-create-selected-photos-list-item" onClick={this.removePhoto(photo)}>
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
