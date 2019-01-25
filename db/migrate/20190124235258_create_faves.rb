class CreateFaves < ActiveRecord::Migration[5.1]
  def change
    create_table :faves do |t|
      t.integer :user_id, null: false
      t.integer :photo_id, null: false

      t.timestamps
      t.index ["user_id"], name: "index_faves_on_user_id"
      t.index ["photo_id"], name: "index_faves_on_photo_id"
    end
  end
end
