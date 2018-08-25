class PhotoTag < ApplicationRecord
  belongs_to :photo,
    class_name: :Photo,
    foreign_key: :photo_id,
    primary_key: :id

  belongs_to :tag,
    class_name: :Tag,
    foreign_key: :tag_id,
    primary_key: :id
end
