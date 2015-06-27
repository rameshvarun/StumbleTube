module.exports = function(req, res){
	req.session.tokens = null;
	res.redirect("/");
};
