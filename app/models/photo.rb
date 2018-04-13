class Photo < ApplicationRecord
  validates :title, :description, :user_id, presence: true
  has_attached_file :image, default_url: "profile-icon.png",
  :url =>':s3_domain_url',
  :path => '/:class/:attachment/:id_partition/:style/:filename'
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  belongs_to :user

  has_many :photo_albums, dependent: :destroy, inverse_of: :tag,
    class_name: :AlbumPhoto,
    foreign_key: :photo_id,
    primary_key: :id

  has_many :albums,
    through: :photo_albums,
    source: :album
end
