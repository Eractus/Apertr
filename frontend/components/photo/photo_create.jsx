import React from 'react';

class PhotoCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      imageFile: null,
      imageUrl: null,
      toggledUploadPhotoButton: false,
      toggleEditTitle: false,
      toggleEditDescription: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.displayPhotoUpload = this.displayPhotoUpload.bind(this);
    this.enableTitleEdit = this.enableTitleEdit.bind(this);
    this.enableDescriptionEdit = this.enableDescriptionEdit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors()
  }

  update(field) {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  updateFile(e) {
    const file = e.currentTarget.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      return this.setState({ imageFile: file, imageUrl: fileReader.result });
    }

    if (file) {
      fileReader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.setState({ imageFile: null, imageUrl: null });
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo[title]", this.state.title);
    formData.append("photo[description]", this.state.description);
    if (this.state.imageFile) {
      formData.append("photo[image]", this.state.imageFile);
    }
    this.props.createPhoto(formData).then(data => this.props.history.push(`/photos/${data.photo.id}`));
  }

  displayPhotoUpload() {
    this.setState({ toggledUploadPhotoButton: true })
  }

  enableTitleEdit() {
    this.setState({ toggledEditTitle: true })
  }

  enableDescriptionEdit() {
    this.setState({ toggledEditDescription: true })
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

  render() {
    const photoCreateTitle = this.props.toggleEditTitle ?
    <input
      className="photo-create-title-edit"
      type="text"
      value={this.state.title}
      placeholder="Add a title"
      onChange={this.update('title')} /> :
    <div className="photo-create-title-display" onClick={this.enableTitleEdit}>
      <h1>Add a title</h1>
    </div>

    const photoCreateDescription = this.props.toggleEditDescription ?
    <input
      className="photo-create-description-edit"
      type="text"
      value={this.state.description}
      placeholder="Add a description"
      onChange={this.update('description')} /> :
    <div className="photo-create-description-display" onClick={this.enableDescriptionEdit}>
      <p>Add a description</p>
    </div>

    if (this.state.toggledUploadPhotoButton === false) {
      return (
        <div className="photo-create-background">
          <div className="photo-create-greeting-container">
            <p>Upload photos here</p>
            <button onClick={this.displayPhotoUpload}>Choose photos to upload</button>
          </div>
        </div>
      );
    } else if (this.state.toggledUploadPhotoButton === true) {
      return (
        <div className="photo-create-background">
          <div className="photo-create-container">
            <p>Upload a photo:</p>
            <form onSubmit={this.handleSubmit} className="photo-create-form">
              <div>{this.renderErrors()}</div>
              <div className="photo-create-details">
                {photoCreateTitle}
                {photoCreateDescription}
              </div>
              <div className="photo-create-image">
                <input className="photo-upload" type="file" onChange={this.updateFile} />
                <img
                  src={this.state.imageUrl}
                  onClick={this.removeImage}
                  className="photo-preview"
                />
              </div>
              <input className="photo-create-button" type="submit" value="Upload Photo" />
            </form>
          </div>
        </div>
      );
    }
  }
}

export default PhotoCreate;
