class DeleteGender < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :gender, :string
  end
end
