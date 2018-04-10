import React from 'react';
import { Link } from 'react-router-dom';

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
    formData.append("photo[image]", this.state.imageFile);
    this.props.createPhoto(formData).then(data => this.props.history.push(`/photos/${data.photo.id}`));
  }

  render() {
    return (
      <div className="photo-create-container">
        <form onSubmit={this.handleSubmit} className="photo-create-form">
          <input
            type="text"
            value={this.state.title}
            placeholder="Enter a title"
            onChange={this.update('title')} />
          <input
            type="text"
            value={this.state.description}
            placeholder="Enter a description"
            onChange={this.update('description')} />
          <input type="file" onChange={this.updateFile} />
          <input type="submit" value="Upload Photo" />
        </form>
        <img src={this.state.imageUrl} />
      </div>
    );
  }
}

export default PhotoCreate;
