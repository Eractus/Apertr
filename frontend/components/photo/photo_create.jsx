import React from 'react';

class PhotoCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      imageFile: null,
      imageUrl: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateFile = this.updateFile.bind(this);
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
    return (
      <div className="photo-create-background">
        <div className="photo-create-container">
          <div className="photo-create-image">
            <input className="photo-upload" type="file" onChange={this.updateFile} />
            <img className="photo-preview" src={this.state.imageUrl} />
          </div>
          <form onSubmit={this.handleSubmit} className="photo-create-form">
            <div>{this.renderErrors()}</div>
            <input
              className="photo-create-title"
              type="text"
              value={this.state.title}
              placeholder="Enter a title"
              onChange={this.update('title')} />
            <textarea
              className="photo-create-description"
              type="text"
              value={this.state.description}
              placeholder="Enter a description"
              onChange={this.update('description')} />
            <input className="photo-create-button" type="submit" value="Upload Photo" />
          </form>
        </div>
      </div>
    );
  }
}

export default PhotoCreate;
