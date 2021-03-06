import {
  RECEIVE_PHOTOS,
  RECEIVE_PHOTO,
  REMOVE_PHOTO
} from '../actions/photo_actions';
import merge from 'lodash/merge';

const photosReducer = (currentState = {}, action) => {
  Object.freeze(currentState);
  const newState = merge({}, currentState);
  switch (action.type) {
    case RECEIVE_PHOTOS:
      return merge({}, action.photos);
    case RECEIVE_PHOTO:
      newState[action.photo.id] = action.photo;
      return newState;
    case REMOVE_PHOTO:
      delete newState[action.photoId];
      return newState;
    default:
      return currentState;
  }
};

export default photosReducer;
