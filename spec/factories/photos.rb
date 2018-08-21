FactoryBot.define do
  factory :photo do
    title { Faker::WorldOfWarcraft.hero }
    description { Faker::WorldOfWarcraft.quote }
    user_id { Faker::Number.non_zero_digit }
  end
end
