# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Photo.destroy_all

demo_user = User.create(first_name: "Gabriel", last_name: "Talavera", email: "gabe@gabe.com", password: "password")

photo1 = Photo.create(title: "Haleakala", description:"sunrise on haleakala in maui", user_id: 1)
photo2 = Photo.create(title: "Horsehoe Bend", description:"horseshoe bend at Page, AZ", user_id: 1)
photo3 = Photo.create(title: "Maroon Bells", description:"maroon bells at Aspen, CO", user_id: 1)
photo4 = Photo.create(title: "Taipei 101", description:"view of taipei from elephant mountain", user_id: 1)
photo5 = Photo.create(title: "Antelope Canyon", description:"heart-shaped, flash-flood-formed rocks at upper antelope canyon", user_id: 1)
