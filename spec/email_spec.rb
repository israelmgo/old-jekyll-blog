
require 'rubygems'
require 'mail'

describe 'Email' do
	it "should parse incoming emails" do

		mail = Mail.read('spec/fixtures/email.example')

		data = mail.parts.select{|part| part.content_type =~ /text\/plain/}.first.decoded
		yaml_data = YAML.load(data)

		filename = "#{yaml_data['date'].strftime("%Y-%m-%d")}-#{yaml_data['title'].downcase.gsub(/ /,'-')}.md"

		puts data
		#puts filename

		#File.read("_posts/#{filename}").should == data
	end
end
