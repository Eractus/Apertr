Rails.application.routes.draw do
  namespace :api, defaults: {format: :json} do
    resources :albums, only: [:create, :update, :show, :index, :destroy]
    resources :photos, only: [:create, :update, :show, :index, :destroy] do
      resources :comments, only: [:create, :index]
      resources :tags, only: [:create, :index]
    end
    resources :comments, only: [:show, :destroy]
    resources :tags, only: [:show, :destroy]
    resources :users, only: [:create]
    resource :session, only: [:create, :destroy]
  end
  root "static_pages#root"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
