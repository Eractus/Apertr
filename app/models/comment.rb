class Comment < ApplicationRecord
  validates :description, :photo_id, :user_id, presence: true

  belongs_to :photo
  belongs_to :user
end
