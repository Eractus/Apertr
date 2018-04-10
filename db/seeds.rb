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

photo1 = Photo.create(title: "Haleakala", description:"sunrise on haleakala in maui", image: File.open(File.join(Rails.root, '/app/assets/images/haleakala_seed.jpg')), user_id: demo_user.id)
photo2 = Photo.create(title: "Horsehoe Bend", description:"horseshoe bend at Page, AZ", image: File.open(File.join(Rails.root, '/app/assets/images/horseshoe_seed.jpg')), user_id: demo_user.id)
photo3 = Photo.create(title: "Maroon Bells", description:"maroon bells at Aspen, CO", image: File.open(File.join(Rails.root, '/app/assets/images/maroon_bells_seed.jpg')), user_id: demo_user.id)
photo4 = Photo.create(title: "Taipei 101", description:"view of taipei from elephant mountain", image: File.open(File.join(Rails.root, '/app/assets/images/taipei_seed.jpg')), user_id: demo_user.id)
photo5 = Photo.create(title: "Antelope Canyon", description:"heart-shaped, flash-flood-formed rocks at upper antelope canyon", image: File.open(File.join(Rails.root, '/app/assets/images/antelope_seed.jpg')), user_id: demo_user.id)
