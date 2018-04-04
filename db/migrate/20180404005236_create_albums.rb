class CreateAlbums < ActiveRecord::Migration[5.1]
  def change
    create_table :albums, force: :cascade do |t|
      t.string :title, null: false
      t.string :description, null: false
      t.integer :owner_id, null: false

      t.timestamps
      t.index ["owner_id"], name: "index_albums_on_owner_id", unique: true
    end
  end
end
