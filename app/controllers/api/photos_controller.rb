class Api::PhotosController < ApplicationController

  before_action :require_logged_in, only: [:create, :destroy]

  def create
    @photo = Photo.create!(photo_params)
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
  end

  def index
    @photos = Photo.all
    render :index
  end

  def destroy
  end

  private

  def photo_params
    params.require(:photo).permit(:title, :description, :user_id, :img_url)
  end
end
