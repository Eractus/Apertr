import {
  RECEIVE_TAG_ERRORS,
  RECEIVE_TAG
} from "../actions/tag_actions";

const tagErrorsReducer = (currentState = [], action) => {
  Object.freeze(currentState);
  switch (action.type) {
    case RECEIVE_TAG_ERRORS:
      return action.errors;
    case RECEIVE_TAG:
      return [];
    default:
      return currentState;
  }
};

export default tagErrorsReducer;
