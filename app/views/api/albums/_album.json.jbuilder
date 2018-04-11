json.extract! album, :id, :title, :description, :author_id
json.image_url asset_path(album.image.url)
json.ownerFname (album.owner.first_name)
json.ownerLname (album.owner.last_name)
