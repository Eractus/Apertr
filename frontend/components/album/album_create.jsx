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
          <li className="photo-index-item-container" onClick={this.addPhoto(photo)}>
            <div className="photo-image">
              <img src={photo.image_url} />
            </div>
            <p className="photo-title">{photo.title}</p>
          </li>
        );
      }
    });

    const uploadedPhotos = this.state.photos.map(photo => {
      return (
        <li>
          <img src={photo.image_url} />
        </li>
      );
    });

    return (
      <div>
        <div>
          <ul>
            {uploadedPhotos}
          </ul>
        </div>
        <form onSubmit={this.handleSubmit} className="">
          <div>{this.renderErrors()}</div>
            <input
              className=""
              type="text"
              value={this.state.title}
              placeholder="new album"
              onChange={this.update('title')} />
            <input
              className=""
              type="text"
              value={this.state.description}
              onChange={this.update('description')} />
          <input className="" type="submit" value="Create Album" />
        </form>
        <div>
          <ul>
            { photos }
          </ul>
        </div>
      </div>
    );
  }
}

export default AlbumCreate;
