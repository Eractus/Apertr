import { RECEIVE_SEARCH_PHOTOS } from '../actions/photo_actions';
import merge from 'lodash/merge';

const searchReducer = (oldState={ photos: {} }, action) => {
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_SEARCH_PHOTOS:
      return merge({}, { photos: action.photos });
    default:
      return oldState;
  }
};

export default searchReducer;
