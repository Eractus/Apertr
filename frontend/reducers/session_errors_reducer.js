import {
  RECEIVE_SESSION_ERRORS,
  RECEIVE_CURRENT_USER
} from "../actions/session_actions";

const sessionErrorsReducer = (defaultState = [], action) => {
  Object.freeze(defaultState);
  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      return action.errors;
    case RECEIVE_CURRENT_USER:
      return [];
    default:
      return defaultState;
  }
};

export default sessionErrorsReducer;
