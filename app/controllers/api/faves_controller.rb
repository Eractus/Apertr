class Api::FavesController < ApplicationController
  def create
    @fave = Fave.find_by(user_id: params[:user_id], photo_id: params[:photo_id])
    if @fave == nil
      @fave = Fave.new(fave_params)
    end
    if !@fave.save
      render json: ['Something went wrong, try again later.'], status: 422
    else
      render :show
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
  params.require(:fave).permit(:user_id, :photo_id)
end
