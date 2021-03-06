export const fetchComments = (photoId) => (
  $.ajax({
    method: "GET",
    url: `api/photos/${photoId}/comments`
  })
);

export const fetchComment = id => (
  $.ajax({
    method: "GET",
    url: `api/comments/${id}`
  })
);

export const createComment = comment => (
  $.ajax({
    method: "POST",
    url: `api/photos/${comment.photo_id}/comments`,
    data: { comment }
  })
);

export const updateComment = (comment, id) => (
  $.ajax({
    method: "PATCH",
    url: `api/photos/${comment.photo_id}/comments/${id}`,
    data: { comment }
  })
);

export const deleteComment = id => (
  $.ajax({
    method: "DELETE",
    url: `api/comments/${id}`
  })
);
