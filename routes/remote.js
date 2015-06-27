module.exports = function(req, res){
	res.render( 'remote.html', { sessionID: req.query.sessionID, APP_URL : APP_URL } )
};
