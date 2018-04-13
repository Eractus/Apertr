import React from 'react';

class AlbumUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: this.props.albumPhotos,
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

  addPhoto(photo) {
    return (e) => {
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
    return (e) => {
      this.setState({
        photos: this.state.photos.filter(pho => pho.id !== photo.id)
      })
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("album[id]", this.props.match.params.albumId);
    formData.append("photo_ids", JSON.stringify(this.state.photos.map(photo => photo.id)));
    this.props.updateAlbum(formData, this.props.photoIds).then(
      data => this.props.history.push(`/albums/${data.album.id}`)
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

    const photos = this.props.userPhotos.map((photo, i) => {
      return (
        <li key={`${i}`} className="" onClick={this.addPhoto(photo)}>
          <div className="">
            <img src={photo.image_url} />
          </div>
        </li>
      );
    });

    const uploadedPhotos = this.state.photos.map(photo => {
      return (
        <li className="" onClick={this.removePhoto(photo)}>
          <img src={photo.image_url} />
        </li>
      );
    });

    return (
      <div className="">
        <div className="">
          <ul className="">
            {uploadedPhotos}
          </ul>
        </div>
        <form onSubmit={this.handleSubmit} className="">
          <input className="album-create-button" type="submit" value="Save" />
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

export default AlbumUpdate;
