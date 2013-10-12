var APP_URL = process.env.URL || "http://localhost:3000/"

exports.get = function(req, res){

	res.render( 'remote.html', { sessionID: req.query.sessionID, APP_URL : APP_URL } )

};