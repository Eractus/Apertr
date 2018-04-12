import values from 'lodash/values';

export const selectAllCurrentUserPhotos = state => {
  return state.session.currentUser.photo_ids.map(id => (
    state.photos[id]
  ));
};

export const selectAllCurrentUserAlbums = state => {
  let userAlbums = [];
  for(let i=0; i<state.session.currentUser.album_ids.length; i++) {
    if (state.albums[state.session.currentUser.album_ids[i]] === undefined) {
      return undefined;
    } else {
      userAlbums.push(state.albums[state.session.currentUser.album_ids[i]]);
    }
  }
  return userAlbums;
};
