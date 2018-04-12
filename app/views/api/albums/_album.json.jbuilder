json.extract! album, :id, :title, :description, :owner_id
json.ownerFname (album.owner.first_name)
json.ownerLname (album.owner.last_name)
