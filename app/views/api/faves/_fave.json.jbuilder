json.extract! fave, :id, :user_id, :photo_id
json.userFname (fave.user.first_name)
json.userLname (fave.user.last_name)
