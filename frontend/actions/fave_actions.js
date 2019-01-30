import * as FaveApiUtil from '../util/fave_api_util';

export const RECEIVE_ALL_FAVES = "RECEIVE_ALL_FAVES";
export const RECEIVE_FAVE = "RECEIVE_FAVE";
export const REMOVE_FAVE = "REMOVE_FAVE";
export const RECEIVE_FAVE_ERRORS = "RECEIVE_FAVE_ERRORS";

export const fetchAllFaves = (photoId) => dispatch => (
  FaveApiUtil.fetchFaves(photoId).then(
    faves => dispatch(receiveAllFaves(faves)))
);

export const fetchFave = id => dispatch => (
  FaveApiUtil.fetchFave(id).then(
    fave => dispatch(receiveFave(fave)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const createFave = fave => dispatch => (
  FaveApiUtil.createFave(fave).then(
    ajaxFave => dispatch(receiveFave(ajaxFave)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const deleteFave = faveId => dispatch => (
  FaveApiUtil.deleteFave(faveId).then(
    fave => dispatch(removeFave(faveId)))
);

export const receiveAllFaves = faves => ({
  type: RECEIVE_ALL_FAVES,
  faves
});

export const receiveFave = fave => ({
  type: RECEIVE_FAVE,
  fave
});

export const removeFave = faveId => ({
  type: REMOVE_FAVE,
  faveId
});

export const receiveErrors = errors => ({
  type: RECEIVE_FAVE_ERRORS,
  errors
});
