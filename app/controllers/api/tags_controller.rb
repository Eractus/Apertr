class Api::TagsController < ApplicationController
  def create
    # when a user addes a Tag word to the photo, first check if the Tag word they're adding already exists so we don't create duplicates; afterwards, create a new PhotoTag using the id's of the photo and tag instances
    @tag = Tag.find_by(word: params[:tag][:word])
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
    # when a user is deleting a Tag word from a Photo, they are really deleting the row entry in the PhotoTag joins table that's connecting the Tag instance with the Photo instance - we don't want to delete the Tag instance itself as it would remove the Tag word from any Photo that has a PhotoTag with this Tag word as well
    @tag = Tag.find(params[:id])
    photo_id = params[:photoId]
    photo_tag = PhotoTag.find_by(tag_id: @tag.id, photo_id: photo_id)
    photo_tag.destroy
    render :show
  end
end

private

def tag_params
  params.require(:tag).permit(:word)
end
