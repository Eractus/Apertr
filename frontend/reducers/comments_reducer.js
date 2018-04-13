import {
  RECEIVE_ALL_COMMENTS,
  RECEIVE_COMMENT,
  REMOVE_COMMENT
} from "../actions/album_actions";
import merge from "lodash/merge";

const commentsReducer = (currentState = {}, action) => {
  Object.freeze(currentState);
  const newState = merge({}, currentState);
  switch (action.type) {
    case RECEIVE_ALL_COMMENTS:
      return merge({}, action.comments);
    case RECEIVE_COMMENT:
      newState[action.comment.id] = action.comment;
      return newState;
    case REMOVE_COMMENT:
      delete newState[action.commentId];
      return newState;
    default:
      return currentState;
  }
};

export default commentsReducer;
