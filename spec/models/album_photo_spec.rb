require 'rails_helper'

RSpec.describe AlbumPhoto, type: :model do

  describe 'associations' do
    it { should belong_to(:photo) }
    it { should belong_to(:album) }
  end

end
