
/*
 * GET home page.
 */
 
 var gauth = require('./../gauth');
 
 
 
exports.index = function(req, res){
	
	
  res.render( 'index.html', { loginurl: gauth.loginurl})
};