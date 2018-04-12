class User < ApplicationRecord
  validates :email, :password_digest, :session_token, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true
  validates :password, length: { minimum: 8, allow_nil: true }
  has_attached_file :image, default_url: "profile-icon.png",
  :url =>':s3_domain_url',
  :path => '/:class/:attachment/:id_partition/:style/:filename'
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  before_validation :ensure_session_token

  has_many :photos
  has_many :albums,
    foreign_key: :owner_id,
    class_name: :Album

  attr_reader :password

  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)
    user && user.is_password?(password) ? user : nil
  end

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64
    self.save!
    self.session_token
  end

  def ensure_session_token
    self.session_token = SecureRandom.urlsafe_base64
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(password_digest).is_password?(password)
  end
end
