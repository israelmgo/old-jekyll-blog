begin
  require 'rubygems'
  require 'bundler'
rescue LoadError
  raise "Could not load the bundler gem. Install it with `gem install bundler`."
end

begin
  Bundler.setup
rescue Bundler::GemNotFound
  raise RuntimeError, "Bundler couldn't find some gems. Did you run `bundle install`?"
end

task :default => :server
 
desc 'Build and deploy'
task :deploy do
  sh 'rsync -crtzh --progress --delete _site/ penso@plouf.4push.com:/data/www/fabien/penso.info/htdocs/'
end

desc 'Notify Google of the new sitemap'
task :sitemap do
	require 'net/http'
	require 'uri'
	puts '* Pinging Google about our sitemap'
	Net::HTTP.get(
		'www.google.com',
		'/webmasters/tools/ping?sitemap=' +
		URI.escape('http://blog.penso.info/sitemap.xml')
	)
end

desc 'Ping pingomatic'
task :pingomatic do
  begin
    require 'xmlrpc/client'
    puts '* Pinging ping-o-matic'
    XMLRPC::Client.new('rpc.pingomatic.com', '/').call('weblogUpdates.extendedPing', 'Fabien Penso' , 'http://blog.penso.info', 'http://blog.penso.info/atom.xml')
  rescue LoadError
    puts '! Could not ping ping-o-matic, because XMLRPC::Client could not be found.'
  end
end
