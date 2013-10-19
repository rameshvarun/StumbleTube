
/*
 * GET home page.
 */
 
var gauth = require('./../gauth');
 
var request = require('request');
 
var parseString = require('xml2js').parseString;

var db = require('./../db');

var globals = require('./../globals');

var async = require('async');
var fs = require('fs');

//Given a video entry, parses and extracts the id
function getVideoID( entry ) {
	for(var i = 0; i < entry.link.length; ++i)
	{
		if(entry.link[i]["$"].rel == "self") {
			var list = entry.link[i]["$"].href.split("/");
			
			var id = list[list.length - 1];
			return id;
		}
	}
	
	return null;
}


//Index page
exports.index = function(req, res){

  res.render( 'index.html', { loginurl: gauth.loginurl})
   
  //If the user is already logged in, take them to the player
  if(req.session.tokens)
  {
	res.redirect('/player');
  }
};

/*	num - number of videos to get from reccomendations
	session - session information, must contain access token, as well as list of video ids already watched
	result_callback - calls this callback with the list of video ids*/
function getVideos( num, session, result_callback )
{
	var headers = {
	'Content-Type' : 'application/atom+xml',
	'Authorization' : 'Bearer ' + session.tokens.access_token,
	'GData-Version' : 2,
	'X-GData-Key' : 'key=' + gauth.v2_key
	}
	
	//Query both the user's recommendations and most popular feed in parallel
	async.parallel([
		function(callback){
			request.get( globals.MOST_POPULAR_URL,
			function (error, response, body)
			{
				if (!error && response.statusCode == 200)
				{
					parseString( body, function ( err, result)
					{
						callback( null, result.feed.entry );
					});
				}
				else
				{
					console.log("Could not get most popular videos feed.");
					callback( null, [] );
				}
			});
		},
		function(callback){
			request.get(
			{url : globals.RECCOMENDATION_URL, headers : headers},
					
			function (error, response, body)
			{
				if (!error && response.statusCode == 200)
				{
					parseString( body, function ( err, result)
					{
						fs.writeFileSync("reccomendations.log", JSON.stringify( result, undefined, 2 ));
						
						callback( null, result.feed.entry );
					});
				}
				else
				{
					console.log("Could not get personalized reccomendations.");
					callback( null, [] );
				}
			});
		}
	],
	function(err, results){
		entries = []
		if( results[1] ) entries =  entries.concat( results[1] );
		if( results[0] ) entries =  entries.concat( results[0] );
		
		console.log( entries.length + " videos found.");
		
		videos = [];
		i = 0;
		
		while(videos.length < 4) {
			var id = getVideoID( entries[i] );
			
			if( videos.indexOf(id) < 0 &&
				session.videos.indexOf(id) < 0)
			{
				videos.push(id);
				session.videos.push(id);
			}
			
			++i;
		}
		
		fs.writeFileSync("videos.log", JSON.stringify( entries, undefined, 2 ));
		
		result_callback(videos);
	});
}

//Player page
exports.player = function(req, res){

	getVideos(4, req.session,
	function(videos)
	{
		res.render( 'player.html', { videos: videos, APP_URL: globals.APP_URL});
	});
}

var videoLikeXML = '<?xml version="1.0" encoding="UTF-8"?><entry xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://gdata.youtube.com/schemas/2007"><yt:rating value="like"/></entry>';
var videoDislikeXML = '<?xml version="1.0" encoding="UTF-8"?><entry xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://gdata.youtube.com/schemas/2007"><yt:rating value="dislike"/></entry>';

/*	video_id - the id of the video to be rated
	rating - "like" or "dislike"
	session - session information, must contain access token, as well as list of video ids already watched */
function rateVideo( video_id, rating, session)
{
	var recUrl = 'https://gdata.youtube.com/feeds/api/videos/' + video_id + '/ratings';
	
	var headers = {
	'Content-Type' : 'application/atom+xml',
	'Authorization' : 'Bearer ' + session.tokens.access_token,
	'GData-Version' : 2,
	'X-GData-Key' : 'key=' + gauth.v2_key
	}
	
	var body = "";
	
	if(rating == "like") body = videoLikeXML;
	if(rating == "dislike") body = videoDislikeXML;
	
	request.post(
		{
		headers : headers,
		url : recUrl,
		body : videoLikeXML
		},
			
		function (error, response, body)
		{
			if (!error && response.statusCode == 201)
			{
				console.log("Video successfully rated.");
			}
		}
	);
}

exports.socket = function(socket)
{

	var hs = socket.handshake;
	console.log('A socket with sessionID ' + hs.sessionID  + ' connected!');
	
	socket.join(hs.sessionID);
	
	var remoteurl = globals.APP_URL + "remote?sessionID=" + hs.sessionID
	var remoteimage = 'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=' + encodeURIComponent(remoteurl);
	socket.emit('qrcode', { url : remoteurl, image: remoteimage });
	
	socket.emit('success', {});

	socket.on('getvideos', function(data){
	
		getVideos(4, hs.session,
		function(videos)
		{
			socket.emit('newvideos', {videos : videos} );
		});

	});
	
	socket.on('likevideo', function(data){
		rateVideo( data.videoid, "like", hs.session);
	});
	
	socket.on('dislikevideo', function(data){
		rateVideo( data.videoid, "dislike", hs.session);
	});
	
	

	//Commands from the remote - server simply forwards it to the player
	socket.on('refresh', function(data){
		socket.broadcast.to( data.sessionID ).emit('refresh', data)
	});
	socket.on('pickvideo', function(data){
		socket.broadcast.to( data.sessionID ).emit('pickvideo', data)
	});
	socket.on('likevideoRemote', function(data){
		socket.broadcast.to( data.sessionID ).emit('likevideoRemote', data)
	});
	socket.on('dislikevideoRemote', function(data){
		socket.broadcast.to( data.sessionID ).emit('dislikevideoRemote', data)
	});
}

