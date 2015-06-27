module.exports = function(req, res){
  var code = req.query.code;
  oauth2Client.getToken(code, function(err, tokens){
    req.session.tokens = tokens;
		if(!req.session.videos) req.session.videos = [];
		res.redirect('/player');
	});
};
