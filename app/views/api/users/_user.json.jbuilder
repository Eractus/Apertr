json.extract! user, :id, :email
json.photo_ids user.photos.pluck(:id)
json.album_ids user.albums.pluck(:id)
json.image_url asset_path(user.image.url)
