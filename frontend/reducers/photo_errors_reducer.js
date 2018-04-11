import {
  RECEIVE_PHOTO_ERRORS,
  RECEIVE_PHOTO
} from "../actions/photo_actions";

const photoErrorsReducer = (currentState = [], action) => {
  Object.freeze(currentState);
  switch (action.type) {
    case RECEIVE_PHOTO_ERRORS:
      return action.errors;
    case RECEIVE_PHOTO:
      return [];
    default:
      return currentState;
  }
};

export default photoErrorsReducer;
