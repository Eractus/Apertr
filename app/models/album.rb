class Album < ApplicationRecord
  validates :title, :description, :owner_id, presence: true

  belongs_to :owner,
    primary_key: :id,
    foreign_key: :owner_id,
    class_name: :User

  has_many :album_photos,
    class_name: :AlbumPhoto,
    foreign_key: :album_id,
    primary_key: :id

  has_many :photos,
    through: :album_photos,
    source: :photo
end
