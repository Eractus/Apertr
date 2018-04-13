class Api::CommentsController < ApplicationController
  def create
    @comments = Photo.find(params[:photo_id]).comments
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id
    @comment.photo_id = params[:photo_id]
    if @comment.save!
      render :index
    else
      render json: @comment.errors.full_messages, status: 422
    end
  end

  def index
    @comments = Photo.find(params[:photo_id]).comments
    render :index
  end

  def destroy
    @comment = Comment.find(comment_params)
    @comment.destroy
    render :index
  end
end

private

def comment_params
  params.require(:comment).permit(:description, :user_id, :photo_id)
end
