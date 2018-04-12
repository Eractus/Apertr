class AlbumPhoto < ApplicationRecord
  belongs_to :photo,
    class_name: :Photo,
    foreign_key: :photo_id,
    primary_key: :id

  belongs_to :album,
    class_name: :Album,
    foreign_key: :album_id,
    primary_key: :id
end
