import React from 'react';
import { withRouter } from 'react-router-dom';
import PhotoIndexItemUser from '../photo/photo_index_item_user';

class PhotosSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.searchParams,
      searchErrorMessage: ''
    }
    this.update = this.update.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  componentDidMount() {
    this.setState({ search: "" });
    this.props.searchTaggedPhotos(this.props.searchParams);
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
    const photos = Object.values(this.props.photos).map((photo, i) => (
      <PhotoIndexItemUser key={photo.id} photo={photo} />
    ));
    const photosSearchContainer = (Object.keys(this.props.photos).length === 0) ?
      <div className="photo-search-no-results">
        <p>Oops! There are no matches for your search. Please try again.</p>
        <div className="search-bar-logged-in">
          <form className="search-bar-input-field" onSubmit={this.handleSubmitSearch}>
            <span className="fas fa-search"></span>
            <input
              type="text"
              onChange={this.update}
              placeholder="Search photos"
              value={this.state.search}
            />
            </form>
            <p className="search-error">{this.state.searchErrorMessage}</p>
        </div>
      </div> :
      <div>
        <h2>Everyone's photos</h2>
        <ul className="photos-search-container">
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
