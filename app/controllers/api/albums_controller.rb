class Api::AlbumsController < ApplicationController

  before_action :require_logged_in, only: [:create, :update, :destroy]

  def create
    @album = Album.new(album_params)
    @album.owner_id = current_user.id
    photo_ids = JSON.parse(params[:photo_ids])
    if photo_ids && !photo_ids.empty? && @album.save
      photo_ids.each do |photo_id|
        AlbumPhoto.create(album_id: @album.id, photo_id: photo_id)
      end
      render :show
    else
      render json: @album.errors.full_messages, status: 422
    end
  end

  def update
    @album = Album.find(params[:id])
    @album.album_photos.destroy_all
    photo_ids = JSON.parse(params[:photo_ids])
    if photo_ids && !photo_ids.empty? && @album.save
      photo_ids.each do |photo_id|
        AlbumPhoto.create(album_id: @album.id, photo_id: photo_id)
      end
      @album.update_attributes(album_params) if params[:album]
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
