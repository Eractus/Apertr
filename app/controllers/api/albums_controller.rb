class Api::AlbumsController < ApplicationController

  before_action :require_logged_in, only: [:create, :update, :destroy]

  def create
    @album = Album.new(album_params)
    @album.owner_id = current_user.id
    if @album.save
      render :show
    else
      render json: @album.errors.full_messages, status: 422
    end
  end

  def update
    @album = Album.find(params[:id])
    if @album.update_attributes(album_params)
      render :show
    else
      render json: @album.errors.full_messages, status: 422
    end
  end

  def show
    @album = Album.find(params[:id])
    if @album
      render :show
    else
      render json: @album.errors.full_messages, status: 422
    end
  end

  def index
    @albums = Album.all
    render :index
  end

  def destroy
    @album = Album.find(params[:id])
    @album.destroy!
  end

  private

  def album_params
    params.require(:album).permit(:title, :description)
  end
end
