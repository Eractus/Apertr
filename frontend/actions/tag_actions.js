import * as TagApiUtil from '../util/tag_api_util';

export const RECEIVE_ALL_TAGS = "RECEIVE_ALL_TAGS";
export const RECEIVE_TAG = "RECEIVE_TAG";
export const REMOVE_TAG = "REMOVE_TAG";
export const RECEIVE_TAG_ERRORS = "RECEIVE_TAG_ERRORS";

export const fetchAllTags = (photoId) => dispatch => (
  TagApiUtil.fetchTags(photoId).then(
    tags => dispatch(receiveAllTags(tags)))
);

export const fetchTag = tag => dispatch => (
  TagApiUtil.fetchTag(tag).then(
    ajaxTag => dispatch(receiveTag(ajaxTag)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const createTag = tag => dispatch => (
  TagApiUtil.createTag(tag).then(
    ajaxTag => dispatch(receiveTag(ajaxTag)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const deleteTag = tagId => dispatch => (
  TagApiUtil.deleteTag(tagId).then(
    tag => dispatch(removeTag(tagId)))
);

export const receiveAllTags = tags => ({
  type: RECEIVE_ALL_TAGS,
  tags
});

export const receiveTag = tag => ({
  type: RECEIVE_TAG,
  tag
});

export const removeTag = tagId => ({
  type: REMOVE_TAG,
  tagId
});

export const receiveErrors = errors => ({
  type: RECEIVE_TAG_ERRORS,
  errors
});
