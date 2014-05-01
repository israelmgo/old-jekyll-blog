module Jekyll
	  module NewLinesFilter
			def strip_newlines_with_space(input)
				input.to_s.gsub(/\n+/, ' ')
			end
		end
end
Liquid::Template.register_filter(Jekyll::NewLinesFilter)
