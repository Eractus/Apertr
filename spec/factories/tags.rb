FactoryBot.define do
  factory :tag do
    title { Faker::Overwatch.hero }
  end
end
