import * as CommentApiUtil from '../util/comment_api_util';

export const RECEIVE_ALL_COMMENTS = "RECEIVE_ALL_COMMENTS";
export const RECEIVE_COMMENT = "RECEIVE_COMMENT";
export const REMOVE_COMMENT = "REMOVE_COMMENT";
export const RECEIVE_COMMENT_ERRORS = "RECEIVE_COMMENT_ERRORS";

export const fetchAllComments = (photoId) => dispatch => (
  CommentApiUtil.fetchComments(photoId).then(
    comments => dispatch(receiveAllComments(comments)))
);

export const fetchComment = comment => dispatch => (
  CommentApiUtil.fetchComment(comment).then(
    ajaxComment => dispatch(receiveComment(ajaxComment)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const createComment = comment => dispatch => (
  CommentApiUtil.createComment(comment).then(
    ajaxComment => dispatch(receiveComment(ajaxComment)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const deleteComment = commentId => dispatch => (
  CommentApiUtil.deleteComment(commentId).then(
    comment => dispatch(deleteComment(commentId)))
);

export const receiveAllComments = comments => ({
  type: RECEIVE_ALL_COMMENTS,
  comments
});

export const receiveComment = comment => ({
  type: RECEIVE_COMMENT,
  comment
});

export const removeComment = commentId => ({
  type: REMOVE_COMMENT,
  commentId
});

export const receiveErrors = errors => ({
  type: RECEIVE_COMMENT_ERRORS,
  errors
});
