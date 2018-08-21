FactoryBot.define do
  factory :comment do
    description { Faker::LeagueOfLegends.quote }
    photo_id { Faker::Number.non_zero_digit }
    user_id { Faker::Number.non_zero_digit }
  end
end
