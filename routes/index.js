
/*
 * GET home page.
 */
 
 var gauth = require('./../gauth');
 
 var request = require('request');
 
var parseString = require('xml2js').parseString;
 
exports.index = function(req, res){

  res.render( 'index.html', { loginurl: gauth.loginurl})
};

exports.player = function(req, res){
	var recUrl = 'http://gdata.youtube.com/feeds/api/users/default/recommendations?v=2&key=' + 'AI39si5z6jY5ytuT5VlI5T6Q-jfTQzAFqYSsFGPijlxYj0ubALlEiTOWxattlEGnERbz3irBw1HNZjdbDPX04fi6khIkD4B74A' + "&access_token=" + req.session.tokens.access_token;
	console.log(recUrl);
	
	request.get( recUrl,
		function (error, response, body)
		{
			  if (!error && response.statusCode == 200)
			  {
				parseString( body,
					function (err, result)
					{
						videos = [];
						
						i = 0
						while(videos.length < 4)
						{
							var entry = result.feed.entry[i];
							var list = entry.id[0].split(":")
							var id = list[ list.length - 1]
							
							if( videos.indexOf(id) < 0)
							{
								videos.push(id);
								req.session.videos.push(id);
							}
							
							++i;
						}
						
						res.render( 'player.html', { videos: videos})
					}
				);
			  }
		}  
	)
}

exports.oauth2callback = function(req, res){
  var code = req.query.code;
  gauth.client.getToken( code,
  
   function(err, tokens){
		req.session.tokens = tokens;
		
		if( !req.session.videos)
		{
			req.session.videos = []
		}
		
		res.redirect('/player');
	}
  );
  
};