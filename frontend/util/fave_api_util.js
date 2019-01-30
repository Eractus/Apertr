export const fetchFaves = (photoId) => (
  $.ajax({
    method: "GET",
    url: `api/photos/${photoId}/faves`
  })
);

export const fetchFave = id => (
  $.ajax({
    method: "GET",
    url: `api/faves/${id}`
  })
);

export const createFave = fave => (
  $.ajax({
    method: "POST",
    url: `api/photos/${fave.photo_id}/faves`,
    data: { fave }
  })
);

export const deleteFave = id => (
  $.ajax({
    method: "DELETE",
    url: `api/faves/${id}`
  })
);
