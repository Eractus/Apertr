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
        <div>
          <button onClick={this.openTagCreateFields}>Add a tag</button>
        </div>
      );
    } else if (this.state.toggledTagCreate === true) {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.word}
              onChange={this.update('word')} />
            <input type="submit" value="Add" />
            <button onClick={this.closeTagCreateFields}>cancel</button>
          </form>
          <div>{this.renderErrors()}</div>
        </div>
      )
    }
  }
}

export default TagCreate;
