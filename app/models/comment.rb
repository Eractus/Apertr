class Comment < ApplicationRecord
  validates :description, presence: true

  belongs_to :photo
  belongs_to :user
end
