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
    this.props.createComment(this.state);
    this.setState({description: ""});
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
            <textarea
              className="comment-create-description"
              value={this.state.description}
              placeholder="Add a comment"
              onChange={this.update('description')} />
              <div className="comment-create-errors">{this.renderErrors()}</div>
            <input className="comment-create-button" type="submit" value="Comment" />
          </form>
        </div>
      </div>
    );
  }
}

export default CommentCreate;
