class Tag < ApplicationRecord
  validates :word, presence: true

  has_many :tagged_photos,
    class_name: :PhotoTag,
    foreign_key: :tag_id,
    primary_key: :id

  has_many :photos,
    through: :tagged_photos,
    source: :photo
end
