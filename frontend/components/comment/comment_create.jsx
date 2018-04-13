import React from 'react';

class CommentCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user_id: this.props.userId,
      photo_id: this.props.photo.id,
      description: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors()
  }

  update(field) {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createComment(this.state)
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
    return (
      <div className="comment-create-background">
        <div className="comment-create-container">
          <form onSubmit={this.handleSubmit}>
            <input
              className="comment-create-description"
              type="text"
              value={this.state.descriptopn}
              placeholder="Add a comment"
              onChange={this.update('description')} />
            <input className="comment_create-button" type="submit" value="Comment" />
          </form>
        </div>
      </div>
    );
  }
}

export default CommentCreate;
