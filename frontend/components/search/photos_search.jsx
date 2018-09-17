import React from 'react';
import { withRouter } from 'react-router-dom';
import PhotoIndexItemUser from '../photo/photo_index_item_user';

class PhotosSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.searchParams,
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
    this.setState({ search: "" });
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
    if (Object.keys(this.props.photos).length === 0) {
      return (
        <div className="no-results">
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
          </div>
        </div>
      );
    } else {
      let photos = Object.values(this.props.photos).map((photo, i) => (
        <PhotoIndexItemUser key={photo.id} photo={photo} />
      ));

      return (
        <ul className="user-photos">
          {photos}
        </ul>
      )
    }
  }

}

export default withRouter(PhotosSearch);
