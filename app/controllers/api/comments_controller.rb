class Api::CommentsController < ApplicationController
  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id
    @comment.photo_id = params[:photo_id]
    if @comment.save
      render :show
    else
      render json: ["Comment can't be blank"], status: 422
    end
  end

  def index
    @comments = Photo.find(params[:photo_id]).comments
    render :index
  end

  def destroy
    @comment = Comment.find(params[:id])
    @comment.destroy
    render :show
  end
end

private

def comment_params
  params.require(:comment).permit(:description, :user_id, :photo_id)
end
