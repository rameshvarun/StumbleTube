var actions = require("../actions");

// Player page
module.exports = function(req, res){
  actions.getVideos(4, req.session, function(videos) {
		res.render( 'player.html', { videos: videos, APP_URL: APP_URL});
	});
}
