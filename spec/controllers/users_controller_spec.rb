require 'rails_helper'

RSpec.describe Api::UsersController, type: :controller do
  render_views

  let(:json) { JSON.parse(response.body) }

  describe 'POST #create' do
    it 'validates the presence of first name, last name, email and password' do
      post :create, format: :json, params: {user: {
        first_name: 'Polly',
        last_name: 'Wang',
        email: 'polly@polly.com',
        password: 'password'
      }}
      expect(User.last.email).to eq('polly@polly.com')
    end

    context 'with valid params' do
      it 'logs in the user' do
        post :create, format: :json, params: {user: {
          first_name: 'Polly',
          last_name: 'Wang',
          email: 'polly@polly.com',
          password: 'password'
        }}
        user = User.find_by_email('polly@polly.com')
        expect(session[:session_token]).to eq(user.session_token)
      end
    end

    context 'with invalid params' do
      it 'responds with error code 422' do
        post :create, format: :json, params: {user: {
          first_name: '',
          last_name: '',
          email: '',
          password: ''
        }}
        expect(response.status).to eq(422)
      end
    end
  end

end
