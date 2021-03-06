export const fetchTags = (photoId) => (
  $.ajax({
    method: "GET",
    url: `api/photos/${photoId}/tags`
  })
);

export const fetchTag = id => (
  $.ajax({
    method: "GET",
    url: `api/tags/${id}`
  })
);

export const createTag = tag => (
  $.ajax({
    method: "POST",
    url: `api/photos/${tag.photo_id}/tags`,
    data: { tag }
  })
);

export const deleteTag = (id, photoId) => (
  $.ajax({
    method: "DELETE",
    url: `api/tags/${id}/photo/${photoId}`
  })
);
