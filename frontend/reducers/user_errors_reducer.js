import {
  RECEIVE_USER,
  RECEIVE_USER_ERRORS
} from "../actions/user_actions";

const userErrorsReducer = (currentState = [], action) => {
  Object.freeze(currentState);
  switch (action.type) {
    case RECEIVE_USER_ERRORS:
      return action.errors;
    case RECEIVE_USER:
      return [];
    default:
      return currentState;
  }
};

export default userErrorsReducer;
