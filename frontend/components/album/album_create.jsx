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

  // soft dup of state photos array to check if it contains photo user is trying to add and updates changes by resetting state's value
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

  // use JS's filter method for array to "remove" selected photo by keeping those whose id's are different
  removePhoto(photo) {
    return () => {
      this.setState({
        photos: this.state.photos.filter(pho => pho.id !== photo.id)
      })
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // append required data as formData, a json object, to send to the Rails backend
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

  // renders errors based on Rails model validations
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
    // display loading until all necessary data are loaded into props
    if (this.state.firstLoad) {
      return (
        <div className="album-create-loading">
          <p>Loading...</p>
        </div>
      )
    }

    // chooses first photo chosen as the album's cover photo
    const albumCover = this.state.photos.length === 0 ?
      <div></div> :
      <img src={this.state.photos[0].image_url} />;

    // logic for interpolating non-data text
    const numPhotos = this.state.photos.length === 0 ? "0 items" : (
      this.state.photos.length === 1 ? "1 item" : `${this.state.photos.length} items`
    )

    // collection of user's uploaded photos that can be added to album
    const photos = this.props.photos.map((photo, i) => {
      return (
        <li key={`${i}`} className="album-create-user-photos-list-item" onClick={this.addPhoto(photo)}>
          <div className="album-create-list-image">
            <img src={photo.image_url}/>
          </div>
        </li>
      );
    });

    // user's selection of photos for creating album - default template message is displayed if no photos are chosen
    const uploadedPhotos = (this.state.photos.length === 0) ?
        <li className="album-create-no-photos">
          <p>You haven't selected any photos yet. Select from your uploaded photos below to create your album!</p>
        </li> : this.state.photos.map(photo => {
        return (
          <li className="album-create-selected-photos-list-item" onClick={this.removePhoto(photo)}>
            <img src={photo.image_url} />
          </li>
        );
      });

    return (
      <div className="album-create-background">
        <div className="album-create-container">
          <form onSubmit={this.handleSubmit} className="album-create-form">
            <div className="album-create-form-header">
              <div className="album-create-cover-image">
                {albumCover}
              </div>
              <p>{numPhotos} in the album</p>
            </div>
            <div>{this.renderErrors()}</div>
            <input
              className="album-create-title"
              type="text"
              value={this.state.title}
              placeholder="new album"
              onChange={this.update('title')} />
            <textarea
              className="album-create-description"
              type="textarea"
              value={this.state.description}
              onChange={this.update('description')} />
            <input className="album-create-button" type="submit" value="SAVE" />
          </form>
          <div className="album-create-selected-photos-container">
            <ul className="album-create-selected-photos-list">
              {uploadedPhotos}
            </ul>
          </div>
        </div>
        <div className="album-create-user-photos-container">
          <ul className="album-create-user-photos-list">
            { photos }
          </ul>
        </div>
      </div>
    );
  }
}

export default AlbumCreate;
