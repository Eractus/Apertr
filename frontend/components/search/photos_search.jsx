import React from 'react';
import { withRouter } from 'react-router-dom';
import PhotoIndexItem from '../photo/photo_index_item';

class PhotosSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoad: true,
      search: this.props.searchParams,
      searchErrorMessage: ''
    }
    this.update = this.update.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  componentDidMount() {
    this.setState({ search: "" });
    this.props.searchTaggedPhotos(this.props.searchParams);
    this.props.fetchAllUsers().then(() => this.setState({ firstLoad: false }));
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchParams !== prevProps.searchParams) {
      this.props.searchTaggedPhotos(prevProps.searchParams);
    }
  }

  handleSubmitSearch() {
    let searchParams = this.state.search;
    if (!searchParams || searchParams.trim().length === 0) {
      this.setState({
        searchErrorMessage: 'Search field cannot be empty.',
        search: ''
      })
      return;
    } else {
      this.setState({
        searchErrorMessage: '',
      })
    }
    this.setState({ search: '' });
    this.props.searchTaggedPhotos(searchParams).then(
      this.props.history.push(`/search/photos/${searchParams}`)
    );
  }

  update(e) {
    return this.setState({
      search: e.target.value
    })
  }

  render () {
    if (this.state.firstLoad) {
      return (
        <div className="photos-search-loading">
          <p>Loading...</p>
        </div>
      );
    }

    const photos = Object.values(this.props.photos).map(photo => (
      <PhotoIndexItem
        users={this.props.users}
        currentUser={this.props.currentUser}
        photo={photo}
      />
    ));
    const photosSearchContainer = (Object.keys(this.props.photos).length === 0) ?
      <div className="photos-search-no-results">
        <div className="photos-search-no-results-body">
          <div className="photos-search-no-results-text">
            <p>Oops! There are no matches for your search. Please try again.</p>
          </div>
          <form className="photos-search-no-results-search-bar" onSubmit={this.handleSubmitSearch}>
            <span className="fas fa-search"></span>
            <input
              className="photos-search-no-results-input"
              type="text"
              onChange={this.update}
              placeholder="Search photos"
              value={this.state.search}
            />
            <input className="photos-search-no-results-submit" type="submit" value="Search" />
          </form>
          <p className="photos-search-no-results-search-error">{this.state.searchErrorMessage}</p>
        </div>
      </div> :
      <div className="photos-search-results">
        <h2>Everyone's photos</h2>
        <ul className="photos-search-items-container">
          {photos}
        </ul>
      </div>

    return (
      <div>
        {photosSearchContainer}
      </div>
    )
  }

}

export default withRouter(PhotosSearch);
