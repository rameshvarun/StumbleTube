
/*
 * GET home page.
 */
 
 var gauth = require('./../gauth');
 
 var request = require('request');
 
var parseString = require('xml2js').parseString;

var db = require('./../db');

var APP_URL = process.env.URL || "http://localhost:3000/"
 
exports.index = function(req, res){

  res.render( 'index.html', { loginurl: gauth.loginurl})
    
  if(req.session.tokens)
  {
	res.redirect('/player');
  }

};




exports.player = function(req, res){
	var recUrl = 'http://gdata.youtube.com/feeds/api/users/default/recommendations?v=2&key=' + gauth.v2_key + "&access_token=" + req.session.tokens.access_token;
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
						
						res.render( 'player.html', { videos: videos, APP_URL: APP_URL})
					}
				);
			  }
			  else
			  {
				res.send("Could not find recommendations.");
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

exports.socket = function(socket)
{

	var hs = socket.handshake;
	console.log('A socket with sessionID ' + hs.sessionID  + ' connected!');
	
	socket.join('hs.sessionID')
	
	var remoteurl = APP_URL + "/remote?sessionID=" + hs.sessionID
	var remoteimage = 'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=' + encodeURIComponent(remoteurl);
	socket.emit('qrcode', { url : remoteurl, image: remoteimage });
	
	socket.emit('success', {});

	socket.on('getvideos', function(data){
		var recUrl = 'http://gdata.youtube.com/feeds/api/users/default/recommendations?v=2&key=' + gauth.v2_key + "&access_token=" + hs.session.tokens.access_token;
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
								hs.session.videos.push(id);
							}
							++i;
						}
						
						socket.emit('newvideos', {videos : videos} );
					}
				);
			  }
			  else
			  {
				res.send("Could not find recommendations.");
			  }
		}  
		)
	});
	
	socket.on('likevideo', function(data){
		var recUrl = 'https://gdata.youtube.com/feeds/api/videos/' + data.videoid + '/ratings';
		
		console.log(recUrl);
		
		request.post(
		
		{
		headers : {'Content-Type' : 'application/atom+xml',
					'Authorization' : 'Bearer ' + hs.session.tokens.access_token,
					'GData-Version' : 2,
					'X-GData-Key' : 'key=' + gauth.v2_key},
		url : recUrl,
		body : videoLikeXML
		},
			
			function (error, response, body)
			{
				if (!error && response.statusCode == 201)
				  {
					console.log("Video successfully liked.");
				  }
			}
			);
	});


}

var videoLikeXML = '<?xml version="1.0" encoding="UTF-8"?><entry xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://gdata.youtube.com/schemas/2007"><yt:rating value="like"/></entry>';
