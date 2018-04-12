json.extract! user, :id, :email
json.photo_ids user.photos.pluck(:id)
json.image_url asset_path(user.image.url)
