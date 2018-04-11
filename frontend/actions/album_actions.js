import * as AlbumApiUtil from "../util/album_api_util";

export const RECEIVE_ALBUMS = 'RECEIVE_ALBUMS';
export const RECEIVE_ALBUM = "RECEIVE_ALBUM";
export const REMOVE_ALBUM = "REMOVE_ALBUM";
export const RECEIVE_ALBUM_ERRORS = "RECEIVE_ALBUM_ERRORS";

export const fetchAlbums = () => dispatch => (
  AlbumApiUtil.fetchAlbums().then(albums => dispatch(receiveAlbums(albums)))
);

export const fetchAlbum = id => dispatch => (
  AlbumApiUtil.fetchAlbum(id).then(album => dispatch(receiveAlbum(album)),
  error => dispatch(receiveErrors(error.responseJSON)))
);

export const createAlbum = album => dispatch => (
  AlbumApiUtil.createAlbum(album).then(
    ajaxAlbum => dispatch(receiveAlbum(ajaxAlbum)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const updateAlbum = album => dispatch => (
  AlbumApiUtil.updateAlbum(album).then(
    ajaxAlbum => dispatch(receiveAlbum(ajaxAlbum)),
    error => dispatch(receiveErrors(error.responseJSON)))
);

export const deleteAlbum = albumId => dispatch => (
  AlbumApiUtil.deleteAlbum(albumId).then(album => dispatch(albumId))
);

export const receiveAlbums = albums => ({
  type: RECEIVE_ALBUMS,
  albums
});

export const receiveAlbum = album => ({
  type: RECEIVE_ALBUM,
  album
});

export const removeAlbum = albumId => ({
  type: REMOVE_ALBUM,
  albumId
});

export const receiveErrors = errors => ({
  type: RECEIVE_ALBUM_ERRORS,
  errors
});
