class Api::TagsController < ApplicationController
  def create
    @tag = Tag.find_by(params[:word])
    if @tag == nil
      @tag = Tag.new(tag_params)
      if !@tag.save
        render json: @tag.errors.full_messages, status: 422
      end
    end
    photo_id = params[:photo_id]
    PhotoTag.create(photo_id: photo_id, tag_id: @tag.id)
    render :show
  end

  def index
    photo_id = params[:photo_id]
    @tags = Photo.find(photo_id).tags
    render :index
  end

  def destroy
    @tag = Tag.find(params[:id])
    @tag.destroy
    render :show
  end
end

private

def tag_params
  params.require(:tag).permit(:word)
end
