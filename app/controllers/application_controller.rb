class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user, :logged_in?

  private
    def current_user
      return nil unless session[:session_token]
      @current_user ||= User.find_by(session_token: session[:session_token])
    end

    # ensures a new, different and unique session token is assigned when a user logs in
    def log_in(user)
      current_user = user
      session[:session_token] = user.reset_session_token!
    end

    # double negative - if not not current_user, then there is a current_user :)
    def logged_in?
      !!current_user
    end

    # logs user out by virtue of "deleting" session token
    def log_out
      current_user.reset_session_token!
      session[:session_token] = nil
    end

    def require_logged_in
      unless logged_in?
        render json: { base: ['Please log in first.'] }, status: 401
      end
    end
end
