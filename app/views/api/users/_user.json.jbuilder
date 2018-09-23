json.extract! user, :id, :email, :first_name, :last_name, :created_at
json.photo_ids user.photos.pluck(:id)
json.album_ids user.albums.pluck(:id)
json.profile_pic asset_path(user.image.url)
json.cover_photo asset_path(user.cover_photo.url)
