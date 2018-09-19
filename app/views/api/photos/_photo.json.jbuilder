json.extract! photo, :id, :title, :description, :user_id
json.image_url asset_path(photo.image.url)
json.userFname (photo.user.first_name)
json.userLname (photo.user.last_name)
json.comments photo.comments.pluck(:id)
