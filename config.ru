require "./game"

use Rack::Static, :urls => ["/stylesheets", "/javascripts"], :root => "public"
use Rack::Session::Cookie, :key => 'rack.session',
                           :expire_after => 3600,
                           :secret => 'secret'
use Rack::Reloader

run Game.new
