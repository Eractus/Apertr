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
    this.props.fetchAllUsers().then(
      this.props.searchTaggedPhotos(this.props.searchParams).then(
        () => this.setState({ firstLoad: false })
      )
    );
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchParams !== this.props.searchParams) {
      this.props.searchTaggedPhotos(this.props.searchParams);
    }
  }

  handleSubmitSearch() {
    let searchParams = this.state.search;
    // update state for error message if user tries to submit an empty search (or with spaces), otherwise redirect to search page based on searched tag word
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
    // display loading until ComponentDidMount finishes loading data into props
    if (this.state.firstLoad) {
      return (
        <div className="photos-search-loading">
          <p>Loading...</p>
        </div>
      );
    }

    // map photo objects from props that're based on searchParams and pass each object as props to reusable PhotoIndexItem component
    const photos = Object.values(this.props.photos).map(photo => (
      <PhotoIndexItem
        users={this.props.users}
        currentUser={this.props.currentUser}
        photo={photo}
      />
    ));

    // body of search page either shows search results of PhotoIndexItem objects or a template message and search bar for user to try again - there are suggested tag words given to search
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
              placeholder="Search photos (try 'nature', 'canon', or 'tennis')"
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
