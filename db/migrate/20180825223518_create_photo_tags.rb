class CreatePhotoTags < ActiveRecord::Migration[5.1]
  def change
    create_table :photo_tags do |t|
      t.integer :photo_id, null: false
      t.integer :tag_id, null: false
      
      t.timestamps
      t.index ["photo_id"], name: "index_photo_tags_on_photo_id"
      t.index ["tag_id"], name: "index_photo_tags_on_tag_id"
    end
  end
end
