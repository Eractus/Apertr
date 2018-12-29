import React from 'react';
import { Link } from 'react-router-dom';
import PhotoIndexItem from "../photo/photo_index_item";

class AlbumShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoad: true,
      openEditableFields: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleEditableFields = this.toggleEditableFields.bind(this);
  }

  componentDidMount() {
    this.props.fetchAlbum(this.props.match.params.albumId).then(
      this.props.fetchAllUsers().then(
        () => this.setState({ firstLoad: false })
      )
    );
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.match.params.albumId !== this.props.match.params.albumId) {
        this.props.fetchAlbum(this.props.match.params.albumId);
      } else {
        this.setState({ id: this.props.album.id,
          title: this.props.album.title,
          description: this.props.album.description,
          photos: this.props.album.photos
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  // opens/closes editable fields for album's title and description
  toggleEditableFields() {
    this.setState({ openEditableFields: !this.state.openEditableFields })
  }

  update(field) {
    return(e) => {
      this.setState({ [field]: e.target.value });
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // use formData once again to create album object with relevant data points appended to be updated to the backend
    const formData = new FormData();
    formData.append("id", this.props.match.params.albumId);
    formData.append("album[title]", this.state.title);
    formData.append("album[description]", this.state.description);
    formData.append("photo_ids", JSON.stringify(Object.values(this.props.album.photos).map(photo => photo.id)));
    this.props.updateAlbum(formData)
    this.toggleEditableFields();
  }

  // renders errors based on Rails model validations
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
    // display loading until data is loaded to state
    if (this.state.firstLoad) {
      return (
        <div className="album-show-loading">
          <p>Loading...</p>
        </div>
      );
    }

    // if user owns the current album, then they can edit the title/description
    const albumDetails = this.props.currentUser.id === this.props.album.owner_id ?
      (this.state.toggledEditableFields ?
      <form className="album-show-update-form-editing" onSubmit={this.handleSubmit}>
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
      </form> :
      <div className="album-show-update-form" onClick={this.openEditableFields}>
        <p className="album-show-update-title">{this.state.title}</p>
        <p className="album-show-update-description">{this.state.description}</p>
      </div>) :
      <div className="album-show-details">
        <p className="album-show-update-title">{this.state.title}</p>
        <p className="album-show-update-description">{this.state.description}</p>
      </div>

    // logic for interpolating non-data text
    let amtPhotos = Object.values(this.props.album.photos).length;
    let photo = amtPhotos > 1 ? "photos" : "photo";
    const numPhotos = this.state.toggledEditableFields ? "" :
      <div className="album-show-num-photos">{amtPhotos} {photo}</div>

    // user can only see edit link to update album if they are the album's owner
    const albumEdit = this.props.album.owner_id === this.props.currentUser.id ?
      <Link className="album-show-edit" to={`/albums/${this.props.album.id}/edit`}>
        edit
      </Link> : "";

    // reuses photo index item component to display album's photos
    const albumPhotos = Object.values(this.props.album.photos).map(photo => {
      return (
        <PhotoIndexItem
          users={this.props.users}
          currentUser={this.props.currentUser}
          photo={photo}
        />
      );
    });

    return (
      <div className="album-show-container">
        <div className="album-show-cover-image">
          <img src={Object.values(this.props.album.photos)[0].image_url} />
          <div className="album-show-details-container">
            {albumDetails}
            {numPhotos}
            <Link to={`/users/${this.props.album.owner_id}`}>
              By: {this.props.album.ownerFname} {this.props.album.ownerLname}
            </Link>
          </div>
          {albumEdit}
        </div>
        <ul className="album-show-photos-list">
          {albumPhotos}
        </ul>
      </div>
    );
  }
}

export default AlbumShow;
