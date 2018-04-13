import {
  RECEIVE_COMMENT_ERRORS,
  RECEIVE_COMMENT
} from "../actions/comment_actions";

const commentErrorsReducer = (currentState = [], action) => {
  Object.freeze(currentState);
  switch (action.type) {
    case RECEIVE_COMMENT_ERRORS:
      return action.errors;
    case RECEIVE_COMMENT:
      return [];
    default:
      return currentState;
  }
};

export default commentErrorsReducer;
