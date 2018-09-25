import * as UserApiUtil from "../util/user_api_util";

export const RECEIVE_ALL_USERS = "RECEIVE_ALL_USERS";
export const RECEIVE_USER = "RECEIVE_USER";
export const RECEIVE_USER_ERRORS = "RECEIVE_USER_ERRORS";

export const fetchAllUsers = () => dispatch => (
  UserApiUtil.fetchAllUsers().then(
    users => dispatch(receiveAllUsers(users))
  )
);

export const fetchUser = id => dispatch => (
  UserApiUtil.fetchUser(id).then(
    user => dispatch(receiveUser(user)),
    error => dispatch(receiveErrors(error.responseJSON))
  )
);

export const receiveAllUsers = users => ({
  type: RECEIVE_ALL_USERS,
  users
});

export const receiveUser = user => ({
  type: RECEIVE_USER,
  user
});

export const receiveErrors = errors => ({
  type: RECEIVE_USER_ERRORS,
  errors
});
