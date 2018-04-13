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

export const createAlbum = album => (
  $.ajax({
    method: "POST",
    url: "api/albums",
    contentType: false,
    processData: false,
    data: album
  })
);

export const updateAlbum = album => (
  $.ajax({
    method: "PATCH",
    url: `api/albums/${album.id}`,
    contentType: false,
    processData: false,
    data: album
  })
);

export const deleteAlbum = id => (
  $.ajax({
    method: "DELETE",
    url: `api/albums/${id}`
  })
);
