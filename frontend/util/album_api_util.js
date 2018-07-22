export const fetchAlbums = () => (
  $.ajax({
    method: "GET",
    url: "api/albums"
  })
);

export const fetchAlbum = id => (
  $.ajax({
    method: "GET",
    url: `api/albums/${id}`
  })
);

export const createAlbum = formData => (
  $.ajax({
    method: "POST",
    url: "api/albums",
    contentType: false,
    processData: false,
    data: formData
  })
);

export const updateAlbum = formData => (
  $.ajax({
    method: "PATCH",
    url: `api/albums/${formData.get("id")}`,
    contentType: false,
    processData: false,
    data: formData
  })
);

export const deleteAlbum = id => (
  $.ajax({
    method: "DELETE",
    url: `api/albums/${id}`
  })
);
