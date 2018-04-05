class RemoveUsernameAndAddFirstNameAndLastNameAndBirthMonthAndDayAndYearAndGender < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :username, :string
    add_column :users, :name, :string
    add_column :users, :date_of_birth, :date
    add_column :users, :gender, :string
  end
end
