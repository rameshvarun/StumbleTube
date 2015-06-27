var actions = require("../actions");

module.exports = function(socket) {
  console.log(socket.sessionID);
	console.log('A socket with sessionID ' + socket.sessionID  + ' connected!');

	socket.join(socket.sessionID);

	var remoteurl = APP_URL + "remote?sessionID=" + socket.sessionID;
	var remoteimage = 'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=' + encodeURIComponent(remoteurl);
	socket.emit('qrcode', { url : remoteurl, image: remoteimage });
	socket.emit('success', {});

  // Request new videos
	socket.on('getvideos', function(data){
    actions.getVideos(4, socket.session, function(videos) {
			socket.emit('newvideos', { videos : videos } );
		});
	});

  // Like and dislike videos
	socket.on('likevideo', function(data){
		rateVideo(data.videoid, "like", socket.session);
	});
	socket.on('dislikevideo', function(data){
		rateVideo(data.videoid, "dislike", socket.session);
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
