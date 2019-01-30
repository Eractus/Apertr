class Api::FavesController < ApplicationController
  def create
    @fave = Fave.new(fave_params)
    @fave.user_id = current_user.id
    @fave.photo_id = params[:photo_id]
    if @fave.save
      render :show
    else
      render json: @fave.errors.full_messages, status: 422
    end
  end

  def index
    @faves = Photo.find(params[:photo_id]).faves
    render :index
  end

  def destroy
    @fave = Fave.find(params[:id])
    @fave.destroy
    render :show
  end
end

private

def fave_params
  params.require(:fave).permit(:photo_id)
end
