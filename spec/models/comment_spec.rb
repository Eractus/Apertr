require 'rails_helper'

RSpec.describe Comment, type: :model do

  describe 'validations' do
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:photo_id) }
    it { should validate_presence_of(:user_id) }
  end

  describe 'associations' do
    it { should belong_to(:photo) }
    it { should belong_to(:user) }
  end

end
