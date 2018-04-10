class Api::PhotosController < ApplicationController

  before_action :require_logged_in, only: [:create, :update, :destroy]

  def create
    @photo = Photo.new(photo_params)
    @photo.user_id = current_user.id
    @photo.save!
    render :show
  end

  def update
    @photo = Photo.find(params[:id])
    if @photo.update_attributes(photo_params)
      render :show
    else
      render json: @photo.errors.full_messages, status: 422
    end
  end

  def show
    @photo = Photo.find(params[:id])
    if @photo
      render :show
    else
      render json: @photo.errors.full_messages, status: 422
    end
  end

  def index
    @photos = Photo.all
    render :index
  end

  def destroy
    @photo = Photo.find(params[:id])
    @photo.destroy!
  end

  private

  def photo_params
    params.require(:photo).permit(:title, :description, :image)
  end
end
