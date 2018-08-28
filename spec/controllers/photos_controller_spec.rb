require 'rails_helper'

RSpec.describe Api::PhotosController, type: :controller do
  render_views

  let (:json) { JSON.parse(response.body) }
  let (:user) { User.create!({
    first_name: 'Polly',
    last_name: 'Wang',
    email: 'polly@polly.com',
    password:'password'
  })}

  describe 'POST #create' do
    context 'when logged in' do
      before do
        allow(controller).to receive(:current_user) { user }
      end

      context 'with invalid params' do
        it 'responds with error code 422' do
          post :create, format: :json, params: {photo: {
            title: '',
            description: '',
            user_id: user.id
          }}
          expect(response.status).to eq(422)
        end
      end

      context 'with valid params' do
        it 'uploads a photo' do
          post :create, format: :json, params: {photo: {
            title: 'Yosemite',
            description: 'Half dome',
            user_id: user.id
          }}
          expect(Photo.last.title).to eq('Yosemite')
        end
      end

    end
  end
end
