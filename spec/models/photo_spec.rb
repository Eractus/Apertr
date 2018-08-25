require 'rails_helper'

RSpec.describe Photo, type: :model do

  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:user_id) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:photo_albums) }
    it { should have_many(:albums).through(:photo_albums) }
    it { should have many(:photo_tags) }
    it { should have many(:tags).through(:photo_tags) }
    it { should have_many(:comments) }
  end

end
