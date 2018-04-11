import {
  RECEIVE_ALBUMS,
  RECEIVE_ALBUM,
  REMOVE_ALBUM
} from "../actions/album_actions";
import merge from "lodash/merge";

const albumsReducer = (currentState = {}, action) => {
  Object.freeze(currentState);
  const newState = merge({}, currentState);
  switch (action.type) {
    case RECEIVE_ALBUMS:
      return merge({}, action.albums);
    case RECEIVE_ALBUM:
      newState[action.album.id] = action.album;
      return newState;
    case REMOVE_ALBUM:
      delete newState[action.albumId];
      return newState;
    default:
      return currentState;
  }
};

export default albumsReducer;
