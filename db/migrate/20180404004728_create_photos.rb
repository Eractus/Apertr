class CreatePhotos < ActiveRecord::Migration[5.1]
  def change
    create_table :photos, force: :cascade do |t|
      t.string :title, null: false
      t.string :description, null: false
      t.integer :user_id, null: false
      t.integer :album_id, null: false
      t.string :img_url, null: false

      t.timestamps
      t.index ["user_id"], name: "index_photos_on_user_id", unique: true
      t.index ["album_id"], name: "index_photos_on_album_id", unique: true
    end
  end
end
