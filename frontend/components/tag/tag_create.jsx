import React from 'react';

class TagCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photo_id: this.props.photo.id,
      word: "",
      toggledTagCreate: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openTagCreateFields = this.openTagCreateFields.bind(this);
    this.closeTagCreateFields = this.closeTagCreateFields.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  openTagCreateFields() {
    this.setState({ toggledTagCreate: true });
  }

  closeTagCreateFields() {
    this.props.clearErrors();
    this.setState({ toggledTagCreate: false });
  }

  update(field) {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createTag(this.state);
    if (this.state.word !== "") {
      this.setState({word: ""});
      this.closeTagCreateFields()
    }
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
    if (this.state.toggledTagCreate === false) {
      return (
        <div className="tag-create-container">
          <div className="tags-header">
            <p>Tags</p>
            <p onClick={this.openTagCreateFields} className="tag-add">Add tags</p>
          </div>
        </div>
      );
    } else if (this.state.toggledTagCreate === true) {
      return (
        <div className="tag-create-container">
          <div className="tags-header">
            <p>Tags</p>
            <p onClick={this.openTagCreateFields} className="tag-add">Add tags</p>
          </div>
          <form onSubmit={this.handleSubmit} className="tag-create-fields">
            <input
              type="text"
              value={this.state.word}
              placeholder="Add a tag"
              onChange={this.update('word')}
              className="tag-input-field" />
            <input className="tag-input-add" type="submit" value="Add" />
            <p className="tag-input-cancel" onClick={this.closeTagCreateFields}>cancel</p>
          </form>
          <div>{this.renderErrors()}</div>
        </div>
      )
    }
  }
}

export default TagCreate;
