@photos.each do |photo|
  json.set! photo.id do
    json.partial! "api/photos/photo", photo: photo

    json.comments photo.comments.pluck(:id)
  end
end
