require 'rails_helper'

RSpec.describe Api::SessionsController, type: :controller do
  render_views

  let (:json) { JSON.parse(response.body) }
  let!(:user) { User.create({
    first_name: 'Polly',
    last_name: 'Wang',
    email: 'polly@polly.com',
    password:'password'
  })}

  describe 'POST #create' do
    context 'with valid credentials' do
      it 'logs in the user' do
        post :create, format: :json, params: {user: {email: 'polly@polly.com', password: 'password'}}
        user = User.find_by_email('polly@polly.com')
        expect((session[:session_token])).to eq(user.session_token)
      end
    end

    context 'with invalid credentials' do
      it 'responds with error code 401 if user does not exist' do
        post :create, format: :json, params: {user: {email: 'weijei@weijei.com', password: 'password'}}
        expect(response.status).to eq(401)
      end

      it 'responds with error code 401 if a wrong password is given' do
        post :create, format: :json, params: {user: {email: 'polly@polly.com', password:'wrong'}}
        expect(response.status).to eq(401)
      end
    end
  end

  describe 'DELETE #destroy' do
    before(:each) do
      post :create, format: :json, params: {user: {
        first_name: 'Polly',
        last_name: 'Wang',
        email: 'polly@polly.com',
        password:'password'
      }}
      @session_token = User.find_by_email('polly@polly.com').session_token
    end

    it 'logs out the current user' do
      delete :destroy, format: :json
      expect(session[:session_token]).to be_nil

      logged_out_user = User.find_by_email('polly@polly.com')
      expect(logged_out_user.session_token).not_to eq(@session_token)
    end
  end
end
