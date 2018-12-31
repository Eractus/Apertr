Rails.application.routes.draw do
  # format json tells Rals to look for files with .json when you pass jbuilder template name to render in controller
  namespace :api, defaults: {format: :json} do
    resources :albums, only: [:create, :update, :show, :index, :destroy]
    resources :photos, only: [:create, :update, :show, :index, :destroy] do
      resources :comments, only: [:create, :update, :index]
      resources :tags, only: [:create, :index]
    end
    resources :comments, only: [:show, :destroy]
    resources :tags, only: [:show]
    resources :users, only: [:create, :show, :index]
    resource :session, only: [:create, :destroy]
  end
  # custom route for deleting PhotoTags from photos via the destroy method in tags controller
  delete 'api/tags/:id/photo/:photoId', :to => 'api/tags#destroy'
  # custom route for searching photos by tag word if photo params is passed a tag value
  get 'api/search/photos/:tag', :to => 'api/photos#index', as: 'tag', :defaults => {:format => :json}
  root "static_pages#root"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
