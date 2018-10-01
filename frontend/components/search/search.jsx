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
        <div className="navbar-logged-in-header">
          <p>Photos</p>
        </div>
        <div className="search-results-container">
          <PhotosSearchContainer searchParams={this.state.searchParams} />
        </div>
      </div>
    )
  }

}

export default Search;
