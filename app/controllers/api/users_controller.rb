class Api::UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if @user.save
        log_in(@user)
        render 'api/users/show'
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def show
    @user = User.find(params[:id])
    if @user
      render 'api/users/show'
    else
      render json: ['User not found'], status: 404
    end
  end

  def index
    @users = User.all
    render 'api/users/index'
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password)
  end
end
