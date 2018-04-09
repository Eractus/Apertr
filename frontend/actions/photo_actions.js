import * as PhotoApiUtil from '../util/photo_api_util';

export const RECEIVE_PHOTOS = 'RECEIVE_PHOTOS';
export const RECEIVE_PHOTO = 'RECEIVE_PHOTO';
export const REMOVE_PHOTO = 'REMOVE_PHOTO';

export const fetchPhotos = () => dispatch => (
  PhotoApiUtil.fetchPhotos().then(photos => dispatch(receivePhotos(photos)))
);

export const fetchPhoto = id => dispatch => (
  PhotoApiUtil.fetchPhoto(id).then(photo => dispatch(receivePhoto(photo)))
);

export const createPhoto = photo => dispatch => (
  PhotoApiUtil.createPhoto(photo).then(
    ajaxPhoto => dispatch(receivePhoto(ajaxPhoto)))
);

export const updatePhoto = photo => dispatch => (
  PhotoApiUtil.updatePhoto(photo).then(
    ajaxPhoto => dispatch(receivePhoto(ajaxPhoto)))
);

export const deletePhoto = id => dispatch => (
  PhotoApiUtil.deletePhoto(id).then(photo => dispatch(removePhoto(photo.id)))
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
