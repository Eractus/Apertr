class Api::TagsController < ApplicationController
  def create
    @tag = Tag.find_by(word: params[:word])
    if @tag == nil
      @tag = Tag.new(tag_params)
    end
    if !@tag.save
      render json: ['Enter a tag word.'], status: 422
    else
      photo_id = params[:photo_id]
      PhotoTag.create(photo_id: photo_id, tag_id: @tag.id)
      render :show
    end
  end

  def index
    photo_id = params[:photo_id]
    @tags = Photo.find(photo_id).tags
    render :index
  end

  def destroy
    @tag = Tag.find(params[:id])
    photo_id = params[:photoId]
    photo_tag = PhotoTag.find_by(tag_id: @tag.id, photo_id: photo_id)
    photo_tag.destroy
    @tag.destroy
    render :show
  end
end

private

def tag_params
  params.require(:tag).permit(:word)
end
