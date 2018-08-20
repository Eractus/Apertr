require 'rails_helper'

RSpec.describe Album, type: :model do

  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:owner_id) }
  end

  describe 'associations' do
    it { should belong_to(:owner) }
    it { should have_many(:album_photos) }
    it { should have_many(:photos).through(:album_photos) }
  end

end
