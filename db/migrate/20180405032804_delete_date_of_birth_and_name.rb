class DeleteDateOfBirthAndName < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :name, :string
    remove_column :users, :date_of_birth, :string
  end
end
