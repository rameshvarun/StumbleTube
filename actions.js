var async = require('async');
var _ = require('underscore');

/*	num - number of videos to get from reccomendations
	session - session information, must contain access token, as well as list of video ids already watched
	result_callback - calls this callback with the list of video ids*/
module.exports.getVideos = function( num, session, result_callback ) {
	//Query both the user's recommendations and most popular feed in parallel
	async.parallel([
    function(callback) {
			var client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
			client.setCredentials(session.tokens);
			youtube.activities.list({ part : "snippet,contentDetails", home: true, auth: client, maxResults: 50 }, function(err, response) {
				if(err) {
					console.log("Could not get personalized reccomendations.");
					callback(null, []);
				} else {
					var uploads = response.items.filter(function (item) {
						return item.snippet.type == "upload";
					}).map(function(item) {
						return item.contentDetails.upload.videoId;
					});

					var recommendations = response.items.filter(function (item) {
						return item.snippet.type == "recommendation";
					}).map(function(item) {
						return item.contentDetails.recommendation.resourceId.videoId;
					});

					callback(null, recommendations.concat(uploads));
				}
			});
    },
		function(callback) {
			youtube.videos.list({ part : "snippet", chart: "mostPopular", key: API_KEY, maxResults: 50 }, function(err, response) {
				if(err) {
					console.log("Could not get most popular videos feed.");
					callback(null, []);
				} else {
					callback(null, response.items.map(function(item) {
			      return item.id;
			    }));
				}
			});
		}
	],
	function(err, results){
		var videos = _.shuffle(results[0]).concat(_.shuffle(results[1]));
		console.log( videos.length + " videos found.");
		result_callback(videos);
	});
}

/*	video_id - the id of the video to be rated
	rating - "like" or "dislike"
	session - session information, must contain access token, as well as list of video ids already watched */
module.exports.rateVideo = function(video_id, rating, session) {
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

	request.post({
			headers : headers,
			url : recUrl,
			body : videoLikeXML
		}, function (error, response, body) {
			if (!error && response.statusCode == 201)
				console.log("Video successfully rated.");
	});
}
