require 'rails_helper'

RSpec.describe User, type: :model do

  subject(:user) do
    User.create({
      first_name: 'Polly',
      last_name: 'Wang',
      email: 'polly@polly.com',
      password: 'password'
    })
  end

  describe 'password encryption' do
    it 'does not save passwords to the database' do
      User.create!({
        first_name: 'Polly',
        last_name: 'Wang',
        email: 'polly@polly.com',
        password: 'password'
      })
      user = User.find_by_email('polly@polly.com')
      expect(user.password).not_to be('password')
    end

    it 'encrypts the password using BCrypt' do
      expect(BCrypt::Password).to receive(:create)
      User.new({
        first_name: 'Polly',
        last_name: 'Wang',
        email: 'polly@polly.com',
        password: 'password'
        })
      end

    it 'creates a password digest when a password is given' do
      expect(user.password_digest).not_to be_nil
    end

  end

  describe 'session token' do
    it 'assigns a session_token if one is not given' do
      expect(user.session_token).not_to be_nil
    end

    describe '#reset_session_token' do
      it 'sets a new session token on the user' do
        old_session_token = user.session_token
        user.reset_session_token!
        expect(user.session_token).to_not eq(old_session_token)
      end

      it 'returns new session token' do
        expect(user.reset_session_token!).to eq(user.session_token)
      end
    end
  end

  describe 'validations' do
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:password_digest) }
    it { should validate_length_of(:password).is_at_least(8) }
  end

  describe 'associations' do
    it { should have_many(:photos) }
    it { should have_many(:albums) }
    it { should have_many(:comments) }
  end

end
