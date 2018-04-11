class Album < ApplicationRecord
  validates :title, :description, :owner_id, presence: true

  belongs_to :user
  has_many :photos
end
