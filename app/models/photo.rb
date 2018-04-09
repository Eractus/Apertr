class Photo < ApplicationRecord
  validates :title, :description, :user_id, presence: true
  has_attached_file :image, default_url: "profile-icon.png",
  :url =>':s3_domain_url',
  :path => '/:class/:attachment/:id_partition/:style/:filename'
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  belongs_to :user
end
