import { RECEIVE_CURRENT_USER } from "../actions/session_actions";
import { REMOVE_ALBUM } from "../actions/album_actions";
import { RECEIVE_CREATED_ALBUM } from "../actions/album_actions";
import merge from "lodash/merge";

const _nullUser = Object.freeze({
  currentUser: null
});

const sessionReducer = (currentState = _nullUser, action) => {
  Object.freeze(currentState);
  const newState = merge({}, currentState);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      const currentUser = action.currentUser;
      return merge({}, { currentUser });
    case REMOVE_ALBUM:
      newState.currentUser.album_ids = newState.currentUser.album_ids.filter(
        (album_id) => album_id != action.albumId);
      return newState;
    case RECEIVE_CREATED_ALBUM:
      newState.currentUser.album_ids.push(action.albumId);
      return newState;
    default:
      return currentState;
  }
};

export default sessionReducer;
