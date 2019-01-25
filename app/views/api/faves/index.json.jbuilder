@faves.each do |fave|
  json.set! fave.id do
    json.partial! "api/faves/fave", fave: fave
  end
end
