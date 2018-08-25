require 'rails_helper'

RSpec.describe Tag, type: :model do

  describe 'validations' do
    it { should validate_presence_of(:word) }
  end

  describe 'associations' do
    it { should have_many(:tagged_photos) }
    it { should have_many(:photos).through(:tagged_photos) }
  end

end
