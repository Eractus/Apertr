import {
  RECEIVE_ALBUM,
  RECEIVE_ALBUM_ERRORS
} from "../actions/album_actions";

const albumErrorsReducer = (currentState = [], action) => {
  Object.freeze(currentState);
  switch (action.type) {
    case RECEIVE_ALBUM_ERRORS:
      return action.errors;
    case RECEIVE_ALBUM:
      return [];
    default:
      return currentState;
  }
};

export default albumErrorsReducer;
