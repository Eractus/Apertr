import {
  RECEIVE_FAVE_ERRORS,
  RECEIVE_FAVE
} from "../actions/fave_actions";

const faveErrorsReducer = (currentState = [], action) => {
  Object.freeze(currentState);
  switch (action.type) {
    case RECEIVE_FAVE_ERRORS:
      return action.errors;
    case RECEIVE_FAVE:
      return [];
    default:
      return currentState;
  }
};

export default faveErrorsReducer;
