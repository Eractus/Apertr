class CreateAlbums < ActiveRecord::Migration[5.1]
  def change
    create_table :albums do |t|
      t.string :title, null: false
      t.string :description, null: false
      t.integer :owner_id

      t.timestamps
      t.index ["owner_id"], name: "index_albums_on_owner_id"
    end
  end
end
