export const selectAllCurrentUserPhotos = state => {
  return state.session.currentUser.photo_ids.map(id => (
    state.photos[id]
  ));
};
