class User < ApplicationRecord
  # validations for mandatory pieces of information for every instance of the User model
  validates :email, :password_digest, :session_token, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true
  validates :password, length: { minimum: 8, allow_nil: true }
  # Paperclip gem validations for attaching an image file to the User model and then saved to AWS S3 buckets based on instructions inside application.rb file
  has_attached_file :image, default_url: "default-profile-icon.png",
  :url =>':s3_domain_url',
  :path => '/:class/:attachment/:id_partition/:style/:filename'
  has_attached_file :cover_photo, default_url: "default-cover-photo.jpg",
  :url =>':s3_domain_url',
  :path => '/:class/:attachment/:id_partition/:style/:filename'
  validates_attachment_content_type :image, :cover_photo, content_type: /\Aimage\/.*\Z/

  # calls class method to make sure there is a session token before validation
  before_validation :ensure_session_token

  # ruby associations - dependent destroy ensures if a User is deleted, the associated data would also be deleted
  has_many :photos,
    dependent: :destroy,
    foreign_key: :user_id,
    class_name: :Photo

  has_many :albums,
    dependent: :destroy,
    foreign_key: :owner_id,
    class_name: :Album

  has_many :comments,
    dependent: :destroy,
    foreign_key: :user_id,
    class_name: :Comment

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
    self.session_token ||= SecureRandom.urlsafe_base64
  end

  # BCrypt hashes submitted password as password digest to encrypt it before storing it for security reasons
  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  # validates submitted password by checking it against hashed password digest
  def is_password?(password)
    BCrypt::Password.new(password_digest).is_password?(password)
  end
end
