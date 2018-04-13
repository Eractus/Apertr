json.extract! comment, :id, :description, :user_id, :photo_id
json.userFname (comment.user.first_name)
json.userLname (comment.user.last_name)
