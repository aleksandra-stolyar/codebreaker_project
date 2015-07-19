require "erb"
require "pry"
require "codebreaker/game"
require "codebreaker/result"
require "codebreaker/user"
require "json"

class Game
  
  def start_game
    @game = @request.session[:game] || Codebreaker::Game.new
  end

  def restart_game
    @game = @request.session[:game] = Codebreaker::Game.new
  end

  def call(env)
    @request = Rack::Request.new(env)
    start_game

    case @request.path
    when '/'
      restart_game
      Rack::Response.new(render("index.html.erb"))
    when '/hint'
      hint
    when '/check'
      check(@request.params['user-code'])
    when '/saved_results'
      users_results = Codebreaker::Result.new
      @results = users_results.results
      Rack::Response.new(render("result.html.erb"))
    when '/save_result'
      users_results = Codebreaker::Result.new
      users_results.add(@request.params['name'], @game.attempt)
      users_results.save!

      response = Rack::Response.new
      response.redirect('/saved_results')
      response.finish
    else
      Rack::Response.new("Not Found", 404)
    end
  end

  def hint
    Rack::Response.new(@game.hint.to_json)
  end

  def check(user_code)
    Rack::Response.new(@game.all_results(user_code).to_json)
  end

  def save(name)
    user = Codebreaker::User.new(name: name, attempt: @game.attempt)
    result = Codebreaker::Result.new
    result.save_results(user)
    
    @results = result.load_results
    Rack::Response.new({})
  end

  def render(template)
    path = File.expand_path("../public/views/#{template}", __FILE__)
    ERB.new(File.read(path)).result(binding)
  end
end


