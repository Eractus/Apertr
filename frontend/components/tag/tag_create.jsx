import React from 'react';

class TagCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photo_id: this.props.photo.id,
      word: "",
      openTagCreate: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleTagCreateFields = this.toggleTagCreateFields.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  // open/close the field for creating a new tag word (if it doesn't already exist) and photo tag with the current photo
  toggleTagCreateFields() {
    this.setState({ openTagCreate: !this.state.openTagCreate });
  }

  update(field) {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createTag(this.state);
    // reset state for word field to blank and close the tag create field
    if (this.state.word !== "") {
      this.setState({word: ""});
      this.toggleTagCreateFields()
    }
  }

  // render error based on Tag controller for create method
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
    // shared header of tag create component
    const tagCreate =
        <div className="tags-header">
          <p>Tags</p>
          <p onClick={this.toggleTagCreateFields} className="tag-add">Add tags</p>
        </div>

    if (!this.state.openTagCreate) {
      return (
        <div className="tag-create-container">
          {tagCreate}
        </div>
      );
    } else {
      return (
        <div className="tag-create-container">
          {tagCreate}
          <form onSubmit={this.handleSubmit} className="tag-create-fields">
            <input
              type="text"
              value={this.state.word}
              placeholder="Add a tag"
              onChange={this.update('word')}
              className="tag-input-field" />
            <input className="tag-input-add" type="submit" value="Add" />
            <p className="tag-input-cancel" onClick={this.toggleTagCreateFields}>cancel</p>
          </form>
          <div>{this.renderErrors()}</div>
        </div>
      )
    }
  }
}

export default TagCreate;
