var gauth = require('./../gauth');

exports.get = function(req, res){
  var code = req.query.code;
  gauth.client.getToken(code,
  
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