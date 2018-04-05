import { RECEIVE_CURRENT_USER } from "../actions/session_actions";
import merge from "lodash/merge";

const _nullUser = Object.freeze({
  currentUser: null
});

const sessionReducer = (defaultState = _nullUser, action) => {
  Object.freeze(defaultState);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      const currentUser = action.currentUser;
      return merge({}, { currentUser });
    default:
      return defaultState;
  }
};

export default sessionReducer;
