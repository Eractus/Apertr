import {
  RECEIVE_ALL_USERS,
  RECEIVE_USER,
} from '../actions/user_actions';
import merge from 'lodash/merge';

const usersReducer = (currentState = {}, action) => {
  Object.freeze(currentState);
  const newState = merge({}, currentState);
  switch (action.type) {
    case RECEIVE_ALL_USERS:
      return merge({}, action.users);
    case RECEIVE_USER:
      newState[action.user.id] = action.user;
      console.log(newState);
      return newState;
    default:
      return currentState;
  }
};

export default usersReducer;
