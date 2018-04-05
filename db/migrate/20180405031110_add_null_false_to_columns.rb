class AddNullFalseToColumns < ActiveRecord::Migration[5.1]
  def change
    change_column_null :users, :name, false
    change_column_null :users, :date_of_birth, false
  end
end
