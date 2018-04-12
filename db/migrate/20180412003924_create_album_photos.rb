class CreateAlbumPhotos < ActiveRecord::Migration[5.1]
  def change
    create_table :album_photos do |t|
      t.integer :album_id, null: false
      t.integer :photo_id, null: false

      t.timestamps
      t.index ["album_id"], name: "index_album_photos_on_album_id"
      t.index ["photo_id"], name: "index_album_photos_on_photo_id"
    end
  end
end
