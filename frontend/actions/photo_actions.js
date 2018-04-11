import * as PhotoApiUtil from '../util/photo_api_util';

export const RECEIVE_PHOTOS = 'RECEIVE_PHOTOS';
export const RECEIVE_PHOTO = 'RECEIVE_PHOTO';
export const REMOVE_PHOTO = 'REMOVE_PHOTO';
export const RECEIVE_PHOTO_ERRORS = 'RECEIVE_PHOTO_ERRORS';

export const fetchPhotos = () => dispatch => (
  PhotoApiUtil.fetchPhotos().then(photos => dispatch(receivePhotos(photos)))
);

export const fetchPhoto = id => dispatch => (
  PhotoApiUtil.fetchPhoto(id).then(photo => dispatch(receivePhoto(photo)),
  error => dispatch(receiveErrors(error.responseJSON)))
);

export const createPhoto = photo => dispatch => (
  PhotoApiUtil.createPhoto(photo).then(
    ajaxPhoto => dispatch(receivePhoto(ajaxPhoto)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const updatePhoto = photo => dispatch => (
  PhotoApiUtil.updatePhoto(photo).then(
    ajaxPhoto => dispatch(receivePhoto(ajaxPhoto)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const deletePhoto = photoId => dispatch => (
  PhotoApiUtil.deletePhoto(photoId).then(photo => dispatch(removePhoto(photoId)))
);

export const receivePhotos = photos => ({
  type: RECEIVE_PHOTOS,
  photos
});

export const receivePhoto = photo => ({
  type: RECEIVE_PHOTO,
  photo
});

export const removePhoto = photoId => ({
  type: REMOVE_PHOTO,
  photoId
});

export const receiveErrors = errors => ({
  type: RECEIVE_PHOTO_ERRORS,
  errors
});
