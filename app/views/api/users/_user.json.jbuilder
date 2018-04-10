json.extract! user, :id, :email, :photos
json.image_url asset_path(user.image.url)
