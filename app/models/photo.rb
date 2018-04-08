class Photo < ApplicationRecord
  validates :title, :description, :user_id, :img_url, presence: true

  belongs_to :user
end
