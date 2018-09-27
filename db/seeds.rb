# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Photo.destroy_all
Comment.destroy_all
Tag.destroy_all

demo_user = User.create(first_name: "Gabriel", last_name: "Talavera", email: "gabethecommie@gabriel.com", password: "password", image: File.open(File.join(Rails.root, 'app/assets/images/seeds/profile photos/demo-user-profile.jpg')),
cover_photo: File.open(File.join(Rails.root, 'app/assets/images/seeds/cover photos/demo-user-cover.jpg')))
user1 = User.create(first_name: "Danny", last_name: "Peng", email: "weijeipenguin@danny.com", password: "password",
image: File.open(File.join(Rails.root, 'app/assets/images/seeds/profile photos/user1-profile.jpg')),
cover_photo: File.open(File.join(Rails.root, 'app/assets/images/seeds/cover photos/user1-cover.jpg')))
user2 = User.create(first_name: "Herbert", last_name: "Pan", email: "newegg4life@herbert.com", password: "password",
image: File.open(File.join(Rails.root, 'app/assets/images/seeds/profile photos/user2-profile.jpg')),
cover_photo: File.open(File.join(Rails.root, 'app/assets/images/seeds/cover photos/user2-cover.jpg')))
user3 = User.create(first_name: "Polly", last_name: "Wang", email: "igobymanynames@polly.com", password: "password",
image: File.open(File.join(Rails.root, 'app/assets/images/seeds/profile photos/user3-profile.jpg')),
cover_photo: File.open(File.join(Rails.root, 'app/assets/images/seeds/cover photos/user3-cover.jpg')))
user4 = User.create(first_name: "Chris", last_name: "Chun", email: "rootcanalsallday@chris.com", password: "password",
image: File.open(File.join(Rails.root, 'app/assets/images/seeds/profile photos/user4-profile.png')),
cover_photo: File.open(File.join(Rails.root, 'app/assets/images/seeds/cover photos/user4-cover.jpg')))
user5 = User.create(first_name: "Michael", last_name: "Yeh", email: "m1key3h@michael.com", password: "password",
image: File.open(File.join(Rails.root, 'app/assets/images/seeds/profile photos/user5-profile.jpg')),
cover_photo: File.open(File.join(Rails.root, 'app/assets/images/seeds/cover photos/user5-cover.jpg')))
user6 = User.create(first_name: "Jonathan", last_name: "Shao", email: "givemeahug@jonathan.com", password: "password", image: File.open(File.join(Rails.root, 'app/assets/images/seeds/profile photos/user6-profile.jpg')),
cover_photo: File.open(File.join(Rails.root, 'app/assets/images/seeds/cover photos/user6-cover.jpg')))
user7 = User.create(first_name: "Foger", last_name: "Rederer", email: "thegoat@foger.com", password: "password",
image: File.open(File.join(Rails.root, 'app/assets/images/seeds/profile photos/user7-profile.jpg')),
cover_photo: File.open(File.join(Rails.root, 'app/assets/images/seeds/cover photos/user7-cover.jpg')))


seed_photo1 = Photo.create(title: "Ice Cave", description:"glacier has a natural blue hint", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed1.jpg')), user_id: demo_user.id)
seed_photo2 = Photo.create(title: "Blue Lagoon", description:"perfect balance of hot and cold", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed2.jpg')), user_id: demo_user.id)
seed_photo3 = Photo.create(title: "Hallgrímskirkja", description:"iconic church in the heart of reykjavik", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed3.jpg')), user_id: demo_user.id)
seed_photo4 = Photo.create(title: "Reykjavik", description:"shot of the city out at sea", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed4.jpg')), user_id: demo_user.id)
seed_photo5 = Photo.create(title: "Glacier Lagoon", description:"known locally as jokulsarlon", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed5.jpg')), user_id: demo_user.id)
seed_photo6 = Photo.create(title: "Aurora Borealis", description:"northern lights over snowy landscape", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed6.jpg')), user_id: demo_user.id)
seed_photo7 = Photo.create(title: "Gulfoss", description:"popular, majestic falls along the golden circle", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed7.jpg')), user_id: demo_user.id)
seed_photo8 = Photo.create(title: "Puffin", description:"closeup of this native bird", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed8.jpg')), user_id: demo_user.id)
seed_photo9 = Photo.create(title: "Kirjufell", description:"iconic mountain now made famous by game of thrones", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed9.jpg')), user_id: demo_user.id)
seed_photo10 = Photo.create(title: "Seljalandsfoss", description:"waterfall where you can walk behind", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed10.jpg')), user_id: demo_user.id)
seed_photo11 = Photo.create(title: "Icelandic Architecture", description:"overhead shot of an icelandic city", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed11.jpg')), user_id: demo_user.id)
seed_photo12 = Photo.create(title: "Skogafoss", description:"a powerfall waterfall during winter", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed12.jpg')), user_id: demo_user.id)
seed_photo13 = Photo.create(title: "Godafoss", description:"another powerfall waterfall during winter", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/iceland_seed13.jpg')), user_id: demo_user.id)
seed_photo14 = Photo.create(title: "Haleakala Crater", description:"sunrise on haleakala in maui", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/hawaii_seed1.jpg')), user_id: user1.id)
seed_photo15 = Photo.create(title: "Kahakuloa Head", description:"scenic location along northwest coast in maui", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/hawaii_seed2.jpg')), user_id: user1.id)
seed_photo16 = Photo.create(title: "Napali Coast State Park", description:"view of napali from kalalau lookout in kauai", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/hawaii_seed3.jpg')), user_id: user1.id)
seed_photo17 = Photo.create(title: "Waimea Canyon", description:"the grand canyon of the pacific in kauai", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/hawaii_seed4.jpg')), user_id: user1.id)
seed_photo18 = Photo.create(title: "Hanauma Bay", description:"popular snorkeling destination in oahu", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/hawaii_seed5.jpg')), user_id: user1.id)
seed_photo19 = Photo.create(title: "Taipei 101", description:"view of taipei from elephant mountain", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/taipei_seed.jpg')), user_id: user3.id)
seed_photo20 = Photo.create(title: "Horsehoe Bend", description:"horseshoe bend at page, az", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/horseshoe_seed.jpg')), user_id: user4.id)
seed_photo21 = Photo.create(title: "Maroon Bells", description:"maroon bells at aspen, co", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/maroon_bells_seed.jpg')), user_id: user4.id)
seed_photo22 = Photo.create(title: "Antelope Canyon", description:"heart-shaped, flash-flood-formed rocks at upper antelope canyon", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/antelope_seed.jpg')), user_id: user4.id)
seed_photo23 = Photo.create(title: "Man Who Makes it Possible", description:"closeup of a dj and his setup", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/edm_seed1.jpg')), user_id: user5.id)
seed_photo24 = Photo.create(title: "Amongst the Crowd", description:"capturing the essence of the moment", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/edm_seed2.jpg')), user_id: user5.id)
seed_photo25 = Photo.create(title: "Overlooking the Passion", description:"lots happening on the dance floor", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/edm_seed3.jpg')), user_id: user5.id)
seed_photo26 = Photo.create(title: "Self Portrait 1", description:"sup", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/shao_seed1.jpg')), user_id: user6.id)
seed_photo27 = Photo.create(title: "Red Cars", description:"tail light shots are the new thing", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/shao_seed2.jpg')), user_id: user6.id)
seed_photo28 = Photo.create(title: "Honda CRV's", description:"it's going down tonight!", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/shao_seed3.jpg')), user_id: user6.id)
seed_photo29 = Photo.create(title: "2013 NBA Playoffs", description:"stars from advancing teams", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/shao_seed4.jpg')), user_id: user6.id)
seed_photo30 = Photo.create(title: "Original Art", description:"concept art for LINE sticker competition - did not win..", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/shao_seed5.jpg')), user_id: user6.id)
seed_photo31 = Photo.create(title: "Self Portrait 2", description:"cartoon character designed around yours truly", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/shao_seed6.jpg')), user_id: user6.id)
seed_photo32 = Photo.create(title: "Service Ball Toss", description:"look at the arched back - just like the previous logo!", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/tennis_seed1.jpg')), user_id: user7.id)
seed_photo33 = Photo.create(title: "Service Follow Through", description:"very important to generate the desired power or spin", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/tennis_seed2.jpg')), user_id: user7.id)
seed_photo34 = Photo.create(title: "Forehand", description:"got to keep your eyes on the ball", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/tennis_seed3.jpg')), user_id: user7.id)
seed_photo35 = Photo.create(title: "Backhand", description:"follow through before looking away from the ball and back at your opponent", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/tennis_seed4.jpg')), user_id: user7.id)
seed_photo36 = Photo.create(title: "Inside Out Forehand", description:"this shot has slain many foes over the years", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/tennis_seed5.jpg')), user_id: user7.id)
seed_photo37 = Photo.create(title: "Slice Approach", description:"timing is everything to make this shot count...or bust", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/tennis_seed6.jpg')), user_id: user7.id)
seed_photo38 = Photo.create(title: "Game, Set, Match!", description:"winner again", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/tennis_seed7.jpg')), user_id: user7.id)
seed_photo39 = Photo.create(title: "Wilson NCode Six One Tour", description:"weapon of choice for most of 2000's. shanked way too many balls before realizing it's time for a bigger frame.", image: File.open(File.join(Rails.root, '/app/assets/images/seeds/tennis_seed8.jpg')), user_id: user7.id)

photos = Photo.all

tag_words = ["beautiful", "nature", "outdoors", "tennis", "fan", "pentax", "canon", "nikon", "fujifilm", "leica", "iphone", "android", "nofilter", "iceland", "europe", "art", "hawaii", "night", "day", "colors", "awesome", "nice", "cool", "dream", "lights"]

comments = ["Nice job!", "I've been here too.", "Wow!!!", "How...", "This is awesome", "Takes me back.", "...", "Simply amazing.", "Your photography is a gift to all of Apertr's community", "Like I was there myself, thanks!!", "Thx for sharing~!", "If this isn't talent, I don't know what is..", "Sweeeeet", "Dude...", "My man..", "Teach me please", "Where's the like button?!", "Stealing for my FB cover photo :)", "A-mazing!", "No way!!!!!"]

tag_words.each do |word|
  Tag.create(word: word)
end

photos.each do |photo|
  tag_words.each do |tag|
    photo_sample = Photo.all.sample
    tag_sample = Tag.all.sample
    PhotoTag.create(
      photo_id: photo_sample.id,
      tag_id: tag_sample.id
    )
  end
end

User.all.each do |user|
  comments.each do |comment|
    2.times do
      photo_sample = Photo.all.sample
      Comment.create!(
        description: comment,
        user_id: user.id,
        photo_id: photo_sample.id
      )
    end
  end
end
