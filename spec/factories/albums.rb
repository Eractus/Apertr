FactoryBot.define do
  factory :album do
    title { Faker::Zelda.game }
    description { Faker::Zelda.location }
    owner_id { Faker::Number.non_zero_digit }
  end
end
