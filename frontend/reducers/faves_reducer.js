import {
  RECEIVE_ALL_FAVES,
  RECEIVE_FAVE,
  REMOVE_FAVE
} from "../actions/fave_actions";
import merge from "lodash/merge";

const favesReducer = (currentState = {}, action) => {
  Object.freeze(currentState);
  const newState = merge({}, currentState);
  switch (action.type) {
    case RECEIVE_ALL_FAVES:
      return merge({}, action.faves);
    case RECEIVE_FAVE:
      newState[action.fave.id] = action.fave;
      return newState;
    case REMOVE_FAVE:
      delete newState[action.faveId];
      return newState;
    default:
      return currentState;
  }
};

export default favesReducer;
