import {
  RECEIVE_ALL_TAGS,
  RECEIVE_TAG,
  REMOVE_TAG
} from "../actions/tag_actions";
import merge from "lodash/merge";

const tagsReducer = (currentState = {}, action) => {
  Object.freeze(currentState);
  const newState = merge({}, currentState);
  switch (action.type) {
    case RECEIVE_ALL_TAGS:
      return merge({}, action.tags);
    case RECEIVE_TAG:
      newState[action.tag.id] = action.tag;
      return newState;
    case REMOVE_TAG:
      delete newState[action.tagId];
      return newState;
    default:
      return currentState;
  }
};

export default tagsReducer;
