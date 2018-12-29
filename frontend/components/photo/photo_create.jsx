import React from 'react';

class PhotoCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      imageFile: null,
      imageUrl: null,
      toggledUploadPhotoButton: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.displayPhotoUpload = this.displayPhotoUpload.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors()
  }

  update(field) {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  // logic for reading and loading selected file
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

  handleSubmit(e) {
    e.preventDefault();
    // append required data as formData, a json object, to send to the Rails backend
    const formData = new FormData();
    formData.append("photo[title]", this.state.title);
    formData.append("photo[description]", this.state.description);
    if (this.state.imageFile) {
      formData.append("photo[image]", this.state.imageFile);
    }
    this.props.createPhoto(formData).then(data => this.props.history.push(`/photos/${data.photo.id}`));
  }

  // just DOM manipulation to emulate (as close as I am capable of) the design of Flickr's photo upload page
  displayPhotoUpload() {
    this.setState({ toggledUploadPhotoButton: true })
  }

  // renders errors based on Rails model validations
  renderErrors() {
    return(
      <ul className="photo-create-errors">
        {this.props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  render() {
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
                <input
                  className="photo-create-title"
                  type="text"
                  value={this.state.title}
                  placeholder="Add a title"
                  onChange={this.update('title')} />
                <input
                  className="photo-create-description"
                  type="text"
                  value={this.state.description}
                  placeholder="Add a description"
                  onChange={this.update('description')} />
              </div>
              <div className="photo-create-image-container">
                <input className="photo-create-upload" type="file" onChange={this.updateFile} />
                <div className="photo-create-image">
                  <img
                    src={this.state.imageUrl}
                  />
                </div>
              </div>
              <input className="photo-create-button" type="submit" value="Upload Photo" />
            </form>
          </div>
          <div className="photo-create-placeholder-image"></div>
        </div>
      );
    }
  }
}

export default PhotoCreate;
