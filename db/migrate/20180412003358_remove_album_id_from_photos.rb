class RemoveAlbumIdFromPhotos < ActiveRecord::Migration[5.1]
  def change
    remove_column :photos, :album_id, :integer
    remove_column :albums, :owner_id, :integer
    add_column :albums, :owner_id, :integer, null: false
  end
end
