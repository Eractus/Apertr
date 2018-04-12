json.extract! album, :id, :title, :description, :owner_id
json.set! "photos" do
  album.photos.each do |photo|
    json.set! photo.id do
      json.id photo.id
      json.image_url asset_path(photo.image.url)
    end
  end
end
json.ownerFname (album.owner.first_name)
json.ownerLname (album.owner.last_name)
