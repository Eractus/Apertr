import React from 'react';
import PhotosSearchContainer from './photos_search_container';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.searchParams,
      searchParams: this.props.searchParams,
      inputErrorMessage: ''
    }
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  update(e) {
    return this.setState({
      search: e.target.value
    })
  }

  handleSubmit(e) {
    let search = this.state.search;
    if (search.trim().length === 0) {
      this.setState({
        inputErrorMessage: 'Search parameters cannot be blank!',
        search: ''
      })
      return;
    } else {
      this.setState({
        inputErrorMessage: '',
        searchParams: search
      })
      this.props.history.push(`/search/${this.state.search}`)
    }
  }

  render () {
    return (
      <div className="search-container">
        <form onSubmit={this.handleSubmit} className="search-form-container">
          <input type="text" onChange={this.update}
            placeholder="Photos" value={this.state.search}
          />
        </form>
        <h3 className="search-error">{this.state.inputErrorMessage}</h3>
        <PhotosSearchContainer searchParams={this.state.searchParams} />
      </div>
    )
  }

}

export default Search;
