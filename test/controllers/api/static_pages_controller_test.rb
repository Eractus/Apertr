require 'test_helper'

class Api::StaticPagesControllerTest < ActionDispatch::IntegrationTest
  test "should get root" do
    get api_static_pages_root_url
    assert_response :success
  end

end
