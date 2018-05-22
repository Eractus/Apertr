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
user1 = User.create(first_name: "Danny", last_name: "Peng", email: "danny@danny.com", password: "password")
user2 = User.create(first_name: "Herbert", last_name: "Pan", email: "herbert@herbert.com", password: "password")

demo_photo1 = Photo.create(title: "Haleakala", description:"sunrise on haleakala in maui", image: File.open(File.join(Rails.root, '/app/assets/images/haleakala_seed.jpg')), user_id: demo_user.id)
demo_photo2 = Photo.create(title: "Horsehoe Bend", description:"horseshoe bend at page, az", image: File.open(File.join(Rails.root, '/app/assets/images/horseshoe_seed.jpg')), user_id: demo_user.id)
demo_photo3 = Photo.create(title: "Maroon Bells", description:"maroon bells at aspen, co", image: File.open(File.join(Rails.root, '/app/assets/images/maroon_bells_seed.jpg')), user_id: demo_user.id)
demo_photo4 = Photo.create(title: "Taipei 101", description:"view of taipei from elephant mountain", image: File.open(File.join(Rails.root, '/app/assets/images/taipei_seed.jpg')), user_id: user1.id)
demo_photo5 = Photo.create(title: "Antelope Canyon", description:"heart-shaped, flash-flood-formed rocks at upper antelope canyon", image: File.open(File.join(Rails.root, '/app/assets/images/antelope_seed.jpg')), user_id: demo_user.id)
demo_photo6 = Photo.create(title: "Ice Cave", description:"glacier has a natural blue hint", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed1.jpg')), user_id: demo_user.id)
demo_photo7 = Photo.create(title: "Blue Lagoon", description:"perfect balance of hot and cold", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed2.jpg')), user_id: demo_user.id)
demo_photo8 = Photo.create(title: "Hallgrímskirkja", description:"iconic church in the heart of reykjavik", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed3.jpg')), user_id: demo_user.id)
demo_photo9 = Photo.create(title: "Reykjavik", description:"shot of the city out at sea", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed4.jpg')), user_id: demo_user.id)
demo_photo10 = Photo.create(title: "Glacier Lagoon", description:"known locally as jokulsarlon", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed5.jpg')), user_id: demo_user.id)
demo_photo11 = Photo.create(title: "Aurora Borealis", description:"northern lights over snowy landscape", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed6.jpg')), user_id: demo_user.id)
demo_photo12 = Photo.create(title: "Puffin", description:"closeup of this native bird", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed8.jpg')), user_id: demo_user.id)
demo_photo13 = Photo.create(title: "Kirjufell", description:"iconic mountain now made famous by game of thrones", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed9.jpg')), user_id: demo_user.id)
demo_photo14 = Photo.create(title: "Seljalandsfoss", description:"waterfall where you can walk behind", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed10.jpg')), user_id: demo_user.id)
demo_photo15 = Photo.create(title: "Icelandic Architecture", description:"overhead shot of an icelandic city", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed11.jpg')), user_id: demo_user.id)
demo_photo16 = Photo.create(title: "Skogafoss", description:"a powerfall waterfall during winter", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed12.jpg')), user_id: demo_user.id)
demo_photo17 = Photo.create(title: "Godafoss", description:"another powerfall waterfall during winter", image: File.open(File.join(Rails.root, '/app/assets/images/iceland_seed13.jpg')), user_id: demo_user.id)
